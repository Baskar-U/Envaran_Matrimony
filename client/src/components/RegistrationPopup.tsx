import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  userRegistrationSchema,
  RELIGIONS,
  CASTES, 
  SUB_CASTES,
  type UserRegistration 
} from "@shared/schema";

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationPopup({ isOpen, onClose }: RegistrationPopupProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserRegistration>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      mobileNo: "+91"
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: UserRegistration) => {
      return await apiRequest("POST", "/api/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
      reset();
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserRegistration) => {
    createUserMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="registration-popup">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-charcoal" data-testid="text-popup-title">
                Register Free
              </h2>
              <p className="text-gray-600 text-sm mt-1">You are Just a Moment Away from finding your Perfect Match</p>
            </div>
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
            {/* Name Field */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-charcoal mb-2 block">
                Name
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Enter Your Name"
                className="focus:ring-2 focus:ring-royal-blue"
                data-testid="input-fullname"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-fullname-error">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Gender
              </Label>
              <RadioGroup 
                onValueChange={(value) => setValue("gender", value as "male" | "female")}
                className="flex space-x-6"
                data-testid="radio-gender"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-gender-error">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-charcoal mb-2 block">
                Date of Birth
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="DD"
                  maxLength={2}
                  className="focus:ring-2 focus:ring-royal-blue"
                  onChange={(e) => {
                    const day = e.target.value;
                    const month = (document.getElementById('month') as HTMLInputElement)?.value || '';
                    const year = (document.getElementById('year') as HTMLInputElement)?.value || '';
                    if (day && month && year) {
                      setValue("dateOfBirth", `${day}/${month}/${year}`);
                    }
                  }}
                  data-testid="input-day"
                />
                <Input
                  id="month"
                  placeholder="MM"
                  maxLength={2}
                  className="focus:ring-2 focus:ring-royal-blue"
                  onChange={(e) => {
                    const month = e.target.value;
                    const day = (document.querySelector('[data-testid="input-day"]') as HTMLInputElement)?.value || '';
                    const year = (document.getElementById('year') as HTMLInputElement)?.value || '';
                    if (day && month && year) {
                      setValue("dateOfBirth", `${day}/${month}/${year}`);
                    }
                  }}
                  data-testid="input-month"
                />
                <Input
                  id="year"
                  placeholder="YYYY"
                  maxLength={4}
                  className="focus:ring-2 focus:ring-royal-blue"
                  onChange={(e) => {
                    const year = e.target.value;
                    const day = (document.querySelector('[data-testid="input-day"]') as HTMLInputElement)?.value || '';
                    const month = (document.getElementById('month') as HTMLInputElement)?.value || '';
                    if (day && month && year) {
                      setValue("dateOfBirth", `${day}/${month}/${year}`);
                    }
                  }}
                  data-testid="input-year"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-dob-error">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Religion */}
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Religion
              </Label>
              <Select onValueChange={(value) => setValue("religion", value as any)}>
                <SelectTrigger className="focus:ring-2 focus:ring-royal-blue" data-testid="select-religion">
                  <SelectValue placeholder="--Select Religion--" />
                </SelectTrigger>
                <SelectContent>
                  {RELIGIONS.map((religion) => (
                    <SelectItem key={religion} value={religion}>{religion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.religion && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-religion-error">
                  {errors.religion.message}
                </p>
              )}
            </div>

            {/* Caste */}
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Caste
              </Label>
              <Select onValueChange={(value) => setValue("caste", value as any)}>
                <SelectTrigger className="focus:ring-2 focus:ring-royal-blue" data-testid="select-caste">
                  <SelectValue placeholder="--Select Caste--" />
                </SelectTrigger>
                <SelectContent>
                  {CASTES.map((caste) => (
                    <SelectItem key={caste} value={caste}>{caste}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.caste && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-caste-error">
                  {errors.caste.message}
                </p>
              )}
            </div>

            {/* Sub Caste */}
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Sub Caste
              </Label>
              <Select onValueChange={(value) => setValue("subCaste", value as any)}>
                <SelectTrigger className="focus:ring-2 focus:ring-royal-blue" data-testid="select-subcaste">
                  <SelectValue placeholder="--Select Sub Caste--" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_CASTES.map((subCaste) => (
                    <SelectItem key={subCaste} value={subCaste}>{subCaste}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subCaste && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-subcaste-error">
                  {errors.subCaste.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobileNo" className="text-sm font-medium text-charcoal mb-2 block">
                Mobile No
              </Label>
              <div className="flex">
                <Select defaultValue="+91" disabled>
                  <SelectTrigger className="w-24 focus:ring-2 focus:ring-royal-blue">
                    <SelectValue />
                  </SelectTrigger>
                </Select>
                <Input
                  {...register("mobileNo")}
                  placeholder="Enter Valid Number"
                  className="flex-1 ml-2 focus:ring-2 focus:ring-royal-blue"
                  data-testid="input-mobile"
                />
              </div>
              {errors.mobileNo && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-mobile-error">
                  {errors.mobileNo.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-charcoal mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="Enter Your Email"
                className="focus:ring-2 focus:ring-royal-blue"
                data-testid="input-email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-email-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-charcoal mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter Your Password"
                  className="focus:ring-2 focus:ring-royal-blue pr-10"
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1" data-testid="text-password-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={createUserMutation.isPending}
              className="w-full bg-royal-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
              data-testid="button-register"
            >
              {createUserMutation.isPending ? "Creating Account..." : "Register Free"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}