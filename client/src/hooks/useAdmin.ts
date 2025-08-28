import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

// Admin credentials - you can modify this list
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@envaranmatrimony.com',
    password: 'admin123' // Change this to a secure password
  },
  {
    email: 'baskar@example.com',
    password: 'baskar123' // Change this to a secure password
  },
  {
    email: 'baskar@gmail.com',
    password: 'baskar123' // Updated to match the created account
  }
];

export function useAdmin() {
  const { firebaseUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (firebaseUser) {
      const userEmail = firebaseUser.email?.toLowerCase();
      
      // Check if user email exists in admin list
      const adminCredential = userEmail ? 
        ADMIN_CREDENTIALS.find(cred => cred.email.toLowerCase() === userEmail) : 
        null;
      
      if (adminCredential) {
        // If admin email found, check if password is set
        if (adminPassword === adminCredential.password) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        // User is not an admin email - set loading to false immediately
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      setLoading(false);
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [firebaseUser, adminPassword]);

  const verifyAdminPassword = (password: string) => {
    const userEmail = firebaseUser?.email?.toLowerCase();
    const adminCredential = userEmail ? 
      ADMIN_CREDENTIALS.find(cred => cred.email.toLowerCase() === userEmail) : 
      null;
    
    if (adminCredential && adminCredential.password === password) {
      setAdminPassword(password);
      return true;
    }
    return false;
  };

  const clearAdminAccess = () => {
    setAdminPassword('');
    setIsAdmin(false);
  };

  return { 
    isAdmin, 
    loading, 
    verifyAdminPassword, 
    clearAdminAccess,
    needsPassword: firebaseUser && ADMIN_CREDENTIALS.some(cred => 
      cred.email.toLowerCase() === firebaseUser.email?.toLowerCase()
    ) && !adminPassword
  };
}
