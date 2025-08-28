import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Check, Star, Heart, Eye, MessageSquare, Users, Zap, Shield, Gift, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Premium() {
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plans = {
    monthly: {
      price: 299,
      period: 'month',
      savings: null,
      popular: false
    },
    yearly: {
      price: 2999,
      period: 'year',
      savings: 'Save ₹589',
      popular: true
    }
  };

  const features = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "View Contact Details",
      description: "See phone numbers and email addresses of all profiles"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Unlimited Messages",
      description: "Send unlimited messages to any profile"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Advanced Matching",
      description: "Get priority matching with advanced algorithms"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Profile Boost",
      description: "Your profile appears first in search results"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Notifications",
      description: "Get instant notifications for likes and matches"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Verified Badge",
      description: "Get a verified badge on your profile"
    },
    {
      icon: <Gift className="h-5 w-5" />,
      title: "Exclusive Events",
      description: "Access to exclusive matrimony events"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Priority Support",
      description: "24/7 priority customer support"
    }
  ];

  const handleUpgrade = () => {
    setIsPaymentOpen(true);
  };

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

    const handleSubmitPayment = async () => {
    if (!firebaseUser || !transactionId.trim() || !screenshot) {
      toast({
        title: "Missing Information",
        description: "Please provide transaction ID and screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Convert screenshot to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
      });
      reader.readAsDataURL(screenshot);
      const screenshotBase64 = await base64Promise;

      // Add payment record to Firestore with base64 screenshot
      await addDoc(collection(db, 'payments'), {
        userId: firebaseUser.uid,
        userEmail: firebaseUser.email,
        userName: firebaseUser.displayName || 'Unknown',
        plan: selectedPlan,
        amount: plans[selectedPlan].price,
        transactionId: transactionId.trim(),
        screenshotUrl: `${Date.now()}_${screenshot.name}`, // Store filename only
        screenshotBase64: screenshotBase64, // Store base64 data for admin access
        status: 'pending',
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null
      });

      // Show success dialog
      setShowSuccessDialog(true);
      setIsPaymentOpen(false);
      
      // Reset form
      setTransactionId('');
      setScreenshot(null);
      setScreenshotPreview(null);

    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Upgrade to <span className="text-yellow-300">Premium</span>
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Unlock unlimited access to contact details, advanced matching, and exclusive features
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plan Selection */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <div className="flex">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-3 rounded-md font-medium transition-all relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  Yearly
                  {plans.yearly.savings && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-green-500">
                      {plans.yearly.savings}
                    </Badge>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <Card className="relative border-2 border-orange-200 shadow-xl">
              {plans[selectedPlan].popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-800">
                  ₹{plans[selectedPlan].price}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  per {plans[selectedPlan].period}
                </CardDescription>
                {plans[selectedPlan].savings && (
                  <Badge className="w-fit mx-auto bg-green-100 text-green-800">
                    {plans[selectedPlan].savings}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold"
                      onClick={handleUpgrade}
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Upgrade Now
                    </Button>
                  </DialogTrigger>
                                     <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
                     <DialogHeader>
                       <DialogTitle className="text-center text-xl">Complete Payment</DialogTitle>
                       <DialogDescription className="text-center">
                         Scan the QR code and provide payment details
                       </DialogDescription>
                     </DialogHeader>
                     
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                               {/* Left Side - QR Code */}
                        <div className="flex flex-col items-center">
                                                     <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-lg max-w-sm">
                             {/* QR Code Image - Zoomed Out to Show Name */}
                             <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
                               <img 
                                 src="/payment.jpg" 
                                 alt="UPI QR Code" 
                                 className="w-full h-full object-contain"
                                 onError={(e) => {
                                   console.error('Failed to load QR code image:', e);
                                   // Show a fallback message
                                   e.currentTarget.style.display = 'none';
                                   const parent = e.currentTarget.parentElement;
                                   if (parent) {
                                     parent.innerHTML = `
                                       <div class="text-center text-gray-500">
                                         <p class="text-sm">QR Code Image</p>
                                         <p class="text-xs">(payment.jpg not found)</p>
                                         <p class="text-xs mt-2">Check console for details</p>
                                       </div>
                                     `;
                                   }
                                 }}
                                 onLoad={() => {
                                   console.log('✅ QR code image loaded successfully');
                                 }}
                                 style={{ maxWidth: '100%', maxHeight: '100%' }}
                                 crossOrigin="anonymous"
                               />
                             </div>
                             
                             {/* QR code image contains all payment details */}
                           </div>
                          
                          <p className="text-sm text-gray-600 mt-3 text-center">Scan to pay with any UPI app</p>
                          
                          {/* Payment Details */}
                          <div className="mt-4 text-center space-y-1">
                            <p className="text-sm text-gray-600">
                              Amount: <span className="font-semibold">₹{plans[selectedPlan].price}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Plan: <span className="font-semibold capitalize">{selectedPlan}</span>
                            </p>
                          </div>
                        </div>

                       {/* Right Side - Form */}
                       <div className="space-y-6">
                         <div className="space-y-4">
                           {/* Transaction ID Input */}
                           <div className="space-y-2">
                             <Label htmlFor="transactionId" className="text-base font-medium">Transaction ID *</Label>
                             <Input
                               id="transactionId"
                               type="text"
                               placeholder="Enter your transaction ID"
                               value={transactionId}
                               onChange={(e) => setTransactionId(e.target.value)}
                               className="w-full h-12 text-base"
                             />
                           </div>

                           {/* Screenshot Upload */}
                           <div className="space-y-2">
                             <Label htmlFor="screenshot" className="text-base font-medium">Payment Screenshot *</Label>
                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-h-[200px] flex flex-col items-center justify-center">
                               {screenshotPreview ? (
                                 <div className="space-y-4 w-full">
                                   <img 
                                     src={screenshotPreview} 
                                     alt="Screenshot preview" 
                                     className="max-w-full h-40 object-contain mx-auto rounded border"
                                   />
                                   <Button
                                     type="button"
                                     variant="outline"
                                     size="sm"
                                     onClick={removeScreenshot}
                                     className="text-red-600 hover:text-red-700"
                                   >
                                     <X className="h-4 w-4 mr-1" />
                                     Remove Screenshot
                                   </Button>
                                 </div>
                               ) : (
                                 <div className="space-y-4">
                                   <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                   <div>
                                     <p className="text-sm text-gray-600 mb-2">Click to upload payment screenshot</p>
                                     <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                   </div>
                                   <Button
                                     type="button"
                                     variant="outline"
                                     size="sm"
                                     onClick={() => fileInputRef.current?.click()}
                                     className="mt-2"
                                   >
                                     Choose File
                                   </Button>
                                 </div>
                               )}
                               <input
                                 ref={fileInputRef}
                                 type="file"
                                 accept="image/*"
                                 onChange={handleScreenshotChange}
                                 className="hidden"
                               />
                             </div>
                           </div>
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex space-x-3 pt-4">
                           <Button 
                             variant="outline" 
                             className="flex-1 h-12 text-base"
                             onClick={() => setIsPaymentOpen(false)}
                           >
                             Cancel
                           </Button>
                           <Button 
                             className="flex-1 h-12 text-base bg-green-500 hover:bg-green-600"
                             onClick={handleSubmitPayment}
                             disabled={isProcessing || !transactionId.trim() || !screenshot}
                           >
                             {isProcessing ? 'Submitting...' : 'Submit Payment'}
                           </Button>
                         </div>
                       </div>
                     </div>
                   </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Premium Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get access to exclusive features that will help you find your perfect match faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

             <Footer />

       {/* Success Dialog */}
       <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle className="text-center text-green-600">🎉 Thank You!</DialogTitle>
             <DialogDescription className="text-center">
               Your payment has been submitted successfully
             </DialogDescription>
           </DialogHeader>
           
           <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
               <Check className="h-8 w-8 text-green-600" />
             </div>
             
             <div className="space-y-2">
               <h3 className="font-semibold text-gray-800">Payment Submitted Successfully</h3>
               <p className="text-sm text-gray-600">
                 Thank you for registering for premium! Our team will review your payment and make your profile premium within 5 minutes.
               </p>
               <p className="text-sm text-gray-600 font-medium">
                 Thank you for your patience.
               </p>
             </div>
             
             <Button 
               className="w-full bg-green-500 hover:bg-green-600"
               onClick={() => {
                 setShowSuccessDialog(false);
                 window.location.href = '/home';
               }}
             >
               Continue to Home
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   );
 }
