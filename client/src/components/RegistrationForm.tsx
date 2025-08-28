import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';

interface RegistrationFormData {
  // Personal Details
  name: string;
  gender: string;
  dateOfBirth: string;
  age: number | null;
  motherTongue: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  
  // Account Type
  plan: 'free' | 'premium';
  
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
  timeOfBirthHour: string;
  timeOfBirthMinute: string;
  timeOfBirthPeriod: string;
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
  dasaPeriodYears: string;
  dasaPeriodMonths: string;
  dasaPeriodDays: string;
  
  // Partner Expectations
  partnerJob: string;
  preferredAgeFrom: string;
  preferredAgeTo: string;
  jobPreference: string;
  partnerDiet: string;
  partnerMaritalStatus: string[];
  partnerSubCaste: string;
  partnerComments: string;
  
  // Additional Details
  otherDetails: string;
  
  // Account Details
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const [formData, setFormData] = useState<RegistrationFormData>({
    // Personal Details
    name: '',
    gender: '',
    dateOfBirth: '',
    age: null,
    motherTongue: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    subCaste: '',
    
    // Account Type
            plan: 'free',
    
    // Family Details
    fatherName: '',
    fatherJob: '',
    fatherAlive: '',
    motherName: '',
    motherJob: '',
    motherAlive: '',
    orderOfBirth: '',
    
    // Physical Attributes
    height: '',
    weight: '',
    bloodGroup: '',
    complexion: '',
    disability: '',
    diet: '',
    
    // Education & Occupation
    qualification: '',
    incomePerMonth: '',
    job: '',
    placeOfJob: '',
    
    // Communication Details
    presentAddress: '',
    permanentAddress: '',
    contactNumber: '',
    contactPerson: '',
    
    // Astrology Details
    ownHouse: '',
    star: '',
    laknam: '',
    timeOfBirthHour: '',
    timeOfBirthMinute: '',
    timeOfBirthPeriod: '',
    raasi: '',
    gothram: '',
    placeOfBirth: '',
    padam: '',
    dossam: '',
    nativity: '',
    
    // Horoscope Details
    horoscopeRequired: '',
    balance: '',
    dasa: '',
    dasaPeriodYears: '',
    dasaPeriodMonths: '',
    dasaPeriodDays: '',
    
    // Partner Expectations
    partnerJob: '',
    preferredAgeFrom: '',
    preferredAgeTo: '',
    jobPreference: '',
    partnerDiet: '',
    partnerMaritalStatus: [],
    partnerSubCaste: '',
    partnerComments: '',
    
    // Additional Details
    otherDetails: '',
    
    // Account Details
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: keyof RegistrationFormData, value: string | string[] | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChangeEvent = (field: keyof RegistrationFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(field, e.target.value);
  };

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    
    // Parse DD-MM-YYYY format
    const parts = dateOfBirth.split('-');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  };

  // Function to handle date of birth change with age calculation
  const handleDateOfBirthChange = (value: string) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as DD-MM-YYYY
    let formattedValue = '';
    if (digitsOnly.length >= 1) formattedValue += digitsOnly.substring(0, 2);
    if (digitsOnly.length >= 3) formattedValue += '-' + digitsOnly.substring(2, 4);
    if (digitsOnly.length >= 5) formattedValue += '-' + digitsOnly.substring(4, 8);
    
    handleInputChange('dateOfBirth', formattedValue);
    const calculatedAge = calculateAge(formattedValue);
    handleInputChange('age', calculatedAge);
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      // First, create the Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const newUser = userCredential.user;

      // Prepare data for Firebase
      const registrationData = {
        userId: newUser.uid,
        status: 'completed',
        submittedAt: new Date(),
        
        // Personal Details
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        motherTongue: formData.motherTongue,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        caste: formData.caste,
        subCaste: formData.subCaste,
        
        // Account Type
        plan: formData.plan,
        
        // Family Details
        fatherName: formData.fatherName,
        fatherJob: formData.fatherJob,
        fatherAlive: formData.fatherAlive,
        motherName: formData.motherName,
        motherJob: formData.motherJob,
        motherAlive: formData.motherAlive,
        orderOfBirth: formData.orderOfBirth,
        
        // Physical Attributes
        height: formData.height,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        complexion: formData.complexion,
        disability: formData.disability,
        diet: formData.diet,
        
        // Education & Occupation
        qualification: formData.qualification,
        incomePerMonth: formData.incomePerMonth,
        job: formData.job,
        placeOfJob: formData.placeOfJob,
        
        // Communication Details
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        contactNumber: formData.contactNumber,
        contactPerson: formData.contactPerson,
        
        // Astrology Details
        ownHouse: formData.ownHouse,
        star: formData.star,
        laknam: formData.laknam,
        timeOfBirth: {
          hour: formData.timeOfBirthHour,
          minute: formData.timeOfBirthMinute,
          period: formData.timeOfBirthPeriod
        },
        raasi: formData.raasi,
        gothram: formData.gothram,
        placeOfBirth: formData.placeOfBirth,
        padam: formData.padam,
        dossam: formData.dossam,
        nativity: formData.nativity,
        
        // Horoscope Details
        horoscopeRequired: formData.horoscopeRequired,
        balance: formData.balance,
        dasa: formData.dasa,
        dasaPeriod: {
          years: formData.dasaPeriodYears,
          months: formData.dasaPeriodMonths,
          days: formData.dasaPeriodDays
        },
        
        // Partner Expectations
        partnerExpectations: {
          job: formData.partnerJob,
          preferredAgeFrom: parseInt(formData.preferredAgeFrom) || 0,
          preferredAgeTo: parseInt(formData.preferredAgeTo) || 0,
          jobPreference: formData.jobPreference,
          diet: formData.partnerDiet,
          maritalStatus: formData.partnerMaritalStatus,
          subCaste: formData.partnerSubCaste,
          comments: formData.partnerComments
        },
        
        // Additional Details
        otherDetails: formData.otherDetails,
        
        // Metadata
        approvedAt: null,
        approvedBy: null,
        rejectionReason: null
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'registrations'), registrationData);

