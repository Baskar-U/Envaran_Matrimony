import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  User as UserIcon,
  MessageSquare,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  BookOpen,
  Users,
  Star,
  Home,
  GraduationCap,
  Heart as HeartIcon,
  Coffee,
  Wine,
  Leaf,
  Baby
} from "lucide-react";
import { Link } from "wouter";
import { getRegistrationByUserId, createLikeWithNotification, checkMutualLike, createMatchWithNotification } from "@/lib/firebaseAuth";

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileData {
  id: string;
  userId: string;
  age: number;
  gender: string;
  location: string;
  profession: string;
  professionOther?: string;
  bio: string;
  education: string;
  educationOther?: string;
  educationSpecification?: string;
  educationSpecificationOther?: string;
  relationshipStatus: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  smoking?: string;
  drinking?: string;
  lifestyle?: string;
  hobbies?: string;
  kidsPreference: string;
  verified: boolean;
}

interface RegistrationData {
  id: string;
  userId: string;
  status: string;
  submittedAt: Date;
  
  // Personal Details
  name: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
  motherTongue: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  
  // Family Details
  fatherName: string;
  fatherJob: string;
  fatherAlive: string;
  motherName: string;
  motherJob: string;
  motherAlive: string;
  orderOfBirth: string;
  
  // Physical Attributes
  height: string;
  weight: string;
  bloodGroup: string;
  complexion: string;
  disability: string;
  diet: string;
  
  // Education & Occupation
  qualification: string;
  incomePerMonth: string;
  job: string;
  placeOfJob: string;
  
  // Communication Details
  presentAddress: string;
  permanentAddress: string;
  contactNumber: string;
  contactPerson: string;
  
  // Astrology Details
  ownHouse: string;
  star: string;
  laknam: string;
  timeOfBirth: {
    hour: string;
    minute: string;
    period: string;
  };
  raasi: string;
  gothram: string;
  placeOfBirth: string;
  padam: string;
  dossam: string;
  nativity: string;
  
  // Horoscope Details
  horoscopeRequired: string;
  balance: string;
  dasa: string;
  dasaPeriod: {
    years: string;
    months: string;
    days: string;
  };
  
  // Partner Expectations
  partnerExpectations: {
    job: string;
    preferredAgeFrom: number;
    preferredAgeTo: number;
    jobPreference: string;
    diet: string;
    maritalStatus: string[];
    subCaste: string;
    comments: string;
  };
  
  // Additional Details
  otherDetails: string;
  profileImageUrl?: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  createdAt: string;
}

