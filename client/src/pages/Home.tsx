import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import HomeSlider from "@/components/HomeSlider";
import EventSlider from "@/components/EventSlider";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Heart, Users, MessageSquare, Calendar, PenTool, MapPin, Briefcase, CheckCircle, Clock, User as UserIcon, Star, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getProfilesFromRegistrations } from "@/lib/firebaseAuth";
import type { Profile, User } from "@/lib/firebaseAuth";

export default function Home() {
  const { user, firebaseUser, loading } = useAuth();
  const { toast } = useToast();

  // Fetch profiles for the home page (limited to 6)
  const { data: profilesData, isLoading: profilesLoading } = useQuery({
    queryKey: ["home-profiles"],
    queryFn: async () => {
      if (!firebaseUser) {
        console.log('No firebase user, returning empty profiles');
        return { profiles: [], lastDoc: null };
      }
      console.log('Fetching profiles for home page for user:', firebaseUser.uid);
      const result = await getProfilesFromRegistrations(firebaseUser.uid);
      // Limit to 6 profiles for home page
      const limitedProfiles = result.profiles.slice(0, 6);
      console.log('Home page profiles fetched:', limitedProfiles.length);
      return { ...result, profiles: limitedProfiles };
    },
    enabled: !!firebaseUser,
  });

  const profiles = profilesData?.profiles || [];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0" data-testid="home-page">
      <Navigation />

      {/* Hero Slider */}
      <HomeSlider />

      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-16" data-testid="welcome-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-poppins font-bold mb-6" data-testid="text-welcome-title">
              Welcome back, <span className="text-gold">{user?.firstName}!</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto" data-testid="text-welcome-description">
              Complete your profile to start connecting with amazing people who share your values.
            </p>
            
            {(
              <div className="bg-yellow-100 border-l-4 border-gold p-4 max-w-2xl mx-auto rounded-lg">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Complete your profile</strong> to start receiving matches and connecting with other members.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-16 bg-white" data-testid="featured-profiles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-profiles-title">
              Featured <span className="text-royal-blue">Profiles</span>
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-profiles-description">
              Discover amazing people looking for meaningful connections
            </p>
          </div>
          
          {profilesLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
                <p className="mt-4 text-gray-600">Loading profiles...</p>
              </div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20" data-testid="empty-profiles-state">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-gray-600 mb-4">
                No profiles available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are no profiles available at the moment. Check back later!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-testid="profiles-grid">
                {profiles.map((profile: Profile & { user: User }) => (
                  <Card key={profile.id} className="overflow-hidden card-hover" data-testid={`card-profile-${profile.id}`}>
                    <div className="relative">
                      <img
                        src={profile.user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500`}
                        alt={`${profile.user.firstName} ${profile.user.lastName}`}
                        className="w-full h-64 object-cover"
                        data-testid={`img-profile-${profile.id}`}
                      />
                      <div className="absolute top-4 right-4">
                        {profile.verified ? (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1" data-testid={`status-verified-${profile.id}`}>
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        ) : (
                          <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1" data-testid={`status-pending-${profile.id}`}>
                            <Clock size={12} />
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-poppins font-semibold mb-2" data-testid={`text-name-${profile.id}`}>
                        {profile.user.fullName || `${profile.user.firstName} ${profile.user.lastName?.charAt(0) || ''}.`}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span data-testid={`text-location-${profile.id}`}>{profile.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span data-testid={`text-age-${profile.id}`}>{profile.age} years</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span data-testid={`text-profession-${profile.id}`}>
                            {profile.profession === 'Other' && (profile as any).professionOther ? (profile as any).professionOther : profile.profession}
                          </span>
                        </div>
                        {profile.education && (
                          <div className="flex items-center text-gray-600">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            <span data-testid={`text-education-${profile.id}`}>
                              {profile.education === 'Other' && (profile as any).educationOther ? (profile as any).educationOther : profile.education}
                            </span>
                          </div>
                        )}
                        {profile.relationshipStatus && (
                          <div className="flex items-center text-gray-600">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span data-testid={`text-relationship-${profile.id}`}>
                              {profile.relationshipStatus === 'never_married' ? 'Single' :
                               profile.relationshipStatus === 'divorced' ? 'Divorced' :
                               profile.relationshipStatus === 'widowed' ? 'Widowed' :
                               profile.relationshipStatus === 'separated' ? 'Separated' :
                               profile.relationshipStatus}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {profile.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`text-bio-${profile.id}`}>
                          {profile.bio}
                        </p>
                      )}
                      
                      <Link href={`/view-profile/${profile.userId}`}>
                        <Button
                          className="w-full bg-royal-blue hover:bg-blue-700 text-white transition-colors"
                          data-testid={`button-view-profile-${profile.id}`}
                        >
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/profiles">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-royal-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                    data-testid="button-view-more-profiles"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    View More Profiles
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <EventSlider />
      <Footer />
    </div>
  );
}
