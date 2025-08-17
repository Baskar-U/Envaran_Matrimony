import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const profileSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(["male", "female"]),
  location: z.string().min(1),
  profession: z.string().min(1),
  bio: z.string().optional(),
  education: z.string().optional(),
  kidsPreference: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationPopup({ isOpen, onClose }: RegistrationPopupProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await apiRequest("POST", "/api/profiles", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Created!",
        description: "Your profile has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    createProfileMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="registration-popup">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-poppins font-bold text-charcoal" data-testid="text-popup-title">
              Complete Your Profile
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="button-close-popup"
            >
              <X size={24} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-sm font-medium text-charcoal mb-2 block">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  placeholder="Age"
                  className="focus:ring-2 focus:ring-royal-blue"
                  data-testid="input-age"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1" data-testid="text-age-error">
                    {errors.age.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-charcoal mb-2 block">
                  Gender
                </Label>
                <Select onValueChange={(value) => setValue("gender", value as "male" | "female")}>
                  <SelectTrigger className="focus:ring-2 focus:ring-royal-blue" data-testid="select-gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1" data-testid="text-gender-error">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium text-charcoal mb-2 block">
                Location
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Your city"
                className="focus:ring-2 focus:ring-royal-blue"
                data-testid="input-location"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-location-error">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="profession" className="text-sm font-medium text-charcoal mb-2 block">
                Profession
              </Label>
              <Input
                id="profession"
                {...register("profession")}
                placeholder="Your profession"
                className="focus:ring-2 focus:ring-royal-blue"
                data-testid="input-profession"
              />
              {errors.profession && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-profession-error">
                  {errors.profession.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="education" className="text-sm font-medium text-charcoal mb-2 block">
                Education (Optional)
              </Label>
              <Input
                id="education"
                {...register("education")}
                placeholder="Your education"
                className="focus:ring-2 focus:ring-royal-blue"
                data-testid="input-education"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Kids Preference (Optional)
              </Label>
              <Select onValueChange={(value) => setValue("kidsPreference", value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-royal-blue" data-testid="select-kids-preference">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Want kids</SelectItem>
                  <SelectItem value="no">Don't want kids</SelectItem>
                  <SelectItem value="have">Have kids</SelectItem>
                  <SelectItem value="open">Open to discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={createProfileMutation.isPending}
              className="w-full bg-royal-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
              data-testid="button-create-profile"
            >
              {createProfileMutation.isPending ? (
                "Creating Profile..."
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Create My Profile
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