export default function ViewProfile() {
  const [location, setLocation] = useLocation();
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [currentUserRegistration, setCurrentUserRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // Extract userId from URL parameters
  const [, params] = useRoute("/view-profile/:userId");
  const userId = params?.userId;

  // Fetch current user's registration data to check premium status
  useEffect(() => {
    const fetchCurrentUserRegistration = async () => {
      if (firebaseUser) {
        try {
          const data = await getRegistrationByUserId(firebaseUser.uid);
          setCurrentUserRegistration(data);
        } catch (error) {
          console.error('Error fetching current user registration:', error);
        }
      }
    };

    fetchCurrentUserRegistration();
  }, [firebaseUser]);

  const likeMutation = useMutation({
    mutationFn: async (likedId: string) => {
      if (!firebaseUser) throw new Error('User not authenticated');
      
      // Create the like with notification
      await createLikeWithNotification(firebaseUser.uid, likedId);
      
      // Check if it's a mutual like
      const isMutual = await checkMutualLike(firebaseUser.uid, likedId);
      
      if (isMutual) {
        // Create a match with notifications
        await createMatchWithNotification(firebaseUser.uid, likedId);
      }
      
      return { matched: isMutual };
    },
    onSuccess: (data: any) => {
      setLiked(true);
      if (data.matched) {
        toast({
          title: "It's a Match! 🎉",
          description: "You both liked each other! Start chatting now.",
        });
      } else {
        toast({
          title: "Like Sent!",
          description: "Your like has been sent successfully.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["registration-profiles"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send like. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Fetch registration data (since users collection is deleted)
      const registrationData = await getRegistrationByUserId(userId);

      if (registrationData) {
        // Create profile data from registration
        const profileData: ProfileData = {
          id: registrationData.userId,
          userId: registrationData.userId,
          age: registrationData.dateOfBirth ? calculateAge(registrationData.dateOfBirth) : 0,
          gender: registrationData.gender || '',
          location: registrationData.presentAddress || '',
          profession: registrationData.job || '',
          professionOther: '',
          bio: registrationData.otherDetails || '',
          education: registrationData.qualification || '',
          educationOther: '',
          educationSpecification: '',
          educationSpecificationOther: '',
          relationshipStatus: registrationData.maritalStatus || '',
          religion: registrationData.religion || '',
          caste: registrationData.caste || '',
          subCaste: registrationData.subCaste || '',
          motherTongue: registrationData.motherTongue || '',
          smoking: '',
          drinking: '',
          lifestyle: '',
          hobbies: '',
          kidsPreference: '',
          verified: true
        };

        // Create user data from registration
        const userData: UserData = {
          id: registrationData.userId,
          firstName: registrationData.name ? registrationData.name.split(' ')[0] : '',
          lastName: registrationData.name ? registrationData.name.split(' ').slice(1).join(' ') : '',
          email: '', // Not available in registrations
          profileImageUrl: registrationData.profileImageUrl || '', // Use profileImageUrl from registration data
          createdAt: registrationData.submittedAt ? registrationData.submittedAt.toString() : new Date().toString()
        };

        setProfile(profileData);
        setUser(userData);
        setRegistration(registrationData);
      } else {
        toast({
          title: "Profile Not Found",
          description: "The profile you're looking for doesn't exist.",
          variant: "destructive",
        });
        setLocation('/profiles');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      setLocation('/profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!liked && firebaseUser && userId) {
      likeMutation.mutate(userId);
    }
  };

  const getRelationshipStatusText = (status: string) => {
    switch (status) {
      case 'never_married': return 'Single';
      case 'divorced': return 'Divorced';
      case 'widowed': return 'Widowed';
      case 'separated': return 'Separated';
      default: return status;
    }
  };

  const getKidsPreferenceText = (preference: string) => {
    switch (preference) {
      case 'want_kids': return 'Want Kids';
      case 'have_kids': return 'Have Kids';
      case 'dont_want_kids': return "Don't Want Kids";
      case 'open_to_kids': return 'Open to Kids';
      default: return preference;
    }
  };

  // Helper function to blur contact information
  const blurContactInfo = (text: string) => {
    if (!text) return '';
    if (text.length <= 4) return '*'.repeat(text.length);
    return text.slice(0, 2) + '*'.repeat(text.length - 4) + text.slice(-2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">Profile not found.</p>
            <Link href="/profiles">
              <Button className="mt-4">Back to Profiles</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link href="/profiles">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profiles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Biodata Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Biodata Card */}
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Decorative Border */}
            <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
            </div>

            {/* Content */}
            <div className="relative p-8">
              {/* Header with Ganesha */}
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🕉️</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">|| SHREE GANESHAYA NAMAH ||</h1>
                <h2 className="text-3xl font-bold text-gray-800">BIODATA</h2>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Personal Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Details Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">PERSONAL DETAILS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Name:</label>
                        <p className="text-gray-900 font-medium">{registration?.name || `${user.firstName} ${user.lastName}` || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Date of Birth:</label>
                        <p className="text-gray-900">{registration?.dateOfBirth || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Time of Birth:</label>
                        <p className="text-gray-900">
                          {registration?.timeOfBirth ? 
                            `${registration.timeOfBirth.hour}:${registration.timeOfBirth.minute} ${registration.timeOfBirth.period}` : 
                            'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Place of Birth:</label>
                        <p className="text-gray-900">{registration?.placeOfBirth || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Rashi:</label>
                        <p className="text-gray-900">{registration?.raasi || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Manglik:</label>
                        <p className="text-gray-900">{registration?.laknam === 'Manglik' ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Religion:</label>
                        <p className="text-gray-900">{registration?.religion || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Caste:</label>
                        <p className="text-gray-900">{registration?.caste || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Weight:</label>
                        <p className="text-gray-900">{registration?.weight ? `${registration.weight} KG` : 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Height:</label>
                        <p className="text-gray-900">{registration?.height || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Blood Group:</label>
                        <p className="text-gray-900">{registration?.bloodGroup || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Complexion:</label>
                        <p className="text-gray-900">{registration?.complexion || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Education:</label>
                        <p className="text-gray-900">{registration?.qualification || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Occupation:</label>
                        <p className="text-gray-900">{registration?.job || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Income:</label>
                        <p className="text-gray-900">{registration?.incomePerMonth ? `${registration.incomePerMonth} LPA` : 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Address:</label>
                        <p className="text-gray-900">{registration?.presentAddress || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Family Details Section */}
                  {registration && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">FAMILY DETAILS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Father Name:</label>
                          <p className="text-gray-900">{registration.fatherName || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Occupation:</label>
                          <p className="text-gray-900">{registration.fatherJob || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Mother Name:</label>
                          <p className="text-gray-900">{registration.motherName || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Occupation:</label>
                          <p className="text-gray-900">{registration.motherJob || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Sister:</label>
                          <p className="text-gray-900">{registration.orderOfBirth === 'First' ? '1 Unmarried' : 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Brother:</label>
                          <p className="text-gray-900">No</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Details Section */}
                  {registration && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">CONTACT DETAILS</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Email:</label>
                          {currentUserRegistration?.plan === 'premium' ? (
                            <p className="text-gray-900">{user.email || 'Not available'}</p>
                          ) : (
                            <p className="text-gray-900 blur-sm select-none" title="Email is blurred for privacy">
                              {user.email || 'Not available'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Address:</label>
                          <p className="text-gray-900">{registration.presentAddress || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Contact No.:</label>
                          {currentUserRegistration?.plan === 'premium' ? (
                            <p className="text-gray-900 font-mono">{registration.contactNumber || 'Not specified'}</p>
                          ) : (
                            <p className="text-gray-900 font-mono">{blurContactInfo(registration.contactNumber)}</p>
                          )}
                        </div>
                        
                        {/* Premium upgrade prompt for free users */}
                        {currentUserRegistration?.plan !== 'premium' && (
                          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-orange-800">Upgrade to Premium</h4>
                                <p className="text-sm text-orange-700">View contact details and unlock all features</p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={() => window.location.href = '/premium'}
                              >
                                Upgrade
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      onClick={handleLike}
                      disabled={liked || likeMutation.isPending}
                      className={`flex-1 transition-colors ${
                        liked 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-royal-blue hover:bg-blue-700'
                      } text-white`}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                      {liked ? 'Liked' : likeMutation.isPending ? 'Liking...' : 'Like Profile'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex-1 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </div>

                {/* Right Column - Profile Picture */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <div className="relative mb-6">
                        <img
                          src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500`}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-80 object-cover rounded-lg border-4 border-yellow-400"
                        />
                        <div className="absolute top-4 right-4">
                          {profile.verified ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500 text-white">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-2 text-gray-800">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {registration?.age || (registration?.dateOfBirth ? calculateAge(registration.dateOfBirth) : 'Not specified')} years old
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-center text-gray-600">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-600">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>{profile.profession}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
