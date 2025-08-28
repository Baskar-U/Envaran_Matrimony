import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, updateProfile, createProfile, getRegistrationByUserId } from "@/lib/firebaseAuth";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, Save, X, Camera, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
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
  profileImageUrl?: string;
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
}

export default function Profile() {
  const { user, firebaseUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, [firebaseUser]);

  const fetchProfile = async () => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    try {
      // Fetch registration data first (since it contains all the detailed information)
      const registrationData = await getRegistrationByUserId(firebaseUser.uid);
      
      if (registrationData) {
        console.log('Registration data fetched:', registrationData);
        setRegistration(registrationData);
        
        // Create profile data from registration
        const profileData: ProfileData = {
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
          verified: true,
          profileImageUrl: registrationData.profileImageUrl || ''
        };
        console.log('Profile data created:', profileData);
        setProfile(profileData);
      } else {
        // Fallback to old profile data if no registration exists
        const profileData = await getProfile(firebaseUser.uid);
        
        if (profileData) {
          const mergedProfile = {
            ...profileData,
            age: profileData.age || (user?.dateOfBirth ? calculateAge(user.dateOfBirth) : 0),
            gender: profileData.gender || user?.gender || '',
            religion: profileData.religion || user?.religion || '',
            caste: profileData.caste || user?.caste || '',
            subCaste: profileData.subCaste || user?.subCaste || '',
            profileImageUrl: profileData.profileImageUrl || user?.profileImageUrl || ''
          };
          setProfile(mergedProfile);
        } else {
          // Initialize empty profile
          const initialProfile = {
            age: user?.dateOfBirth ? calculateAge(user.dateOfBirth) : 0,
            gender: user?.gender || '',
            location: '',
            profession: '',
            professionOther: '',
            bio: '',
            education: '',
            educationOther: '',
            educationSpecification: '',
            educationSpecificationOther: '',
            relationshipStatus: '',
            religion: user?.religion || '',
            caste: user?.caste || '',
            subCaste: user?.subCaste || '',
            motherTongue: '',
            smoking: '',
            drinking: '',
            lifestyle: '',
            hobbies: '',
            kidsPreference: '',
            verified: false,
            profileImageUrl: user?.profileImageUrl || ''
          };
          setProfile(initialProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !firebaseUser) return;

    setUploadingPhoto(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
      });
      reader.readAsDataURL(selectedImage);
      const imageBase64 = await base64Promise;

             // Update profile with base64 image data
       if (profile && registration) {
         const updatedProfile = { ...profile, profileImageUrl: imageBase64 };
         setProfile(updatedProfile);
         
         // Always use the correct userId from registration data to update the document
         const { doc, updateDoc } = await import('firebase/firestore');
         const { db } = await import('@/lib/firebase');
         
         // Use the registration document ID (which is the correct userId) to update
         const registrationRef = doc(db, 'registrations', registration.id);
         
         // Update the existing registration document with new profileImageUrl
         await updateDoc(registrationRef, {
           profileImageUrl: imageBase64
         });
         
         console.log('✅ Profile photo updated in existing registration document using userId:', registration.id);
       }

      // Clear selected image and preview
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh profile data to show the updated photo
      await fetchProfile();

      toast({
        title: "Photo uploaded successfully!",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!firebaseUser) return;

    try {
             // Update profile to remove image URL
       if (profile && registration) {
         const updatedProfile = { ...profile, profileImageUrl: '' };
         setProfile(updatedProfile);
         
         // Always use the correct userId from registration data to update the document
         const { doc, updateDoc } = await import('firebase/firestore');
         const { db } = await import('@/lib/firebase');
         
         // Use the registration document ID (which is the correct userId) to update
         const registrationRef = doc(db, 'registrations', registration.id);
         
         // Update the existing registration document to remove profileImageUrl
         await updateDoc(registrationRef, {
           profileImageUrl: ''
         });
         
         console.log('✅ Profile photo removed from existing registration document using userId:', registration.id);
       }

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed.",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!profile || !firebaseUser) return;
    
    setSaving(true);
    try {
      const profileData = {
        userId: firebaseUser.uid,
        ...profile,
        verified: profile?.verified || false
      };

      const existingProfile = await getProfile(firebaseUser.uid);
      if (existingProfile) {
        await updateProfile(firebaseUser.uid, profileData);
      } else {
        await createProfile(profileData);
      }
      
      setIsEditing(false);
      await fetchProfile(); // Refresh profile data
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Summary Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Profile Photo Section */}
                  <div className="relative mb-6">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage 
                        src={imagePreview || profile?.profileImageUrl || user?.profileImageUrl} 
                        alt="Profile"
                      />
                      <AvatarFallback className="text-3xl">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Photo Upload Controls */}
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                        disabled={uploadingPhoto}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                      
                      {selectedImage && (
                        <div className="space-y-2">
                          <Button
                            onClick={handleImageUpload}
                            size="sm"
                            className="w-full"
                            disabled={uploadingPhoto}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingPhoto ? 'Saving...' : 'Save Photo'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="w-full"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                      
                      {profile?.profileImageUrl && !selectedImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="w-full text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {registration?.name || user?.fullName || user?.email}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Member since:</span>
                      <span>{registration?.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'Invalid Date'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profile status:</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={profile?.age || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, age: parseInt(e.target.value) || 0 } : null)}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{registration?.dateOfBirth ? calculateAge(registration.dateOfBirth) : profile?.age || 'Not specified'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select value={profile?.gender || ''} onValueChange={(value) => setProfile(prev => prev ? { ...prev, gender: value } : null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 py-2 capitalize">{registration?.gender || profile?.gender || 'Not specified'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profile?.location || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                        placeholder="City, State"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{registration?.presentAddress || profile?.location || 'Not specified'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    {isEditing ? (
                      <Select value={profile?.profession || ''} onValueChange={(value) => setProfile(prev => prev ? { ...prev, profession: value } : null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select profession" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Teacher">Teacher</SelectItem>
                          <SelectItem value="Business Owner">Business Owner</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 py-2">{registration?.job || profile?.profession || 'Not specified'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="education">Education</Label>
                    {isEditing ? (
                      <Select value={profile?.education || ''} onValueChange={(value) => setProfile(prev => prev ? { ...prev, education: value } : null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                          <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 py-2">{registration?.qualification || profile?.education || 'Not specified'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="relationshipStatus">Relationship Status</Label>
                    {isEditing ? (
                      <Select value={profile?.relationshipStatus || ''} onValueChange={(value) => setProfile(prev => prev ? { ...prev, relationshipStatus: value } : null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never_married">Single</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 py-2">{registration?.maritalStatus || profile?.relationshipStatus || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                {/* Additional Details from Registration */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Date of Birth</Label>
                        <p className="text-gray-900 py-2">{registration.dateOfBirth || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Mother Tongue</Label>
                        <p className="text-gray-900 py-2">{registration.motherTongue || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Religion</Label>
                        <p className="text-gray-900 py-2">{registration.religion || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Caste</Label>
                        <p className="text-gray-900 py-2">{registration.caste || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Sub Caste</Label>
                        <p className="text-gray-900 py-2">{registration.subCaste || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Height</Label>
                        <p className="text-gray-900 py-2">{registration.height || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Weight</Label>
                        <p className="text-gray-900 py-2">{registration.weight ? `${registration.weight} kg` : 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Blood Group</Label>
                        <p className="text-gray-900 py-2">{registration.bloodGroup || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Complexion</Label>
                        <p className="text-gray-900 py-2">{registration.complexion || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Diet</Label>
                        <p className="text-gray-900 py-2">{registration.diet || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Income</Label>
                        <p className="text-gray-900 py-2">{registration.incomePerMonth ? `₹${registration.incomePerMonth}` : 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Place of Work</Label>
                        <p className="text-gray-900 py-2">{registration.placeOfJob || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Family Details from Registration */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Family Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Father's Name</Label>
                        <p className="text-gray-900 py-2">{registration.fatherName || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Father's Occupation</Label>
                        <p className="text-gray-900 py-2">{registration.fatherJob || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Father Alive</Label>
                        <p className="text-gray-900 py-2">{registration.fatherAlive || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Mother's Name</Label>
                        <p className="text-gray-900 py-2">{registration.motherName || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Mother's Occupation</Label>
                        <p className="text-gray-900 py-2">{registration.motherJob || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Mother Alive</Label>
                        <p className="text-gray-900 py-2">{registration.motherAlive || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Order of Birth</Label>
                        <p className="text-gray-900 py-2">{registration.orderOfBirth || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Astrology Details from Registration */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Astrology Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Star (Nakshatra)</Label>
                        <p className="text-gray-900 py-2">{registration.star || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Raasi</Label>
                        <p className="text-gray-900 py-2">{registration.raasi || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Gothram</Label>
                        <p className="text-gray-900 py-2">{registration.gothram || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Place of Birth</Label>
                        <p className="text-gray-900 py-2">{registration.placeOfBirth || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Time of Birth</Label>
                        <p className="text-gray-900 py-2">
                          {registration.timeOfBirth ? 
                            `${registration.timeOfBirth.hour}:${registration.timeOfBirth.minute} ${registration.timeOfBirth.period}` : 
                            'Not specified'}
                        </p>
                      </div>
                      <div>
                        <Label>Manglik</Label>
                        <p className="text-gray-900 py-2">{registration.laknam === 'Manglik' ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Partner Expectations from Registration */}
                {registration?.partnerExpectations && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Partner Expectations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Age Range</Label>
                        <p className="text-gray-900 py-2">
                          {registration.partnerExpectations.preferredAgeFrom} - {registration.partnerExpectations.preferredAgeTo} years
                        </p>
                      </div>
                      <div>
                        <Label>Preferred Job</Label>
                        <p className="text-gray-900 py-2">{registration.partnerExpectations.job || 'Any'}</p>
                      </div>
                      <div>
                        <Label>Preferred Diet</Label>
                        <p className="text-gray-900 py-2">{registration.partnerExpectations.diet || 'Any'}</p>
                      </div>
                      <div>
                        <Label>Preferred Marital Status</Label>
                        <p className="text-gray-900 py-2">
                          {registration.partnerExpectations.maritalStatus?.join(', ') || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    {registration.partnerExpectations.comments && (
                      <div className="mt-4">
                        <Label>Additional Comments</Label>
                        <p className="text-gray-900 py-2">{registration.partnerExpectations.comments}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Details */}
                {registration?.otherDetails && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
                    <p className="text-gray-900 py-2">{registration.otherDetails}</p>
                  </div>
                )}

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}