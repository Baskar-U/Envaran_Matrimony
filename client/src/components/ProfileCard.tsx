import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, Briefcase, Calendar, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile, User } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile & { user: User };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (likedId: string) => {
      return await apiRequest("POST", "/api/likes", { likedId });
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
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
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
    if (!liked) {
      likeMutation.mutate(profile.userId);
    }
  };

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
          {profile.user.firstName} {profile.user.lastName?.charAt(0)}.
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span data-testid={`text-age-${profile.id}`}>{profile.age} years</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4" />
            <span data-testid={`text-location-${profile.id}`}>{profile.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase className="mr-2 h-4 w-4" />
            <span data-testid={`text-profession-${profile.id}`}>{profile.profession}</span>
          </div>
        </div>
        
        {profile.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`text-bio-${profile.id}`}>
            {profile.bio}
          </p>
        )}
        
        <div className="flex space-x-3">
          <Button
            onClick={handleLike}
            disabled={liked || likeMutation.isPending}
            className={`flex-1 transition-colors ${
              liked 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-royal-blue hover:bg-blue-700'
            } text-white`}
            data-testid={`button-like-${profile.id}`}
          >
            <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Liked' : likeMutation.isPending ? 'Liking...' : 'Like'}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white transition-colors"
            data-testid={`button-view-profile-${profile.id}`}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
