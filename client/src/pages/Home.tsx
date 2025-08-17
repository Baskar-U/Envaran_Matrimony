import { useEffect } from "react";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import EventSlider from "@/components/EventSlider";
import { Link } from "wouter";
import { Heart, Users, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="home-page">
      <Navigation />

      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-16" data-testid="welcome-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-poppins font-bold mb-6" data-testid="text-welcome-title">
              Welcome back, <span className="text-gold">{user?.firstName}!</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto" data-testid="text-welcome-description">
              {user?.profile 
                ? "Your profile is ready! Start browsing and connect with amazing people."
                : "Complete your profile to start connecting with amazing people who share your values."
              }
            </p>
            
            {!user?.profile && (
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

      {/* Quick Actions */}
      <section className="py-16 bg-white" data-testid="quick-actions-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-actions-title">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-actions-description">
              Everything you need to find your perfect match
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/profiles">
              <Card className="cursor-pointer card-hover h-full" data-testid="card-browse-profiles">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Browse Profiles</h3>
                  <p className="text-gray-600">Discover compatible matches near you</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/matches">
              <Card className="cursor-pointer card-hover h-full" data-testid="card-my-matches">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">My Matches</h3>
                  <p className="text-gray-600">View your mutual connections</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/messages">
              <Card className="cursor-pointer card-hover h-full" data-testid="card-messages">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Messages</h3>
                  <p className="text-gray-600">Chat with your connections</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="cursor-pointer card-hover h-full" data-testid="card-events">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-poppins font-semibold mb-2">Event Services</h3>
                <p className="text-gray-600">Plan your perfect wedding</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profile Status */}
      {user?.profile && (
        <section className="py-16 bg-gray-50" data-testid="profile-status-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-poppins font-bold text-charcoal mb-2" data-testid="text-profile-status">
                      Your Profile Status
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {user.profile.verified 
                        ? "✅ Your profile is verified and visible to other members"
                        : "⏳ Your profile is under review for verification"
                      }
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-royal-blue">Active</p>
                        <p className="text-sm text-gray-600">Status</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-royal-blue">{user.profile.age}</p>
                        <p className="text-sm text-gray-600">Age</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-royal-blue">{user.profile.location}</p>
                        <p className="text-sm text-gray-600">Location</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-royal-blue">{user.profile.profession}</p>
                        <p className="text-sm text-gray-600">Profession</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`}
                      alt="Your profile"
                      className="w-24 h-24 rounded-full object-cover"
                      data-testid="img-user-profile"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <EventSlider />
    </div>
  );
}
