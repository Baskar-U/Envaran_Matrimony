import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, User, MapPin, Calendar, Crown, Lock } from "lucide-react";
import { Link } from "wouter";
import { getDetailedMatches, getRegistrationByUserId, getLikedProfiles } from "@/lib/firebaseAuth";
import { Badge } from "@/components/ui/badge";

interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profileImageUrl?: string;
    age?: number;
    location?: string;
    profession?: string;
  };
}

export default function Matches() {
  const { user, firebaseUser, loading } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(true);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'liked' | 'matches'>('liked');

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

  useEffect(() => {
    if (firebaseUser) {
      fetchRegistrationData();
      fetchMatches();
      fetchLikedProfiles();
    }
  }, [firebaseUser]);

  const fetchRegistrationData = async () => {
    if (!firebaseUser) return;
    
    try {
      const data = await getRegistrationByUserId(firebaseUser.uid);
      setRegistrationData(data);
    } catch (error) {
      console.error('Error fetching registration data:', error);
    }
  };

  const fetchMatches = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoadingMatches(true);
      const detailedMatches = await getDetailedMatches(firebaseUser.uid);
      setMatches(detailedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      });
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchLikedProfiles = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoadingLiked(true);
      console.log('🔍 Fetching liked profiles for user:', firebaseUser.uid);
      const liked = await getLikedProfiles(firebaseUser.uid);
      console.log('📊 Liked profiles fetched:', liked);
      setLikedProfiles(liked);
    } catch (error) {
      console.error('❌ Error fetching liked profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load liked profiles",
        variant: "destructive",
      });
    } finally {
      setLoadingLiked(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />

             {/* Header Section */}
       <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center">
             <h1 className="text-3xl lg:text-4xl font-poppins font-bold mb-3">
               My <span className="text-gold">Matches</span>
             </h1>
             <p className="text-lg text-blue-100 mb-4 max-w-2xl mx-auto">
               Connect with people who are interested in you
             </p>
           </div>
         </div>
       </section>

       {/* Matches Content */}
       <section className="py-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Account Type Badge */}
           <div className="flex justify-center mb-6">
                         <Badge 
               variant={registrationData?.plan === 'premium' ? 'default' : 'secondary'}
               className={`text-lg px-4 py-2 ${
                 registrationData?.plan === 'premium' 
                   ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                   : 'bg-gray-100 text-gray-700'
               }`}
             >
               {registrationData?.plan === 'premium' ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Premium Account
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Free Account
                </>
              )}
            </Badge>
          </div>

                     {/* Tabs */}
           <div className="flex justify-center mb-6">
             <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('liked')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'liked'
                    ? 'bg-white text-royal-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className="h-4 w-4 inline mr-2" />
                You Liked Profiles ({likedProfiles.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'matches'
                    ? 'bg-white text-royal-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Crown className="h-4 w-4 inline mr-2" />
                Your Matches ({matches.length})
                {registrationData?.plan === 'free' && (
                  <Lock className="h-3 w-3 inline ml-1 text-orange-500" />
                )}
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'liked' ? (
            // Liked Profiles Tab
            <>
                             {loadingLiked ? (
                 <div className="text-center py-8">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto"></div>
                   <p className="mt-3 text-gray-600">Loading your liked profiles...</p>
                 </div>
               ) : likedProfiles.length === 0 ? (
                 <div className="text-center py-8">
                   <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Heart className="h-8 w-8 text-gray-400" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">No liked profiles yet</h3>
                   <p className="text-gray-600 mb-6 max-w-md mx-auto">
                     Start browsing profiles and liking people to see them here.
                   </p>
                   <Link href="/profiles">
                     <Button size="lg" className="bg-royal-blue hover:bg-blue-700">
                       Browse Profiles
                     </Button>
                   </Link>
                 </div>
              ) : (
                                 <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                   {likedProfiles.map((liked) => (
                     <Card key={liked.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                       <div className="aspect-square relative">
                        <img
                          src={liked.user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"}
                          alt={liked.user.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h4 className="font-semibold text-lg">{liked.user.name}</h4>
                          <p className="text-sm opacity-90">
                            {liked.user.age && `${liked.user.age} years`}
                          </p>
                        </div>
                      </div>
                                             <CardContent className="p-4">
                         <div className="flex items-center mb-2">
                           <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                           <span className="text-xs text-gray-600 truncate">
                             {liked.user.location || "Location not specified"}
                           </span>
                         </div>
                         <div className="flex items-center mb-3">
                           <User className="h-3 w-3 text-gray-400 mr-1" />
                           <span className="text-xs text-gray-600 truncate">
                             {liked.user.profession || "Profession not specified"}
                           </span>
                         </div>
                         <div className="flex items-center justify-between">
                           <div className="flex items-center text-xs text-gray-500">
                             <Calendar className="h-3 w-3 mr-1" />
                             <span>Liked {new Date(liked.likedAt).toLocaleDateString()}</span>
                           </div>
                           <div className="flex space-x-1">
                             <Link href={`/view-profile/${liked.user.id}`}>
                               <Button size="sm" className="bg-royal-blue hover:bg-blue-700 text-xs px-2 py-1">
                                 <Heart className="h-3 w-3 mr-1" />
                                 View
                               </Button>
                             </Link>
                           </div>
                         </div>
                       </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Matches Tab
            <>
                             {registrationData?.plan === 'free' ? (
                 <div className="text-center py-8">
                   <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Crown className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Feature</h3>
                   <p className="text-gray-600 mb-6 max-w-md mx-auto">
                     Upgrade to Premium to view your mutual matches and see who liked you back!
                   </p>
                   <div className="space-y-3">
                     <Button 
                       size="lg" 
                       className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                       onClick={() => window.location.href = '/premium'}
                     >
                       <Crown className="h-4 w-4 mr-2" />
                       Upgrade to Premium
                     </Button>
                     <div className="text-sm text-gray-500">
                       <p>✅ View mutual matches</p>
                       <p>✅ Priority profile visibility</p>
                       <p>✅ Advanced search filters</p>
                       <p>✅ Unlimited messaging</p>
                     </div>
                   </div>
                 </div>
              ) : (
                <>
                                     {loadingMatches ? (
                     <div className="text-center py-8">
                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto"></div>
                       <p className="mt-3 text-gray-600">Loading your matches...</p>
                     </div>
                   ) : matches.length === 0 ? (
                     <div className="text-center py-8">
                       <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Heart className="h-8 w-8 text-gray-400" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-3">No matches yet</h3>
                       <p className="text-gray-600 mb-6 max-w-md mx-auto">
                         Start browsing profiles and liking people to see your matches here. 
                         When someone likes you back, it's a match!
                       </p>
                       <Link href="/profiles">
                         <Button size="lg" className="bg-royal-blue hover:bg-blue-700">
                           Browse Profiles
                         </Button>
                       </Link>
                     </div>
                  ) : (
                                         <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                       {matches.map((match) => (
                         <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                           <div className="aspect-square relative">
                            <img
                              src={match.otherUser.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"}
                              alt={match.otherUser.fullName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                              <h4 className="font-semibold text-lg">{match.otherUser.fullName}</h4>
                              <p className="text-sm opacity-90">
                                {match.otherUser.age && `${match.otherUser.age} years`}
                              </p>
                            </div>
                          </div>
                                                     <CardContent className="p-4">
                             <div className="flex items-center mb-2">
                               <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                               <span className="text-xs text-gray-600 truncate">
                                 {match.otherUser.location || "Location not specified"}
                               </span>
                             </div>
                             <div className="flex items-center mb-3">
                               <User className="h-3 w-3 text-gray-400 mr-1" />
                               <span className="text-xs text-gray-600 truncate">
                                 {match.otherUser.profession || "Profession not specified"}
                               </span>
                             </div>
                             <div className="flex items-center justify-between">
                               <div className="flex items-center text-xs text-gray-500">
                                 <Calendar className="h-3 w-3 mr-1" />
                                 <span>Matched {new Date(match.createdAt).toLocaleDateString()}</span>
                               </div>
                               <div className="flex space-x-1">
                                 <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                   <MessageSquare className="h-3 w-3 mr-1" />
                                   Message
                                 </Button>
                                 <Link href={`/view-profile/${match.otherUser.id}`}>
                                   <Button size="sm" className="bg-royal-blue hover:bg-blue-700 text-xs px-2 py-1">
                                     <Heart className="h-3 w-3 mr-1" />
                                     View
                                   </Button>
                                 </Link>
                               </div>
                             </div>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
