import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, Briefcase, Calendar, CheckCircle, Clock, User as UserIcon, Star, Home, GraduationCap, Heart as HeartIcon, Coffee, Wine, Leaf, Baby, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile, User } from "@/lib/firebaseAuth";
import { createLikeWithNotification, checkMutualLike, createMatchWithNotification } from "@/lib/firebaseAuth";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface ProfileCardProps {
  profile: Profile & { user: User };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(true);
  const { toast } = useToast();
  const { firebaseUser } = useAuth();
  const queryClient = useQueryClient();

  // Check if current user has already liked this profile
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!firebaseUser) {
        setLoadingLike(false);
        return;
      }
      
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        
        const likesQuery = query(
          collection(db, 'likes'),
          where('likerId', '==', firebaseUser.uid),
          where('likedId', '==', profile.userId)
        );
        
        const snapshot = await getDocs(likesQuery);
        setLiked(!snapshot.empty);
      } catch (error) {
        console.error('Error checking if profile is liked:', error);
      } finally {
        setLoadingLike(false);
      }
    };

    checkIfLiked();
  }, [firebaseUser, profile.userId]);

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

  const handleLike = () => {
    if (!liked && !loadingLike && firebaseUser) {
      likeMutation.mutate(profile.userId);
    }
  };

  // Debug profile image
  console.log(`ProfileCard for ${profile.user.firstName}: profileImageUrl =`, profile.user.profileImageUrl ? 'Has image' : 'No image');

  return (
    <Card className="overflow-hidden card-hover" data-testid={`card-profile-${profile.id}`}>
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
                {(profile as any).educationSpecification && (
                  <span className="text-sm text-gray-500 ml-1">
                    - {profile.educationSpecification === 'Other' && (profile as any).educationSpecificationOther 
                      ? (profile as any).educationSpecificationOther 
                      : (profile as any).educationSpecification}
                  </span>
                )}
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
          {(profile as any).religion && (
            <div className="flex items-center text-gray-600">
              <Star className="mr-2 h-4 w-4" />
              <span data-testid={`text-religion-${profile.id}`}>
                {(profile as any).religion}
                {(profile as any).caste && ` • ${(profile as any).caste}`}
                {(profile as any).subCaste && ` • ${(profile as any).subCaste}`}
              </span>
            </div>
          )}
          {(profile as any).motherTongue && (
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              <span data-testid={`text-mother-tongue-${profile.id}`}>
                {(profile as any).motherTongue}
              </span>
            </div>
          )}
          {(profile as any).height && (
            <div className="flex items-center text-gray-600">
              <UserIcon className="mr-2 h-4 w-4" />
              <span data-testid={`text-height-${profile.id}`}>
                {(profile as any).height}
                {(profile as any).weight && ` • ${(profile as any).weight} kg`}
              </span>
            </div>
          )}
          {(profile as any).bloodGroup && (
            <div className="flex items-center text-gray-600">
              <HeartIcon className="mr-2 h-4 w-4" />
              <span data-testid={`text-blood-group-${profile.id}`}>
                {(profile as any).bloodGroup}
              </span>
            </div>
          )}
          {(profile as any).diet && (
            <div className="flex items-center text-gray-600">
              <Leaf className="mr-2 h-4 w-4" />
              <span data-testid={`text-diet-${profile.id}`}>
                {(profile as any).diet}
              </span>
            </div>
          )}
          {((profile as any).smoking || (profile as any).drinking || (profile as any).lifestyle) && (
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              <span data-testid={`text-lifestyle-${profile.id}`}>
                {[(profile as any).lifestyle, (profile as any).smoking, (profile as any).drinking]
                  .filter(Boolean)
                  .join(' • ')}
              </span>
            </div>
          )}
        </div>
        
        {profile.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`text-bio-${profile.id}`}>
            {profile.bio}
          </p>
        )}
        
        <div className="flex space-x-3">
          <Button
            onClick={handleLike}
            disabled={liked || likeMutation.isPending || loadingLike}
            className={`flex-1 transition-colors ${
              liked 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-royal-blue hover:bg-blue-700'
            } text-white`}
            data-testid={`button-like-${profile.id}`}
          >
            <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {loadingLike ? 'Loading...' : liked ? 'Liked' : likeMutation.isPending ? 'Liking...' : 'Like'}
          </Button>
          <Link href={`/view-profile/${profile.userId}`}>
            <Button
              variant="outline"
              className="flex-1 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white transition-colors"
              data-testid={`button-view-profile-${profile.id}`}
            >
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
