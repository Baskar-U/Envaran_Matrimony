import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Settings, LogOut, Heart, Trash2, Users, Home, Calendar, Crown, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { logout, deleteAccount, getRegistrationByUserId } from "@/lib/firebaseAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import AdminPasswordModal from "@/components/AdminPasswordModal";

export default function Navigation() {
  const { user, firebaseUser, loading } = useAuth();
  const { isAdmin, verifyAdminPassword, needsPassword } = useAdmin();
  const [location, setLocation] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Fetch registration data for user name
  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (firebaseUser) {
        try {
          const data = await getRegistrationByUserId(firebaseUser.uid);
          setRegistrationData(data);
        } catch (error) {
          console.error('Error fetching registration data for navigation:', error);
        }
      }
    };

    fetchRegistrationData();
  }, [firebaseUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to landing page after logout
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => location === path;

  // Mobile Navigation Component
  const MobileNavigation = () => {
    if (!firebaseUser || loading) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/home"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/home")
                ? "text-royal-blue"
                : "text-gray-600"
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            href="/profiles"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/profiles")
                ? "text-royal-blue"
                : "text-gray-600"
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs">Profiles</span>
          </Link>
          
          <Link
            href="/matches"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/matches")
                ? "text-royal-blue"
                : "text-gray-600"
            }`}
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">Matches</span>
          </Link>
          
          <Link
            href="/events"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/events")
                ? "text-royal-blue"
                : "text-gray-600"
            }`}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Events</span>
          </Link>
          
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/profile")
                ? "text-royal-blue"
                : "text-gray-600"
            }`}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
          

        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Envaran Matrimony" className="h-8 w-8 rounded-full" />
              <span className="text-xl font-bold text-gray-900">Envaran Matrimony</span>
            </Link>

            {/* Right side - Navigation Links and Auth buttons */}
            <div className="flex items-center space-x-8">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/home"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/home")
                      ? "text-royal-blue"
                      : "text-gray-600 hover:text-royal-blue"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/profiles"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/profiles")
                      ? "text-royal-blue"
                      : "text-gray-600 hover:text-royal-blue"
                  }`}
                >
                  Find Matches
                </Link>
                <Link
                  href="/events"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/events")
                      ? "text-royal-blue"
                      : "text-gray-600 hover:text-royal-blue"
                  }`}
                >
                  Events
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/about")
                      ? "text-royal-blue"
                      : "text-gray-600 hover:text-royal-blue"
                  }`}
                >
                  About Us
                </Link>
              </div>

              {/* Auth buttons or user menu */}
              <div className="flex items-center space-x-4">
                          {firebaseUser && !loading ? (
              <>
                {/* Notification Bell */}
                <NotificationsDropdown />

                  {/* User Profile Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center space-x-2"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="w-8 h-8 rounded-full bg-royal-blue flex items-center justify-center text-white text-sm font-semibold">
                        {registrationData?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || firebaseUser?.displayName?.charAt(0) || "U"}
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {registrationData?.name || user?.firstName || user?.fullName || firebaseUser?.displayName || "User"}
                        </span>
                        <Badge 
                          variant={registrationData?.plan === 'premium' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            registrationData?.plan === 'premium' 
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {registrationData?.plan === 'premium' ? 'Premium' : 'Free'}
                        </Badge>
                      </div>
                    </Button>
                    
                    {/* Custom Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              window.location.href = "/profile";
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <User className="mr-3 h-4 w-4" />
                            My Profile
                          </button>
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              window.location.href = "/matches";
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <Heart className="mr-3 h-4 w-4" />
                            My Matches
                          </button>

                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              window.location.href = "/settings";
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                          </button>
                          
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              window.location.href = "/about";
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <span className="mr-3 h-4 w-4">ℹ️</span>
                            About Us
                          </button>
                          
                          {/* Admin Payments Link - Show for admin emails */}
                          {(isAdmin || needsPassword) && (
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                if (isAdmin) {
                                  window.location.href = "/payments";
                                } else {
                                  setShowPasswordModal(true);
                                }
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
                            >
                              <CreditCard className="mr-3 h-4 w-4" />
                              Payment Management
                            </button>
                          )}
                          
                          {/* Premium Button - Only show for free users */}
                          {registrationData?.plan !== 'premium' && (
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                window.location.href = "/premium";
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 cursor-pointer"
                            >
                              <Crown className="mr-3 h-4 w-4" />
                              Upgrade to Premium
                            </button>
                          )}
                          <hr className="my-1" />
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleLogout();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                          </button>

                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/registration">
                    <Button size="sm" className="bg-royal-blue hover:bg-blue-700">
                      Register Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Admin Password Modal */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onVerify={verifyAdminPassword}
        userEmail={firebaseUser?.email || ''}
      />
    </>
  );
}
