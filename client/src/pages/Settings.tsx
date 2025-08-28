import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { deleteAccount, updateUserSettings, updateUserPassword } from "@/lib/firebaseAuth";
import { updateProfile } from "firebase/auth";
import type { User as FirebaseUserType } from "@/lib/firebaseAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff,
  Save,
  Trash2
} from "lucide-react";

export default function Settings() {
  const { user, firebaseUser, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Account settings
  const [accountData, setAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    matchAlerts: true,
    messageAlerts: true,
    profileViews: false,
    weeklyDigest: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showOnlineStatus: true,
    showLastSeen: false,
    allowMessages: true,
    allowProfileViews: true,
    shareData: false,
  });

  // Language settings
  const [languageSettings, setLanguageSettings] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
  });

  useEffect(() => {
    if (!loading && !firebaseUser) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [firebaseUser, loading, toast]);

  useEffect(() => {
    if (user) {
      setAccountData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNo: user.mobileNo || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleAccountSave = async () => {
    if (!firebaseUser) {
      toast({
        title: "Error",
        description: "You must be logged in to save changes",
        variant: "destructive",
      });
      return;
    }

    // Validate password change
    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Update user data in Firestore
      const userDataToUpdate: Partial<FirebaseUserType> = {
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        mobileNo: accountData.mobileNo,
        fullName: `${accountData.firstName} ${accountData.lastName}`.trim(),
      };

      await updateUserSettings(firebaseUser.uid, userDataToUpdate);

      // Update password if provided
      if (accountData.currentPassword && accountData.newPassword) {
        await updateUserPassword(accountData.currentPassword, accountData.newPassword);
      }

      // Update Firebase Auth display name
      if (firebaseUser) {
        await updateProfile(firebaseUser, {
          displayName: userDataToUpdate.fullName || undefined
        });
      }

      toast({
        title: "Success",
        description: "Account settings updated successfully",
      });

      // Clear password fields
      setAccountData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error('Error updating account settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update account settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    if (!firebaseUser) {
      toast({
        title: "Error",
        description: "You must be logged in to save changes",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // For now, we'll store notification settings in the user document
      // In a real app, you might want a separate settings collection
      await updateUserSettings(firebaseUser.uid, {
        notificationSettings: notificationSettings
      });

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrivacySave = async () => {
    if (!firebaseUser) {
      toast({
        title: "Error",
        description: "You must be logged in to save changes",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateUserSettings(firebaseUser.uid, {
        privacySettings: privacySettings
      });

      toast({
        title: "Success",
        description: "Privacy settings updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageSave = async () => {
    if (!firebaseUser) {
      toast({
        title: "Error",
        description: "You must be logged in to save changes",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateUserSettings(firebaseUser.uid, {
        languageSettings: languageSettings
      });

      toast({
        title: "Success",
        description: "Language settings updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating language settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update language settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await deleteAccount(deletePassword);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        duration: 5000,
      });

      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
      
      // Clear password on error
      setDeletePassword("");
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-poppins font-bold mb-6">
              <span className="text-gold">Settings</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Manage your account, privacy, and preferences
            </p>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={accountData.firstName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={accountData.lastName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={accountData.email}
                        onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNo">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="mobileNo"
                        type="tel"
                        value={accountData.mobileNo}
                        onChange={(e) => setAccountData(prev => ({ ...prev, mobileNo: e.target.value }))}
                        className="pl-10"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Change Password</h4>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        {showPassword ? (
                          <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" 
                            onClick={() => setShowPassword(false)} />
                        ) : (
                          <Eye className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" 
                            onClick={() => setShowPassword(true)} />
                        )}
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={accountData.currentPassword}
                          onChange={(e) => setAccountData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="pr-10"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={accountData.newPassword}
                          onChange={(e) => setAccountData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleAccountSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Delete Account</h4>
                      <p className="text-sm text-gray-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how and when you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Match Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified when you have a new match</p>
                      </div>
                      <Switch
                        checked={notificationSettings.matchAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, matchAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Message Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified when you receive new messages</p>
                      </div>
                      <Switch
                        checked={notificationSettings.messageAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, messageAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Profile Views</h4>
                        <p className="text-sm text-gray-600">Get notified when someone views your profile</p>
                      </div>
                      <Switch
                        checked={notificationSettings.profileViews}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, profileViews: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Weekly Digest</h4>
                        <p className="text-sm text-gray-600">Receive a weekly summary of your activity</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleNotificationSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    Control who can see your information and how it's shared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select
                        value={privacySettings.profileVisibility}
                        onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Everyone can see your profile</SelectItem>
                          <SelectItem value="members">Members Only - Only registered members can see your profile</SelectItem>
                          <SelectItem value="matches">Matches Only - Only your matches can see your profile</SelectItem>
                          <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Show Online Status</h4>
                        <p className="text-sm text-gray-600">Let others know when you're online</p>
                      </div>
                      <Switch
                        checked={privacySettings.showOnlineStatus}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Show Last Seen</h4>
                        <p className="text-sm text-gray-600">Show when you were last active</p>
                      </div>
                      <Switch
                        checked={privacySettings.showLastSeen}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showLastSeen: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Allow Messages</h4>
                        <p className="text-sm text-gray-600">Allow others to send you messages</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowMessages}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowMessages: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Allow Profile Views</h4>
                        <p className="text-sm text-gray-600">Allow others to view your profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowProfileViews}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowProfileViews: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Share Data for Analytics</h4>
                        <p className="text-sm text-gray-600">Help us improve by sharing anonymous usage data</p>
                      </div>
                      <Switch
                        checked={privacySettings.shareData}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, shareData: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePrivacySave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Language Settings */}
            <TabsContent value="language" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                  <CardDescription>
                    Customize your language and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={languageSettings.language}
                        onValueChange={(value) => setLanguageSettings(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="kn">Kannada</SelectItem>
                          <SelectItem value="ml">Malayalam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={languageSettings.timezone}
                        onValueChange={(value) => setLanguageSettings(prev => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                          <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                          <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select
                        value={languageSettings.dateFormat}
                        onValueChange={(value) => setLanguageSettings(prev => ({ ...prev, dateFormat: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleLanguageSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

             <Footer />

       {/* Delete Account Confirmation Modal */}
       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirm Account Deletion</DialogTitle>
             <DialogDescription>
               This action cannot be undone. Please enter your password to confirm account deletion.
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="deletePassword">Password</Label>
               <Input
                 id="deletePassword"
                 type="password"
                 value={deletePassword}
                 onChange={(e) => setDeletePassword(e.target.value)}
                 placeholder="Enter your password"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     confirmDeleteAccount();
                   }
                 }}
               />
             </div>
           </div>
           <DialogFooter>
             <Button
               variant="outline"
               onClick={() => {
                 setShowDeleteModal(false);
                 setDeletePassword("");
               }}
               disabled={saving}
             >
               Cancel
             </Button>
             <Button
               variant="destructive"
               onClick={confirmDeleteAccount}
               disabled={saving || !deletePassword.trim()}
             >
               {saving ? "Deleting..." : "Delete Account"}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   );
 }
