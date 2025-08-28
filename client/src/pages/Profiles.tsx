import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import ProfileCard from "@/components/ProfileCard";
import EventSlider from "@/components/EventSlider";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, RefreshCw } from "lucide-react";
import { getProfilesFromRegistrations } from "@/lib/firebaseAuth";
import type { Profile, User } from "@/lib/firebaseAuth";

export default function Profiles() {
  const auth = useAuth();
  const { user, firebaseUser, loading } = auth;
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    ageRange: "all",
    location: "",
    profession: "all",
    education: "all",
    relationshipStatus: "all",
    verified: "all",
  });

  useEffect(() => {
    if (!loading && !firebaseUser) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [firebaseUser, loading, toast]);

  const { data: profilesData, isLoading: profilesLoading, refetch } = useQuery({
    queryKey: ["registration-profiles"],
    queryFn: async () => {
      if (!firebaseUser) {
        console.log('No firebase user, returning empty profiles');
        return { profiles: [], lastDoc: null };
      }
      console.log('Fetching profiles from registrations for user:', firebaseUser.uid);
      const result = await getProfilesFromRegistrations(firebaseUser.uid);
      console.log('Registration profiles fetched:', result.profiles);
      console.log('Number of profiles:', result.profiles.length);
      return result;
    },
    enabled: !!firebaseUser,
    staleTime: 0, // Always consider data stale to force fresh fetch
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Force refresh when component mounts to get latest data
  useEffect(() => {
    if (firebaseUser) {
      console.log('Forcing profiles refresh on mount...');
      refetch();
    }
  }, [firebaseUser, refetch]);

  const profiles = profilesData?.profiles || [];
  console.log('Current profiles state:', profiles);
  
  // Debug profile images
  profiles.forEach((profile: Profile & { user: User }, index: number) => {
    console.log(`Profile ${index + 1} (${profile.user.firstName}):`, {
      userId: profile.userId,
      profileImageUrl: profile.user.profileImageUrl ? 'Has image' : 'No image',
      profileImageUrlLength: profile.user.profileImageUrl?.length || 0
    });
  });

  const filteredProfiles = profiles.filter((profile: Profile & { user: User }) => {
    // Handle search term
    const matchesSearch = !searchTerm || 
      (profile.user.firstName && profile.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.profession && profile.profession.toLowerCase().includes(searchTerm.toLowerCase()));

    // Handle verified filter
    const matchesVerified = !filters.verified || filters.verified === "all" || 
      (filters.verified === "verified" && profile.verified) ||
      (filters.verified === "unverified" && !profile.verified);

    // Handle location filter
    const matchesLocation = !filters.location || 
      (profile.location && profile.location.toLowerCase().includes(filters.location.toLowerCase()));

    // Handle profession filter
    const matchesProfession = !filters.profession || filters.profession === "all" || 
      (profile.profession && profile.profession.toLowerCase().includes(filters.profession.toLowerCase()));

    // Handle relationship status filter
    const matchesRelationshipStatus = !filters.relationshipStatus || filters.relationshipStatus === "all" || 
      (profile.relationshipStatus && profile.relationshipStatus === filters.relationshipStatus);

    return matchesSearch && matchesVerified && matchesLocation && matchesProfession && matchesRelationshipStatus;
  });

  if (loading || profilesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
            <p className="mt-4 text-gray-600">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0" data-testid="profiles-page">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-16" data-testid="profiles-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-poppins font-bold mb-6" data-testid="text-profiles-title">
              Find Your <span className="text-gold">Perfect Match</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto" data-testid="text-profiles-description">
              Browse through verified profiles of individuals seeking meaningful relationships - whether single, divorced, widowed, or separated
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b" data-testid="search-filters-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, location, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-royal-blue"
                data-testid="input-search"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, verified: value }))}>
                <SelectTrigger className="w-40" data-testid="select-verified-filter">
                  <SelectValue placeholder="All Profiles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value }))}>
                <SelectTrigger className="w-32" data-testid="select-age-filter">
                  <SelectValue placeholder="Any Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Age</SelectItem>
                  <SelectItem value="25-30">25-30</SelectItem>
                  <SelectItem value="30-35">30-35</SelectItem>
                  <SelectItem value="35-40">35-40</SelectItem>
                  <SelectItem value="40+">40+</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, relationshipStatus: value }))}>
                <SelectTrigger className="w-40" data-testid="select-relationship-filter">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="never_married">Single</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon"
                className="border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
                data-testid="button-filter"
              >
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || Object.values(filters).some(v => v && v !== "all")) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-royal-blue text-white px-3 py-1 rounded-full text-sm" data-testid="tag-search-term">
                  Search: {searchTerm}
                </span>
              )}
              {filters.verified && filters.verified !== "all" && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm" data-testid="tag-verified-filter">
                  {filters.verified === "verified" ? "Verified" : "Unverified"}
                </span>
              )}
              {filters.ageRange && filters.ageRange !== "all" && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm" data-testid="tag-age-filter">
                  Age: {filters.ageRange}
                </span>
              )}
              {filters.relationshipStatus && filters.relationshipStatus !== "all" && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm" data-testid="tag-relationship-filter">
                  {filters.relationshipStatus === 'never_married' ? 'Single' :
                   filters.relationshipStatus === 'divorced' ? 'Divorced' :
                   filters.relationshipStatus === 'widowed' ? 'Widowed' :
                   filters.relationshipStatus === 'separated' ? 'Separated' :
                   filters.relationshipStatus}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ ageRange: "all", location: "", profession: "all", education: "all", relationshipStatus: "all", verified: "all" });
                }}
                className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                data-testid="button-clear-filters"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-16" data-testid="profiles-grid-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-20" data-testid="empty-profiles-state">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-gray-600 mb-4">
                No profiles found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || Object.values(filters).some(v => v)
                  ? "Try adjusting your search criteria or filters to find more matches."
                  : "There are no profiles available at the moment. Check back later!"
                }
              </p>
              {(searchTerm || Object.values(filters).some(v => v && v !== "all")) && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ ageRange: "all", location: "", profession: "all", education: "all", relationshipStatus: "all", verified: "all" });
                  }}
                  className="mt-4 bg-royal-blue hover:bg-blue-700"
                  data-testid="button-clear-all-filters"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-poppins font-bold text-charcoal" data-testid="text-profiles-count">
                  {filteredProfiles.length} Profile{filteredProfiles.length !== 1 ? 's' : ''} Found
                </h2>
                <div className="text-sm text-gray-600">
                  Showing verified and unverified profiles
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="profiles-grid">
                {filteredProfiles.map((profile: Profile & { user: User }) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
              
              {filteredProfiles.length > 0 && (
                <div className="text-center mt-12">
                  <Button
                    size="lg"
                    className="bg-royal-blue text-white hover:bg-blue-700 transition-all duration-300"
                    data-testid="button-load-more"
                  >
                    Load More Profiles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <EventSlider />
      <Footer />
    </div>
  );
}