      // Show success message
      toast({
        title: "🎉 Congratulations!",
        description: "Your account has been created successfully! Your profile is now visible to everyone.",
      });

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/home';
      }, 2000);

    } catch (error: any) {
      console.error('Error creating account:', error);
      
      let errorMessage = "There was an error creating your account. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered. Please use a different email or try logging in.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Account Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Details
        if (!formData.name || !formData.gender || !formData.dateOfBirth || 
            !formData.motherTongue || !formData.maritalStatus || !formData.religion) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        
        // Validate date format (DD-MM-YYYY)
        if (formData.dateOfBirth) {
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          if (!dateRegex.test(formData.dateOfBirth)) {
            toast({
              title: "Invalid Date Format",
              description: "Please enter date in DD-MM-YYYY format (e.g., 15-08-1990).",
              variant: "destructive",
            });
            return false;
          }
          
          // Validate if age is calculated
          if (formData.age === null) {
            toast({
              title: "Invalid Date",
              description: "Please enter a valid date of birth.",
              variant: "destructive",
            });
            return false;
          }
          
          // Validate minimum age (18 years)
          if (formData.age < 18) {
            toast({
              title: "Age Requirement",
              description: "You must be at least 18 years old to register.",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
        
      case 2: // Family Details
        if (!formData.fatherName || !formData.fatherAlive || 
            !formData.motherName || !formData.motherAlive) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 3: // Physical Attributes & Education
        // No required fields for this step, so always return true
        return true;
        
      case 4: // Contact Information
        if (!formData.presentAddress || !formData.contactNumber) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 5: // Astrology Details
        // No required fields for this step, so always return true
        return true;
        
      case 6: // Partner Expectations
        // No required fields for this step, so always return true
        return true;
        
      case 7: // Account Creation
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords Don't Match",
            description: "Password and confirm password must be the same.",
            variant: "destructive",
          });
          return false;
        }
        if (formData.password.length < 6) {
          toast({
            title: "Password Too Short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChangeEvent('name')}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth * (DD-MM-YYYY)</Label>
          <Input
            id="dateOfBirth"
            type="text"
            placeholder="DD-MM-YYYY (e.g., 15-08-1990)"
            value={formData.dateOfBirth}
            onChange={(e) => handleDateOfBirthChange(e.target.value)}
            maxLength={10}
            required
          />
          {formData.age !== null && (
            <p className="text-sm text-green-600 mt-1">
              ✅ Age: {formData.age} years old
            </p>
          )}
          {formData.dateOfBirth && formData.age === null && (
            <p className="text-sm text-red-600 mt-1">
              ❌ Please enter a valid date
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="motherTongue">Mother Tongue *</Label>
          <Select value={formData.motherTongue} onValueChange={(value) => handleInputChange('motherTongue', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mother tongue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tamil">Tamil</SelectItem>
              <SelectItem value="Telugu">Telugu</SelectItem>
              <SelectItem value="Kannada">Kannada</SelectItem>
              <SelectItem value="Malayalam">Malayalam</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="Marathi">Marathi</SelectItem>
              <SelectItem value="Gujarati">Gujarati</SelectItem>
              <SelectItem value="Punjabi">Punjabi</SelectItem>
              <SelectItem value="Odia">Odia</SelectItem>
              <SelectItem value="Assamese">Assamese</SelectItem>
              <SelectItem value="Sanskrit">Sanskrit</SelectItem>
              <SelectItem value="Urdu">Urdu</SelectItem>
              <SelectItem value="Sindhi">Sindhi</SelectItem>
              <SelectItem value="Kashmiri">Kashmiri</SelectItem>
              <SelectItem value="Konkani">Konkani</SelectItem>
              <SelectItem value="Manipuri">Manipuri</SelectItem>
              <SelectItem value="Nepali">Nepali</SelectItem>
              <SelectItem value="Bodo">Bodo</SelectItem>
              <SelectItem value="Santhali">Santhali</SelectItem>
              <SelectItem value="Maithili">Maithili</SelectItem>
              <SelectItem value="Dogri">Dogri</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maritalStatus">Marital Status *</Label>
          <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unmarried">Unmarried</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="religion">Religion *</Label>
          <Select value={formData.religion} onValueChange={(value) => {
            handleInputChange('religion', value);
            // Clear caste when religion changes
            handleInputChange('caste', '');
            handleInputChange('subCaste', '');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hindu">Hindu</SelectItem>
              <SelectItem value="Muslim">Muslim</SelectItem>
              <SelectItem value="Christian">Christian</SelectItem>
              <SelectItem value="Sikh">Sikh</SelectItem>
              <SelectItem value="Buddhist">Buddhist</SelectItem>
              <SelectItem value="Jain">Jain</SelectItem>
              <SelectItem value="Parsi">Parsi</SelectItem>
              <SelectItem value="Jewish">Jewish</SelectItem>
              <SelectItem value="Atheist">Atheist</SelectItem>
              <SelectItem value="Agnostic">Agnostic</SelectItem>
              <SelectItem value="Spiritual">Spiritual</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="caste">Caste</Label>
          <Select value={formData.caste} onValueChange={(value) => {
            handleInputChange('caste', value);
            // Clear sub caste when caste changes
            handleInputChange('subCaste', '');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select caste" />
            </SelectTrigger>
            <SelectContent>
              {formData.religion === 'Hindu' && (
                <>
                  <SelectItem value="brahmin">Brahmin</SelectItem>
                  <SelectItem value="naidu">Naidu</SelectItem>
                  <SelectItem value="reddy">Reddy</SelectItem>
                  <SelectItem value="chettiar">Chettiar</SelectItem>
                  <SelectItem value="gounder">Gounder</SelectItem>
                  <SelectItem value="vanniyar">Vanniyar</SelectItem>
                  <SelectItem value="yadava">Yadava</SelectItem>
                  <SelectItem value="mudaliar">Mudaliar</SelectItem>
                  <SelectItem value="vellalar">Vellalar</SelectItem>
                  <SelectItem value="scheduled_castes">Scheduled Castes</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Muslim' && (
                <>
                  <SelectItem value="sunni">Sunni</SelectItem>
                  <SelectItem value="shia">Shia</SelectItem>
                  <SelectItem value="ahmadiyya">Ahmadiyya</SelectItem>
                  <SelectItem value="pathan">Pathan</SelectItem>
                  <SelectItem value="syed">Syed</SelectItem>
                  <SelectItem value="ansari">Ansari</SelectItem>
                  <SelectItem value="memon">Memon</SelectItem>
                  <SelectItem value="sheikh">Sheikh</SelectItem>
                  <SelectItem value="mughal">Mughal</SelectItem>
                  <SelectItem value="qureshi">Qureshi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Christian' && (
                <>
                  <SelectItem value="catholic">Catholic</SelectItem>
                  <SelectItem value="protestant">Protestant</SelectItem>
                  <SelectItem value="orthodox">Orthodox</SelectItem>
                  <SelectItem value="syrian">Syrian</SelectItem>
                  <SelectItem value="latin">Latin</SelectItem>
                  <SelectItem value="malankara">Malankara</SelectItem>
                  <SelectItem value="malabar">Malabar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Sikh' && (
                <>
                  <SelectItem value="jat">Jat</SelectItem>
                  <SelectItem value="ramgharia">Ramgharia</SelectItem>
                  <SelectItem value="khatri">Khatri</SelectItem>
                  <SelectItem value="arora">Arora</SelectItem>
                  <SelectItem value="bhatia">Bhatia</SelectItem>
                  <SelectItem value="saini">Saini</SelectItem>
                  <SelectItem value="lubana">Lubana</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Jain' && (
                <>
                  <SelectItem value="digambar">Digambar</SelectItem>
                  <SelectItem value="swetambar">Swetambar</SelectItem>
                  <SelectItem value="terapanth">Terapanth</SelectItem>
                  <SelectItem value="bispanth">Bispanth</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Buddhist' && (
                <>
                  <SelectItem value="theravada">Theravada</SelectItem>
                  <SelectItem value="mahayana">Mahayana</SelectItem>
                  <SelectItem value="vajrayana">Vajrayana</SelectItem>
                  <SelectItem value="zen">Zen</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Parsi' && (
                <>
                  <SelectItem value="irani">Irani</SelectItem>
                  <SelectItem value="parsi">Parsi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {formData.religion === 'Jewish' && (
                <>
                  <SelectItem value="ashkenazi">Ashkenazi</SelectItem>
                  <SelectItem value="sephardi">Sephardi</SelectItem>
                  <SelectItem value="mizrahi">Mizrahi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
              {(!formData.religion || formData.religion === 'Atheist' || formData.religion === 'Agnostic' || formData.religion === 'Spiritual' || formData.religion === 'Other') && (
                <SelectItem value="other">Other</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subCaste">Sub Caste</Label>
          <Select value={formData.subCaste} onValueChange={(value) => handleInputChange('subCaste', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub caste" />
            </SelectTrigger>
            <SelectContent>
              {/* Hindu Brahmin Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'brahmin' && (
                <>
                  <SelectItem value="Iyer">Iyer</SelectItem>
                  <SelectItem value="Iyengar">Iyengar</SelectItem>
                  <SelectItem value="Smartha">Smartha</SelectItem>
                  <SelectItem value="Madhwa">Madhwa</SelectItem>
                  <SelectItem value="Niyogi">Niyogi</SelectItem>
                  <SelectItem value="Gaur">Gaur</SelectItem>
                  <SelectItem value="Deshastha">Deshastha</SelectItem>
                  <SelectItem value="Hoysala">Hoysala</SelectItem>
                  <SelectItem value="Kota">Kota</SelectItem>
                  <SelectItem value="Havyaka">Havyaka</SelectItem>
                  <SelectItem value="Kanyakubja">Kanyakubja</SelectItem>
                  <SelectItem value="Chitpavan">Chitpavan</SelectItem>
                  <SelectItem value="Konkani">Konkani</SelectItem>
                  <SelectItem value="Rarhi">Rarhi</SelectItem>
                  <SelectItem value="Saraswat">Saraswat</SelectItem>
                  <SelectItem value="Mithila">Mithila</SelectItem>
                  <SelectItem value="Pushkarna">Pushkarna</SelectItem>
                  <SelectItem value="Tamil Brahmin">Tamil Brahmin</SelectItem>
                  <SelectItem value="Kashmiri Pandit">Kashmiri Pandit</SelectItem>
                  <SelectItem value="Gujarati Brahmin">Gujarati Brahmin</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Naidu Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'naidu' && (
                <>
                  <SelectItem value="Balija">Balija</SelectItem>
                  <SelectItem value="Kamma">Kamma</SelectItem>
                  <SelectItem value="Gavara">Gavara</SelectItem>
                  <SelectItem value="Turupu">Turupu</SelectItem>
                  <SelectItem value="Kapu">Kapu</SelectItem>
                  <SelectItem value="Munnuru">Munnuru</SelectItem>
                  <SelectItem value="Ediga">Ediga</SelectItem>
                  <SelectItem value="Ontari">Ontari</SelectItem>
                  <SelectItem value="Telaga">Telaga</SelectItem>
                  <SelectItem value="Vada Balija">Vada Balija</SelectItem>
                  <SelectItem value="Golla Naidu">Golla Naidu</SelectItem>
                  <SelectItem value="Yadava Naidu">Yadava Naidu</SelectItem>
                  <SelectItem value="Uppara Naidu">Uppara Naidu</SelectItem>
                  <SelectItem value="Perika Naidu">Perika Naidu</SelectItem>
                  <SelectItem value="Mudiraj Naidu">Mudiraj Naidu</SelectItem>
                  <SelectItem value="Boya Naidu">Boya Naidu</SelectItem>
                  <SelectItem value="Kuruba Naidu">Kuruba Naidu</SelectItem>
                  <SelectItem value="Chowdhary Naidu">Chowdhary Naidu</SelectItem>
                  <SelectItem value="Rajulu Naidu">Rajulu Naidu</SelectItem>
                  <SelectItem value="Padmashali Naidu">Padmashali Naidu</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Reddy Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'reddy' && (
                <>
                  <SelectItem value="Panta Reddy">Panta Reddy</SelectItem>
                  <SelectItem value="Kapu Reddy">Kapu Reddy</SelectItem>
                  <SelectItem value="Pedda Reddy">Pedda Reddy</SelectItem>
                  <SelectItem value="Deshmukh Reddy">Deshmukh Reddy</SelectItem>
                  <SelectItem value="Motati Reddy">Motati Reddy</SelectItem>
                  <SelectItem value="Gandla Reddy">Gandla Reddy</SelectItem>
                  <SelectItem value="Lingala Reddy">Lingala Reddy</SelectItem>
                  <SelectItem value="Boya Reddy">Boya Reddy</SelectItem>
                  <SelectItem value="Kapu Kapu Reddy">Kapu Kapu Reddy</SelectItem>
                  <SelectItem value="Kshatriya Reddy">Kshatriya Reddy</SelectItem>
                  <SelectItem value="Mudiraj Reddy">Mudiraj Reddy</SelectItem>
                  <SelectItem value="Rajula Reddy">Rajula Reddy</SelectItem>
                  <SelectItem value="Palli Reddy">Palli Reddy</SelectItem>
                  <SelectItem value="Perika Reddy">Perika Reddy</SelectItem>
                  <SelectItem value="Vadla Reddy">Vadla Reddy</SelectItem>
                  <SelectItem value="Kummari Reddy">Kummari Reddy</SelectItem>
                  <SelectItem value="Kuruba Reddy">Kuruba Reddy</SelectItem>
                  <SelectItem value="Yadava Reddy">Yadava Reddy</SelectItem>
                  <SelectItem value="Chowdhary Reddy">Chowdhary Reddy</SelectItem>
                  <SelectItem value="Poojary Reddy">Poojary Reddy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Chettiar Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'chettiar' && (
                <>
                  <SelectItem value="Nattukottai">Nattukottai</SelectItem>
                  <SelectItem value="Vellalar">Vellalar</SelectItem>
                  <SelectItem value="Pattinavar">Pattinavar</SelectItem>
                  <SelectItem value="Sengunthar">Sengunthar</SelectItem>
                  <SelectItem value="Pattinathu">Pattinathu</SelectItem>
                  <SelectItem value="Kavundar">Kavundar</SelectItem>
                  <SelectItem value="Elur">Elur</SelectItem>
                  <SelectItem value="Nagarathar">Nagarathar</SelectItem>
                  <SelectItem value="Devanga">Devanga</SelectItem>
                  <SelectItem value="Saliyar">Saliyar</SelectItem>
                  <SelectItem value="Sourashtra">Sourashtra</SelectItem>
                  <SelectItem value="Thuluva">Thuluva</SelectItem>
                  <SelectItem value="Isai Vellalar">Isai Vellalar</SelectItem>
                  <SelectItem value="Mudaliar Chettiar">Mudaliar Chettiar</SelectItem>
                  <SelectItem value="Velama Chettiar">Velama Chettiar</SelectItem>
                  <SelectItem value="Padmasali Chettiar">Padmasali Chettiar</SelectItem>
                  <SelectItem value="Muthuraja Chettiar">Muthuraja Chettiar</SelectItem>
                  <SelectItem value="Agamudaiyar Chettiar">Agamudaiyar Chettiar</SelectItem>
                  <SelectItem value="Ambalakarar Chettiar">Ambalakarar Chettiar</SelectItem>
                  <SelectItem value="Palli Chettiar">Palli Chettiar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Gounder Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'gounder' && (
                <>
                  <SelectItem value="Kongu Vellalar">Kongu Vellalar</SelectItem>
                  <SelectItem value="Vanniyar Gounder">Vanniyar Gounder</SelectItem>
                  <SelectItem value="Kurumba Gounder">Kurumba Gounder</SelectItem>
                  <SelectItem value="Vettuva Gounder">Vettuva Gounder</SelectItem>
                  <SelectItem value="Kammalar Gounder">Kammalar Gounder</SelectItem>
                  <SelectItem value="Kudiyarasu Gounder">Kudiyarasu Gounder</SelectItem>
                  <SelectItem value="Devanga Gounder">Devanga Gounder</SelectItem>
                  <SelectItem value="Padayachi Gounder">Padayachi Gounder</SelectItem>
                  <SelectItem value="Saiva Gounder">Saiva Gounder</SelectItem>
                  <SelectItem value="Pattinathu Gounder">Pattinathu Gounder</SelectItem>
                  <SelectItem value="Palli Gounder">Palli Gounder</SelectItem>
                  <SelectItem value="Velar Gounder">Velar Gounder</SelectItem>
                  <SelectItem value="Mudaliar Gounder">Mudaliar Gounder</SelectItem>
                  <SelectItem value="Yadava Gounder">Yadava Gounder</SelectItem>
                  <SelectItem value="Kshatriya Gounder">Kshatriya Gounder</SelectItem>
                  <SelectItem value="Thuluva Gounder">Thuluva Gounder</SelectItem>
                  <SelectItem value="Agamudaiyar Gounder">Agamudaiyar Gounder</SelectItem>
                  <SelectItem value="Sourashtra Gounder">Sourashtra Gounder</SelectItem>
                  <SelectItem value="Elur Gounder">Elur Gounder</SelectItem>
                  <SelectItem value="Rajapalayam Gounder">Rajapalayam Gounder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Vanniyar Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'vanniyar' && (
                <>
                  <SelectItem value="Padayachi">Padayachi</SelectItem>
                  <SelectItem value="Gounder Vanniyar">Gounder Vanniyar</SelectItem>
                  <SelectItem value="Vettuva Vanniyar">Vettuva Vanniyar</SelectItem>
                  <SelectItem value="Kudiyarasu Vanniyar">Kudiyarasu Vanniyar</SelectItem>
                  <SelectItem value="Velar Vanniyar">Velar Vanniyar</SelectItem>
                  <SelectItem value="Devanga Vanniyar">Devanga Vanniyar</SelectItem>
                  <SelectItem value="Sengunthar Vanniyar">Sengunthar Vanniyar</SelectItem>
                  <SelectItem value="Mudaliar Vanniyar">Mudaliar Vanniyar</SelectItem>
                  <SelectItem value="Saiva Vanniyar">Saiva Vanniyar</SelectItem>
                  <SelectItem value="Kamma Vanniyar">Kamma Vanniyar</SelectItem>
                  <SelectItem value="Thuluva Vanniyar">Thuluva Vanniyar</SelectItem>
                  <SelectItem value="Ambalakarar Vanniyar">Ambalakarar Vanniyar</SelectItem>
                  <SelectItem value="Palli Vanniyar">Palli Vanniyar</SelectItem>
                  <SelectItem value="Agamudaiyar Vanniyar">Agamudaiyar Vanniyar</SelectItem>
                  <SelectItem value="Kurumba Vanniyar">Kurumba Vanniyar</SelectItem>
                  <SelectItem value="Rajapalayam Vanniyar">Rajapalayam Vanniyar</SelectItem>
                  <SelectItem value="Isai Vanniyar">Isai Vanniyar</SelectItem>
                  <SelectItem value="Velama Vanniyar">Velama Vanniyar</SelectItem>
                  <SelectItem value="Uppara Vanniyar">Uppara Vanniyar</SelectItem>
                  <SelectItem value="Perika Vanniyar">Perika Vanniyar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Yadava Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'yadava' && (
                <>
                  <SelectItem value="Konar">Konar</SelectItem>
                  <SelectItem value="Golla">Golla</SelectItem>
                  <SelectItem value="Kuruba">Kuruba</SelectItem>
                  <SelectItem value="Idaiyar">Idaiyar</SelectItem>
                  <SelectItem value="Yerra Golla">Yerra Golla</SelectItem>
                  <SelectItem value="Doddi Golla">Doddi Golla</SelectItem>
                  <SelectItem value="Krishna Golla">Krishna Golla</SelectItem>
                  <SelectItem value="Manda Golla">Manda Golla</SelectItem>
                  <SelectItem value="Dodda Golla">Dodda Golla</SelectItem>
                  <SelectItem value="Muthuraja Yadava">Muthuraja Yadava</SelectItem>
                  <SelectItem value="Poojary Yadava">Poojary Yadava</SelectItem>
                  <SelectItem value="Velama Yadava">Velama Yadava</SelectItem>
                  <SelectItem value="Lingayat Yadava">Lingayat Yadava</SelectItem>
                  <SelectItem value="Perika Yadava">Perika Yadava</SelectItem>
                  <SelectItem value="Agamudaiyar Yadava">Agamudaiyar Yadava</SelectItem>
                  <SelectItem value="Saiva Yadava">Saiva Yadava</SelectItem>
                  <SelectItem value="Ambalakarar Yadava">Ambalakarar Yadava</SelectItem>
                  <SelectItem value="Isai Yadava">Isai Yadava</SelectItem>
                  <SelectItem value="Vanniyar Yadava">Vanniyar Yadava</SelectItem>
                  <SelectItem value="Thuluva Yadava">Thuluva Yadava</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Mudaliar Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'mudaliar' && (
                <>
                  <SelectItem value="Saiva">Saiva</SelectItem>
                  <SelectItem value="Thuluva">Thuluva</SelectItem>
                  <SelectItem value="Isai Vellalar">Isai Vellalar</SelectItem>
                  <SelectItem value="Sengunthar">Sengunthar</SelectItem>
                  <SelectItem value="Agamudaiyar Mudaliar">Agamudaiyar Mudaliar</SelectItem>
                  <SelectItem value="Velama Mudaliar">Velama Mudaliar</SelectItem>
                  <SelectItem value="Padmasali Mudaliar">Padmasali Mudaliar</SelectItem>
                  <SelectItem value="Muthuraja Mudaliar">Muthuraja Mudaliar</SelectItem>
                  <SelectItem value="Ambalakarar Mudaliar">Ambalakarar Mudaliar</SelectItem>
                  <SelectItem value="Devanga Mudaliar">Devanga Mudaliar</SelectItem>
                  <SelectItem value="Sourashtra Mudaliar">Sourashtra Mudaliar</SelectItem>
                  <SelectItem value="Kurumba Mudaliar">Kurumba Mudaliar</SelectItem>
                  <SelectItem value="Rajapalayam Mudaliar">Rajapalayam Mudaliar</SelectItem>
                  <SelectItem value="Kamma Mudaliar">Kamma Mudaliar</SelectItem>
                  <SelectItem value="Naidu Mudaliar">Naidu Mudaliar</SelectItem>
                  <SelectItem value="Kshatriya Mudaliar">Kshatriya Mudaliar</SelectItem>
                  <SelectItem value="Perika Mudaliar">Perika Mudaliar</SelectItem>
                  <SelectItem value="Velar Mudaliar">Velar Mudaliar</SelectItem>
                  <SelectItem value="Uppara Mudaliar">Uppara Mudaliar</SelectItem>
                  <SelectItem value="Yadava Mudaliar">Yadava Mudaliar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Vellalar Sub Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'vellalar' && (
                <>
                  <SelectItem value="Saiva Vellalar">Saiva Vellalar</SelectItem>
                  <SelectItem value="Mudaliar Vellalar">Mudaliar Vellalar</SelectItem>
                  <SelectItem value="Gounder Vellalar">Gounder Vellalar</SelectItem>
                  <SelectItem value="Padayachi Vellalar">Padayachi Vellalar</SelectItem>
                  <SelectItem value="Kamma Vellalar">Kamma Vellalar</SelectItem>
                  <SelectItem value="Devanga Vellalar">Devanga Vellalar</SelectItem>
                  <SelectItem value="Sengunthar Vellalar">Sengunthar Vellalar</SelectItem>
                  <SelectItem value="Thuluva Vellalar">Thuluva Vellalar</SelectItem>
                  <SelectItem value="Agamudaiyar Vellalar">Agamudaiyar Vellalar</SelectItem>
                  <SelectItem value="Ambalakarar Vellalar">Ambalakarar Vellalar</SelectItem>
                  <SelectItem value="Velar Vellalar">Velar Vellalar</SelectItem>
                  <SelectItem value="Kurumba Vellalar">Kurumba Vellalar</SelectItem>
                  <SelectItem value="Perika Vellalar">Perika Vellalar</SelectItem>
                  <SelectItem value="Isai Vellalar">Isai Vellalar</SelectItem>
                  <SelectItem value="Sourashtra Vellalar">Sourashtra Vellalar</SelectItem>
                  <SelectItem value="Rajapalayam Vellalar">Rajapalayam Vellalar</SelectItem>
                  <SelectItem value="Yadava Vellalar">Yadava Vellalar</SelectItem>
                  <SelectItem value="Uppara Vellalar">Uppara Vellalar</SelectItem>
                  <SelectItem value="Velama Vellalar">Velama Vellalar</SelectItem>
                  <SelectItem value="Naidu Vellalar">Naidu Vellalar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Hindu Scheduled Castes */}
              {formData.religion === 'Hindu' && formData.caste === 'scheduled_castes' && (
                <>
                  <SelectItem value="Paraiyar">Paraiyar</SelectItem>
                  <SelectItem value="Pallar">Pallar</SelectItem>
                  <SelectItem value="Arundathiyar">Arundathiyar</SelectItem>
                  <SelectItem value="Chakkiliyar">Chakkiliyar</SelectItem>
                  <SelectItem value="Madiga">Madiga</SelectItem>
                  <SelectItem value="Mala">Mala</SelectItem>
                  <SelectItem value="Domar">Domar</SelectItem>
                  <SelectItem value="Dusadh">Dusadh</SelectItem>
                  <SelectItem value="Mahar">Mahar</SelectItem>
                  <SelectItem value="Chamar">Chamar</SelectItem>
                  <SelectItem value="Valmiki">Valmiki</SelectItem>
                  <SelectItem value="Adi Dravida">Adi Dravida</SelectItem>
                  <SelectItem value="Pulaya">Pulaya</SelectItem>
                  <SelectItem value="Holeya">Holeya</SelectItem>
                  <SelectItem value="Madari">Madari</SelectItem>
                  <SelectItem value="Bhangi">Bhangi</SelectItem>
                  <SelectItem value="Domb">Domb</SelectItem>
                  <SelectItem value="Chandala">Chandala</SelectItem>
                  <SelectItem value="Kuravan">Kuravan</SelectItem>
                  <SelectItem value="Dhobi">Dhobi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Sunni Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'sunni' && (
                <>
                  <SelectItem value="Hanafi">Hanafi</SelectItem>
                  <SelectItem value="Shafi">Shafi</SelectItem>
                  <SelectItem value="Maliki">Maliki</SelectItem>
                  <SelectItem value="Hanbali">Hanbali</SelectItem>
                  <SelectItem value="Barelvi">Barelvi</SelectItem>
                  <SelectItem value="Deobandi">Deobandi</SelectItem>
                  <SelectItem value="Chishti">Chishti</SelectItem>
                  <SelectItem value="Qadri">Qadri</SelectItem>
                  <SelectItem value="Rifai">Rifai</SelectItem>
                  <SelectItem value="Sufi">Sufi</SelectItem>
                  <SelectItem value="Jamati">Jamati</SelectItem>
                  <SelectItem value="Tablighi">Tablighi</SelectItem>
                  <SelectItem value="Ahl-e-Hadith">Ahl-e-Hadith</SelectItem>
                  <SelectItem value="Naqshbandi">Naqshbandi</SelectItem>
                  <SelectItem value="Shattari">Shattari</SelectItem>
                  <SelectItem value="Sabiri">Sabiri</SelectItem>
                  <SelectItem value="Faridi">Faridi</SelectItem>
                  <SelectItem value="Qalandari">Qalandari</SelectItem>
                  <SelectItem value="Firdousi">Firdousi</SelectItem>
                  <SelectItem value="Rahmani">Rahmani</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Shia Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'shia' && (
                <>
                  <SelectItem value="Ithna Ashari">Ithna Ashari</SelectItem>
                  <SelectItem value="Ismaili">Ismaili</SelectItem>
                  <SelectItem value="Dawoodi Bohra">Dawoodi Bohra</SelectItem>
                  <SelectItem value="Alavi Bohra">Alavi Bohra</SelectItem>
                  <SelectItem value="Sulaymani Bohra">Sulaymani Bohra</SelectItem>
                  <SelectItem value="Khoja">Khoja</SelectItem>
                  <SelectItem value="Nizari Ismaili">Nizari Ismaili</SelectItem>
                  <SelectItem value="Mustali">Mustali</SelectItem>
                  <SelectItem value="Qarmatian">Qarmatian</SelectItem>
                  <SelectItem value="Zaidi">Zaidi</SelectItem>
                  <SelectItem value="Alawite">Alawite</SelectItem>
                  <SelectItem value="Imami">Imami</SelectItem>
                  <SelectItem value="Akbari">Akbari</SelectItem>
                  <SelectItem value="Usuli">Usuli</SelectItem>
                  <SelectItem value="Shaykhi">Shaykhi</SelectItem>
                  <SelectItem value="Bahraini Shia">Bahraini Shia</SelectItem>
                  <SelectItem value="Irani Shia">Irani Shia</SelectItem>
                  <SelectItem value="Karbalaei">Karbalaei</SelectItem>
                  <SelectItem value="Najafi">Najafi</SelectItem>
                  <SelectItem value="Mashhadi">Mashhadi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Ahmadiyya Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'ahmadiyya' && (
                <>
                  <SelectItem value="Lahori">Lahori</SelectItem>
                  <SelectItem value="Qadiani">Qadiani</SelectItem>
                  <SelectItem value="Ansari Ahmadi">Ansari Ahmadi</SelectItem>
                  <SelectItem value="Nusrat Ahmadi">Nusrat Ahmadi</SelectItem>
                  <SelectItem value="Nizam Ahmadi">Nizam Ahmadi</SelectItem>
                  <SelectItem value="Tanzeem Ahmadi">Tanzeem Ahmadi</SelectItem>
                  <SelectItem value="Markazi Ahmadi">Markazi Ahmadi</SelectItem>
                  <SelectItem value="Tablighi Ahmadi">Tablighi Ahmadi</SelectItem>
                  <SelectItem value="International Ahmadi">International Ahmadi</SelectItem>
                  <SelectItem value="Local Ahmadi">Local Ahmadi</SelectItem>
                  <SelectItem value="Mujaddidi">Mujaddidi</SelectItem>
                  <SelectItem value="Waqf Ahmadi">Waqf Ahmadi</SelectItem>
                  <SelectItem value="Noor Ahmadi">Noor Ahmadi</SelectItem>
                  <SelectItem value="Masroor Ahmadi">Masroor Ahmadi</SelectItem>
                  <SelectItem value="Naseer Ahmadi">Naseer Ahmadi</SelectItem>
                  <SelectItem value="Almas Ahmadi">Almas Ahmadi</SelectItem>
                  <SelectItem value="Mahmood Ahmadi">Mahmood Ahmadi</SelectItem>
                  <SelectItem value="Mumtaz Ahmadi">Mumtaz Ahmadi</SelectItem>
                  <SelectItem value="Fazl Ahmadi">Fazl Ahmadi</SelectItem>
                  <SelectItem value="Zafar Ahmadi">Zafar Ahmadi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Pathan Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'pathan' && (
                <>
                  <SelectItem value="Afridi">Afridi</SelectItem>
                  <SelectItem value="Yusufzai">Yusufzai</SelectItem>
                  <SelectItem value="Khattak">Khattak</SelectItem>
                  <SelectItem value="Bangash">Bangash</SelectItem>
                  <SelectItem value="Orakzai">Orakzai</SelectItem>
                  <SelectItem value="Mohmand">Mohmand</SelectItem>
                  <SelectItem value="Shinwari">Shinwari</SelectItem>
                  <SelectItem value="Mehsud">Mehsud</SelectItem>
                  <SelectItem value="Wazir">Wazir</SelectItem>
                  <SelectItem value="Marwat">Marwat</SelectItem>
                  <SelectItem value="Durrani">Durrani</SelectItem>
                  <SelectItem value="Ghilzai">Ghilzai</SelectItem>
                  <SelectItem value="Barakzai">Barakzai</SelectItem>
                  <SelectItem value="Popalzai">Popalzai</SelectItem>
                  <SelectItem value="Alikhel">Alikhel</SelectItem>
                  <SelectItem value="Mangal">Mangal</SelectItem>
                  <SelectItem value="Tanoli">Tanoli</SelectItem>
                  <SelectItem value="Swati">Swati</SelectItem>
                  <SelectItem value="Wardak">Wardak</SelectItem>
                  <SelectItem value="Turi">Turi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Syed Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'syed' && (
                <>
                  <SelectItem value="Hashmi">Hashmi</SelectItem>
                  <SelectItem value="Alavi">Alavi</SelectItem>
                  <SelectItem value="Naqvi">Naqvi</SelectItem>
                  <SelectItem value="Kazmi">Kazmi</SelectItem>
                  <SelectItem value="Rizvi">Rizvi</SelectItem>
                  <SelectItem value="Jafri">Jafri</SelectItem>
                  <SelectItem value="Zaidi">Zaidi</SelectItem>
                  <SelectItem value="Bukhari">Bukhari</SelectItem>
                  <SelectItem value="Gilani">Gilani</SelectItem>
                  <SelectItem value="Husaini">Husaini</SelectItem>
                  <SelectItem value="Tabatabai">Tabatabai</SelectItem>
                  <SelectItem value="Sajjadi">Sajjadi</SelectItem>
                  <SelectItem value="Musavi">Musavi</SelectItem>
                  <SelectItem value="Qadri">Qadri</SelectItem>
                  <SelectItem value="Sabzwari">Sabzwari</SelectItem>
                  <SelectItem value="Abidi">Abidi</SelectItem>
                  <SelectItem value="Asadi">Asadi</SelectItem>
                  <SelectItem value="Hamid">Hamid</SelectItem>
                  <SelectItem value="Shah">Shah</SelectItem>
                  <SelectItem value="Mir">Mir</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Ansari Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'ansari' && (
                <>
                  <SelectItem value="Siddiqui">Siddiqui</SelectItem>
                  <SelectItem value="Farooqi">Farooqi</SelectItem>
                  <SelectItem value="Usmani">Usmani</SelectItem>
                  <SelectItem value="Baghdadi">Baghdadi</SelectItem>
                  <SelectItem value="Madani">Madani</SelectItem>
                  <SelectItem value="Makki">Makki</SelectItem>
                  <SelectItem value="Harvi">Harvi</SelectItem>
                  <SelectItem value="Sabri">Sabri</SelectItem>
                  <SelectItem value="Noori">Noori</SelectItem>
                  <SelectItem value="Chishti">Chishti</SelectItem>
                  <SelectItem value="Qureshi">Qureshi</SelectItem>
                  <SelectItem value="Abbasi">Abbasi</SelectItem>
                  <SelectItem value="Alvi">Alvi</SelectItem>
                  <SelectItem value="Hashmi">Hashmi</SelectItem>
                  <SelectItem value="Anwari">Anwari</SelectItem>
                  <SelectItem value="Tirmizi">Tirmizi</SelectItem>
                  <SelectItem value="Nadwi">Nadwi</SelectItem>
                  <SelectItem value="Lucknawi">Lucknawi</SelectItem>
                  <SelectItem value="Khudai">Khudai</SelectItem>
                  <SelectItem value="Barelvi">Barelvi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Memon Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'memon' && (
                <>
                  <SelectItem value="Kutchi">Kutchi</SelectItem>
                  <SelectItem value="Sindhi">Sindhi</SelectItem>
                  <SelectItem value="Kathiawari">Kathiawari</SelectItem>
                  <SelectItem value="Halai">Halai</SelectItem>
                  <SelectItem value="Bhatia">Bhatia</SelectItem>
                  <SelectItem value="Surti">Surti</SelectItem>
                  <SelectItem value="Kokni">Kokni</SelectItem>
                  <SelectItem value="Nagori">Nagori</SelectItem>
                  <SelectItem value="Bantva">Bantva</SelectItem>
                  <SelectItem value="Okhai">Okhai</SelectItem>
                  <SelectItem value="Jamati">Jamati</SelectItem>
                  <SelectItem value="Tablighi">Tablighi</SelectItem>
                  <SelectItem value="Rangooni">Rangooni</SelectItem>
                  <SelectItem value="Madhavi">Madhavi</SelectItem>
                  <SelectItem value="Meghji">Meghji</SelectItem>
                  <SelectItem value="Haji">Haji</SelectItem>
                  <SelectItem value="Karachi Memon">Karachi Memon</SelectItem>
                  <SelectItem value="Bombay Memon">Bombay Memon</SelectItem>
                  <SelectItem value="Hyderabad Memon">Hyderabad Memon</SelectItem>
                  <SelectItem value="Calcutta Memon">Calcutta Memon</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Sheikh Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'sheikh' && (
                <>
                  <SelectItem value="Farooqi">Farooqi</SelectItem>
                  <SelectItem value="Usmani">Usmani</SelectItem>
                  <SelectItem value="Abbasi">Abbasi</SelectItem>
                  <SelectItem value="Ansari">Ansari</SelectItem>
                  <SelectItem value="Siddiqui">Siddiqui</SelectItem>
                  <SelectItem value="Qureshi">Qureshi</SelectItem>
                  <SelectItem value="Madani">Madani</SelectItem>
                  <SelectItem value="Baghdadi">Baghdadi</SelectItem>
                  <SelectItem value="Makki">Makki</SelectItem>
                  <SelectItem value="Hashmi">Hashmi</SelectItem>
                  <SelectItem value="Alvi">Alvi</SelectItem>
                  <SelectItem value="Kazmi">Kazmi</SelectItem>
                  <SelectItem value="Rizvi">Rizvi</SelectItem>
                  <SelectItem value="Naqvi">Naqvi</SelectItem>
                  <SelectItem value="Tabatabai">Tabatabai</SelectItem>
                  <SelectItem value="Bukhari">Bukhari</SelectItem>
                  <SelectItem value="Jafri">Jafri</SelectItem>
                  <SelectItem value="Zaidi">Zaidi</SelectItem>
                  <SelectItem value="Gilani">Gilani</SelectItem>
                  <SelectItem value="Musavi">Musavi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Mughal Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'mughal' && (
                <>
                  <SelectItem value="Chughtai">Chughtai</SelectItem>
                  <SelectItem value="Turk">Turk</SelectItem>
                  <SelectItem value="Pathan Mughal">Pathan Mughal</SelectItem>
                  <SelectItem value="Rajput Mughal">Rajput Mughal</SelectItem>
                  <SelectItem value="Barlas">Barlas</SelectItem>
                  <SelectItem value="Yusufzai Mughal">Yusufzai Mughal</SelectItem>
                  <SelectItem value="Lodhi">Lodhi</SelectItem>
                  <SelectItem value="Taimuri">Taimuri</SelectItem>
                  <SelectItem value="Ghaznavi">Ghaznavi</SelectItem>
                  <SelectItem value="Ghauri">Ghauri</SelectItem>
                  <SelectItem value="Khilji">Khilji</SelectItem>
                  <SelectItem value="Sayyid Mughal">Sayyid Mughal</SelectItem>
                  <SelectItem value="Mirza">Mirza</SelectItem>
                  <SelectItem value="Beg">Beg</SelectItem>
                  <SelectItem value="Khan">Khan</SelectItem>
                  <SelectItem value="Zaman">Zaman</SelectItem>
                  <SelectItem value="Shah">Shah</SelectItem>
                  <SelectItem value="Dar">Dar</SelectItem>
                  <SelectItem value="Khawaja">Khawaja</SelectItem>
                  <SelectItem value="Babar">Babar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Muslim Qureshi Sub Castes */}
              {formData.religion === 'Muslim' && formData.caste === 'qureshi' && (
                <>
                  <SelectItem value="Ansari">Ansari</SelectItem>
                  <SelectItem value="Siddiqui">Siddiqui</SelectItem>
                  <SelectItem value="Farooqi">Farooqi</SelectItem>
                  <SelectItem value="Usmani">Usmani</SelectItem>
                  <SelectItem value="Abbasi">Abbasi</SelectItem>
                  <SelectItem value="Baghdadi">Baghdadi</SelectItem>
                  <SelectItem value="Makki">Makki</SelectItem>
                  <SelectItem value="Madani">Madani</SelectItem>
                  <SelectItem value="Hashmi">Hashmi</SelectItem>
                  <SelectItem value="Alvi">Alvi</SelectItem>
                  <SelectItem value="Kazmi">Kazmi</SelectItem>
                  <SelectItem value="Rizvi">Rizvi</SelectItem>
                  <SelectItem value="Naqvi">Naqvi</SelectItem>
                  <SelectItem value="Tabatabai">Tabatabai</SelectItem>
                  <SelectItem value="Bukhari">Bukhari</SelectItem>
                  <SelectItem value="Jafri">Jafri</SelectItem>
                  <SelectItem value="Zaidi">Zaidi</SelectItem>
                  <SelectItem value="Gilani">Gilani</SelectItem>
                  <SelectItem value="Musavi">Musavi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}

              {/* Default for other religions or when no specific sub-castes are defined */}
              {((formData.religion && formData.religion !== 'Hindu' && formData.religion !== 'Muslim') || !formData.caste) && (
                <SelectItem value="other">Other</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
                        <Label htmlFor="plan">Account Type *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.plan === 'free' 
                  ? 'border-royal-blue bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                              onClick={() => handleInputChange('plan', 'free')}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">Free Account</h4>
                <span className="text-green-600 font-bold">₹0</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Complete registration with all details</li>
                <li>✅ View profiles you liked</li>
                <li>✅ Basic profile visibility</li>
                <li>❌ View mutual matches (Premium feature)</li>
              </ul>
            </div>
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.plan === 'premium' 
                  ? 'border-royal-blue bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                              onClick={() => handleInputChange('plan', 'premium')}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">Premium Account</h4>
                <span className="text-orange-600 font-bold">₹999/month</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ All Free features</li>
                <li>✅ View mutual matches</li>
                <li>✅ Priority profile visibility</li>
                <li>✅ Advanced search filters</li>
                <li>✅ Unlimited messaging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Family Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father Details - Left Side */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-blue-600 border-b pb-2">Father's Details</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fatherJob">Father's Occupation</Label>
              <Select value={formData.fatherJob} onValueChange={(value) => handleInputChange('fatherJob', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government Employee">Government Employee</SelectItem>
                  <SelectItem value="Private Employee">Private Employee</SelectItem>
                  <SelectItem value="Business Owner">Business Owner</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Lawyer">Lawyer</SelectItem>
                  <SelectItem value="Farmer">Farmer</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fatherAlive">Father Alive *</Label>
              <Select value={formData.fatherAlive} onValueChange={(value) => handleInputChange('fatherAlive', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mother Details - Right Side */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-pink-600 border-b pb-2">Mother's Details</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="motherJob">Mother's Occupation</Label>
              <Select value={formData.motherJob} onValueChange={(value) => handleInputChange('motherJob', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homemaker">Homemaker</SelectItem>
                  <SelectItem value="Government Employee">Government Employee</SelectItem>
                  <SelectItem value="Private Employee">Private Employee</SelectItem>
                  <SelectItem value="Business Owner">Business Owner</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="motherAlive">Mother Alive *</Label>
              <Select value={formData.motherAlive} onValueChange={(value) => handleInputChange('motherAlive', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Order of Birth - Full Width */}
      <div className="mt-6">
        <Label htmlFor="orderOfBirth">Order of Birth</Label>
        <Select value={formData.orderOfBirth} onValueChange={(value) => handleInputChange('orderOfBirth', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="First">First</SelectItem>
            <SelectItem value="Second">Second</SelectItem>
            <SelectItem value="Third">Third</SelectItem>
            <SelectItem value="Fourth">Fourth</SelectItem>
            <SelectItem value="Fifth">Fifth</SelectItem>
            <SelectItem value="Only Child">Only Child</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Physical Attributes & Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            placeholder="e.g., 5'8&quot;"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="complexion">Complexion</Label>
          <Select value={formData.complexion} onValueChange={(value) => handleInputChange('complexion', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Wheatish">Wheatish</SelectItem>
              <SelectItem value="Dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="disability">Any Disability</Label>
          <Select value={formData.disability} onValueChange={(value) => handleInputChange('disability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="diet">Diet</Label>
          <Select value={formData.diet} onValueChange={(value) => handleInputChange('diet', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="Eggetarian">Eggetarian</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="qualification">Educational Qualification</Label>
          <Select value={formData.qualification} onValueChange={(value) => handleInputChange('qualification', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="CA">CA (Chartered Accountant)</SelectItem>
              <SelectItem value="CS">CS (Company Secretary)</SelectItem>
              <SelectItem value="ICWA">ICWA</SelectItem>
              <SelectItem value="MBBS">MBBS</SelectItem>
              <SelectItem value="BDS">BDS</SelectItem>
              <SelectItem value="B.Tech">B.Tech</SelectItem>
              <SelectItem value="M.Tech">M.Tech</SelectItem>
              <SelectItem value="BBA">BBA</SelectItem>
              <SelectItem value="MBA">MBA</SelectItem>
              <SelectItem value="LLB">LLB</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="incomePerMonth">Monthly Income</Label>
          <Select value={formData.incomePerMonth} onValueChange={(value) => handleInputChange('incomePerMonth', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Below 25,000">Below ₹25,000</SelectItem>
              <SelectItem value="25,000 - 50,000">₹25,000 - ₹50,000</SelectItem>
              <SelectItem value="50,000 - 75,000">₹50,000 - ₹75,000</SelectItem>
              <SelectItem value="75,000 - 1,00,000">₹75,000 - ₹1,00,000</SelectItem>
              <SelectItem value="1,00,000 - 2,00,000">₹1,00,000 - ₹2,00,000</SelectItem>
              <SelectItem value="2,00,000 - 5,00,000">₹2,00,000 - ₹5,00,000</SelectItem>
              <SelectItem value="Above 5,00,000">Above ₹5,00,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="job">Occupation</Label>
          <Select value={formData.job} onValueChange={(value) => handleInputChange('job', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Government Employee">Government Employee</SelectItem>
              <SelectItem value="Private Employee">Private Employee</SelectItem>
              <SelectItem value="Engineer">Engineer</SelectItem>
              <SelectItem value="Lawyer">Lawyer</SelectItem>
              <SelectItem value="CA">Chartered Accountant</SelectItem>
              <SelectItem value="Banking">Banking</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="placeOfJob">Place of Work</Label>
          <Select value={formData.placeOfJob} onValueChange={(value) => handleInputChange('placeOfJob', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select work location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Jaipur">Jaipur</SelectItem>
              <SelectItem value="Lucknow">Lucknow</SelectItem>
              <SelectItem value="Patna">Patna</SelectItem>
              <SelectItem value="Bhopal">Bhopal</SelectItem>
              <SelectItem value="Indore">Indore</SelectItem>
              <SelectItem value="Vadodara">Vadodara</SelectItem>
              <SelectItem value="Surat">Surat</SelectItem>
              <SelectItem value="Nagpur">Nagpur</SelectItem>
              <SelectItem value="Vishakhapatnam">Vishakhapatnam</SelectItem>
              <SelectItem value="Coimbatore">Coimbatore</SelectItem>
              <SelectItem value="Madurai">Madurai</SelectItem>
              <SelectItem value="Salem">Salem</SelectItem>
              <SelectItem value="Tiruchirappalli">Tiruchirappalli</SelectItem>
              <SelectItem value="Vellore">Vellore</SelectItem>
              <SelectItem value="Erode">Erode</SelectItem>
              <SelectItem value="Tiruppur">Tiruppur</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="presentAddress">Present Address *</Label>
          <Textarea
            id="presentAddress"
            value={formData.presentAddress}
            onChange={(e) => handleInputChange('presentAddress', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="permanentAddress">Permanent Address</Label>
          <Textarea
            id="permanentAddress"
            value={formData.permanentAddress}
            onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Astrology & Horoscope Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ownHouse">Own House</Label>
          <Select value={formData.ownHouse} onValueChange={(value) => handleInputChange('ownHouse', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="star">Star (Nakshatra)</Label>
          <Select value={formData.star} onValueChange={(value) => handleInputChange('star', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select star" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ashwini">Ashwini</SelectItem>
              <SelectItem value="Bharani">Bharani</SelectItem>
              <SelectItem value="Krittika">Krittika</SelectItem>
              <SelectItem value="Rohini">Rohini</SelectItem>
              <SelectItem value="Mrigashira">Mrigashira</SelectItem>
              <SelectItem value="Ardra">Ardra</SelectItem>
              <SelectItem value="Punarvasu">Punarvasu</SelectItem>
              <SelectItem value="Pushya">Pushya</SelectItem>
              <SelectItem value="Ashlesha">Ashlesha</SelectItem>
              <SelectItem value="Magha">Magha</SelectItem>
              <SelectItem value="Purva Phalguni">Purva Phalguni</SelectItem>
              <SelectItem value="Uttara Phalguni">Uttara Phalguni</SelectItem>
              <SelectItem value="Hasta">Hasta</SelectItem>
              <SelectItem value="Chitra">Chitra</SelectItem>
              <SelectItem value="Swati">Swati</SelectItem>
              <SelectItem value="Vishakha">Vishakha</SelectItem>
              <SelectItem value="Anuradha">Anuradha</SelectItem>
              <SelectItem value="Jyeshtha">Jyeshtha</SelectItem>
              <SelectItem value="Mula">Mula</SelectItem>
              <SelectItem value="Purva Ashadha">Purva Ashadha</SelectItem>
              <SelectItem value="Uttara Ashadha">Uttara Ashadha</SelectItem>
              <SelectItem value="Shravana">Shravana</SelectItem>
              <SelectItem value="Dhanishta">Dhanishta</SelectItem>
              <SelectItem value="Shatabhisha">Shatabhisha</SelectItem>
              <SelectItem value="Purva Bhadrapada">Purva Bhadrapada</SelectItem>
              <SelectItem value="Uttara Bhadrapada">Uttara Bhadrapada</SelectItem>
              <SelectItem value="Revati">Revati</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="laknam">Laknam</Label>
          <Select value={formData.laknam} onValueChange={(value) => handleInputChange('laknam', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select laknam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manglik">Manglik</SelectItem>
              <SelectItem value="Non-Manglik">Non-Manglik</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="raasi">Raasi</Label>
          <Select value={formData.raasi} onValueChange={(value) => handleInputChange('raasi', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select raasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mesha (Aries)">Mesha (Aries)</SelectItem>
              <SelectItem value="Vrishabha (Taurus)">Vrishabha (Taurus)</SelectItem>
              <SelectItem value="Mithuna (Gemini)">Mithuna (Gemini)</SelectItem>
              <SelectItem value="Karka (Cancer)">Karka (Cancer)</SelectItem>
              <SelectItem value="Simha (Leo)">Simha (Leo)</SelectItem>
              <SelectItem value="Kanya (Virgo)">Kanya (Virgo)</SelectItem>
              <SelectItem value="Tula (Libra)">Tula (Libra)</SelectItem>
              <SelectItem value="Vrishchika (Scorpio)">Vrishchika (Scorpio)</SelectItem>
              <SelectItem value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</SelectItem>
              <SelectItem value="Makara (Capricorn)">Makara (Capricorn)</SelectItem>
              <SelectItem value="Kumbha (Aquarius)">Kumbha (Aquarius)</SelectItem>
              <SelectItem value="Meena (Pisces)">Meena (Pisces)</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gothram">Gothram</Label>
          <Input
            id="gothram"
            value={formData.gothram}
            onChange={(e) => handleInputChange('gothram', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="placeOfBirth">Place of Birth</Label>
          <Input
            id="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="padam">Padam</Label>
          <Select value={formData.padam} onValueChange={(value) => handleInputChange('padam', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="First">First</SelectItem>
              <SelectItem value="Second">Second</SelectItem>
              <SelectItem value="Third">Third</SelectItem>
              <SelectItem value="Fourth">Fourth</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dossam">Dossam</Label>
          <Select value={formData.dossam} onValueChange={(value) => handleInputChange('dossam', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nativity">Nativity</Label>
          <Input
            id="nativity"
            value={formData.nativity}
            onChange={(e) => handleInputChange('nativity', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="horoscopeRequired">Horoscope Required</Label>
          <Select value={formData.horoscopeRequired} onValueChange={(value) => handleInputChange('horoscopeRequired', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="balance">Balance</Label>
          <Input
            id="balance"
            placeholder="e.g., 25 years"
            value={formData.balance}
            onChange={(e) => handleInputChange('balance', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dasa">Dasa</Label>
          <Input
            id="dasa"
            value={formData.dasa}
            onChange={(e) => handleInputChange('dasa', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Partner Expectations & Additional Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="partnerJob">Preferred Partner Job</Label>
          <Select value={formData.partnerJob} onValueChange={(value) => handleInputChange('partnerJob', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any</SelectItem>
              <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="preferredAgeFrom">Preferred Age From</Label>
          <Input
            id="preferredAgeFrom"
            type="number"
            value={formData.preferredAgeFrom}
            onChange={(e) => handleInputChange('preferredAgeFrom', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="preferredAgeTo">Preferred Age To</Label>
          <Input
            id="preferredAgeTo"
            type="number"
            value={formData.preferredAgeTo}
            onChange={(e) => handleInputChange('preferredAgeTo', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="jobPreference">Job Preference</Label>
          <Select value={formData.jobPreference} onValueChange={(value) => handleInputChange('jobPreference', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Optional">Optional</SelectItem>
              <SelectItem value="Required">Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="partnerDiet">Preferred Partner Diet</Label>
          <Select value={formData.partnerDiet} onValueChange={(value) => handleInputChange('partnerDiet', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="Any">Any</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="partnerSubCaste">Preferred Sub Caste</Label>
          <Input
            id="partnerSubCaste"
            value={formData.partnerSubCaste}
            onChange={(e) => handleInputChange('partnerSubCaste', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="partnerComments">Partner Preferences Comments</Label>
          <Textarea
            id="partnerComments"
            value={formData.partnerComments}
            onChange={(e) => handleInputChange('partnerComments', e.target.value)}
            placeholder="Any specific preferences or requirements..."
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="otherDetails">Additional Details</Label>
          <Textarea
            id="otherDetails"
            value={formData.otherDetails}
            onChange={(e) => handleInputChange('otherDetails', e.target.value)}
            placeholder="Any additional information about yourself, achievements, hobbies, etc..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create Your Account</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Account Creation
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>After completing this step, your account will be created and your profile will be visible to everyone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Matrimony Registration Form</CardTitle>
            <CardDescription>
              Complete your profile to find your perfect match. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default RegistrationForm;