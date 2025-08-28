import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  User, 
  Calendar, 
  CreditCard,
  Crown
} from "lucide-react";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  updateDoc, 
  doc,
  where 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: 'monthly' | 'yearly';
  amount: number;
  transactionId: string;
  screenshotUrl: string; // Filename only
  screenshotBase64?: string; // Base64 data for admin access
  status: 'pending' | 'approved' | 'denied';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export default function Payments() {
  const { firebaseUser } = useAuth();
  const { isAdmin, loading: adminLoading, verifyAdminPassword, needsPassword } = useAdmin();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (firebaseUser && isAdmin) {
      fetchPayments();
    }
  }, [firebaseUser, isAdmin]);

  // Show password modal if admin email but no password verified
  useEffect(() => {
    if (needsPassword && !showPasswordModal) {
      setShowPasswordModal(true);
    }
  }, [needsPassword, showPasswordModal]);

  const fetchPayments = async () => {
    try {
      console.log('🔍 Fetching payments...');
      setLoading(true);
      
      const paymentsQuery = query(
        collection(db, 'payments'),
        orderBy('submittedAt', 'desc')
      );
      
      console.log('📥 Executing query...');
      const snapshot = await getDocs(paymentsQuery);
      
      console.log('📊 Query results:', {
        size: snapshot.size,
        empty: snapshot.empty,
        docs: snapshot.docs.length
      });
      
      const paymentsData: Payment[] = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Document data:', {
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          status: data.status
        });
        
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          reviewedAt: data.reviewedAt?.toDate()
        } as Payment;
      });
      
      console.log('✅ Processed payments:', paymentsData.length);
      setPayments(paymentsData);
      
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payment: Payment) => {
    if (!firebaseUser) return;
    
    setProcessingId(payment.id);
    try {
      console.log('🔄 Approving payment for:', payment.userName);
      console.log('📧 User email:', payment.userEmail);
      console.log('🆔 User ID:', payment.userId);
      console.log('📋 Plan:', payment.plan);
      
      // Update payment status
      const paymentRef = doc(db, 'payments', payment.id);
      await updateDoc(paymentRef, {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: firebaseUser.email
      });
      console.log('✅ Payment status updated to approved');

      // Find user's registration document in registrations collection using userId
      const registrationsCollection = collection(db, 'registrations');
      const registrationQuery = query(registrationsCollection, where('userId', '==', payment.userId));
      const registrationSnapshot = await getDocs(registrationQuery);
      
      if (!registrationSnapshot.empty) {
        const registrationDoc = registrationSnapshot.docs[0];
        const registrationRef = doc(db, 'registrations', registrationDoc.id);
        
        await updateDoc(registrationRef, {
          plan: 'premium' // Change plan from 'free' to 'premium'
        });
        
        console.log('✅ User registration updated to premium using userId:', payment.userId);
        console.log('📄 Registration document ID:', registrationDoc.id);
      } else {
        console.log('⚠️ No registration found for userId:', payment.userId);
        throw new Error('User registration not found');
      }
      
      console.log('✅ User upgraded to premium successfully!');
      console.log('📋 Updated field:');
      console.log('• plan: premium');

      toast({
        title: "Payment Approved",
        description: `${payment.userName} has been upgraded to premium`,
      });

      // Refresh payments list
      fetchPayments();
    } catch (error) {
      console.error('❌ Error approving payment:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      toast({
        title: "Approval Failed",
        description: "There was an error approving the payment",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (payment: Payment) => {
    if (!firebaseUser) return;
    
    setProcessingId(payment.id);
    try {
      const paymentRef = doc(db, 'payments', payment.id);
      await updateDoc(paymentRef, {
        status: 'denied',
        reviewedAt: new Date(),
        reviewedBy: firebaseUser.email
      });

      toast({
        title: "Payment Denied",
        description: `Payment from ${payment.userName} has been denied`,
      });

      fetchPayments();
    } catch (error) {
      console.error('Error denying payment:', error);
      toast({
        title: "Denial Failed",
        description: "There was an error denying the payment",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Denied</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
          <p className="mt-4 text-gray-600">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin && !needsPassword) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the Payment Management page. 
              Only authorized administrators can view and manage payments.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Current user: <span className="font-medium">{firebaseUser?.email}</span></p>
              <p>Contact the system administrator for access.</p>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
               <Footer />
       
       {/* Admin Password Modal */}
       <AdminPasswordModal
         isOpen={showPasswordModal}
         onClose={() => setShowPasswordModal(false)}
         onVerify={verifyAdminPassword}
         userEmail={firebaseUser?.email || ''}
       />
     </div>
   );
 }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-poppins font-bold mb-3">
              Payment <span className="text-gold">Management</span>
            </h1>
            <p className="text-lg text-blue-100 mb-4 max-w-2xl mx-auto">
              Review and manage premium payment submissions
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={fetchPayments}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                🔄 Refresh Payments
              </Button>
              <Button 
                onClick={() => {
                  console.log('🔍 Current payments state:', payments);
                  console.log('🔍 Current loading state:', loading);
                  console.log('🔍 Current admin state:', { isAdmin, adminLoading, needsPassword });
                }}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                📊 Debug Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Payments Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {payments.filter(p => p.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {payments.filter(p => p.status === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Found</h3>
                  <p className="text-gray-600">No payment submissions have been made yet.</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.userName}</h3>
                          <p className="text-sm text-gray-600">{payment.userEmail}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Crown className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-gray-600 capitalize">{payment.plan} Plan</span>
                            <span className="text-sm font-medium text-gray-900">₹{payment.amount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(payment.submittedAt)}</p>
                          {payment.reviewedAt && (
                            <>
                              <p className="text-sm text-gray-600 mt-1">Reviewed</p>
                              <p className="text-sm font-medium text-gray-900">{formatDate(payment.reviewedAt)}</p>
                            </>
                          )}
                        </div>
                        
                        <div className="text-center">
                          {getStatusBadge(payment.status)}
                          <p className="text-xs text-gray-500 mt-1">ID: {payment.transactionId}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogDescription>
                                  Review payment submission from {payment.userName}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">User</p>
                                    <p className="text-sm text-gray-900">{payment.userName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                    <p className="text-sm text-gray-900">{payment.userEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Plan</p>
                                    <p className="text-sm text-gray-900 capitalize">{payment.plan}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Amount</p>
                                    <p className="text-sm text-gray-900">₹{payment.amount}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Transaction ID</p>
                                    <p className="text-sm text-gray-900 font-mono">{payment.transactionId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <div className="mt-1">{getStatusBadge(payment.status)}</div>
                                  </div>
                                </div>
                                
                                                                                                     <div>
                                     <p className="text-sm font-medium text-gray-600 mb-2">Payment Screenshot</p>
                                     <div className="border rounded-lg p-4">
                                       <img 
                                         src={payment.screenshotBase64 || payment.screenshotUrl} 
                                         alt="Payment screenshot" 
                                         className="max-w-full h-64 object-contain mx-auto rounded"
                                       />
                                     </div>
                                   </div>
                                
                                {payment.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <Button
                                      className="flex-1 bg-green-500 hover:bg-green-600"
                                      onClick={() => handleApprove(payment)}
                                      disabled={processingId === payment.id}
                                    >
                                      {processingId === payment.id ? 'Processing...' : 'Approve'}
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="flex-1"
                                      onClick={() => handleDeny(payment)}
                                      disabled={processingId === payment.id}
                                    >
                                      {processingId === payment.id ? 'Processing...' : 'Deny'}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {payment.status === 'pending' && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleApprove(payment)}
                                disabled={processingId === payment.id}
                              >
                                {processingId === payment.id ? '...' : '✓'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeny(payment)}
                                disabled={processingId === payment.id}
                              >
                                {processingId === payment.id ? '...' : '✕'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
