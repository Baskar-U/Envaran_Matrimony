import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { WhereFilterOp } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBHCdGBysevoCNZeI0oAXVBEbKUtyuai4k",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "matrimony-events.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "matrimony-events",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "matrimony-events.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "719624016803",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:719624016803:web:f332698f12225f1fbdc016",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MK7T3DHCK6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// TEMPORARY: Make Firebase globally accessible for setup script
// Remove this after setup is complete
if (typeof window !== 'undefined') {
  (window as any).firebase = {
    firestore: () => ({
      collection: (collectionName: string) => ({
        doc: (docId: string) => ({
          set: async (data: any) => {
            const { doc, setDoc } = await import('firebase/firestore');
            const docRef = doc(db, collectionName, docId);
            return setDoc(docRef, data);
          }
        }),
        where: (field: string, operator: WhereFilterOp, value: any) => ({
          get: async () => {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const q = query(collection(db, collectionName), where(field, operator, value));
            return getDocs(q);
          }
        }),
        orderBy: (field: string, direction: 'asc' | 'desc' = 'desc') => ({
          get: async () => {
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const q = query(collection(db, collectionName), orderBy(field, direction));
            return getDocs(q);
          }
        })
      })
    })
  };
  
  console.log('✅ Firebase made globally accessible for setup script');
}

export default app;
