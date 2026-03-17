import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { X, User, Mail, Lock, Phone, FileText, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login with email
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Signup
        if (username.length < 3) throw new Error('Username must be at least 3 characters');
        
        const usernameLower = username.toLowerCase();
        const usernameDoc = await getDoc(doc(db, 'usernames', usernameLower));
        if (usernameDoc.exists()) {
          throw new Error('Username already taken');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Firebase profile
        await updateFirebaseProfile(user, {
          displayName: fullName
        });

        // Create Firestore profile
        const profileData = {
          uid: user.uid,
          email,
          username: usernameLower,
          displayName: fullName,
          bio,
          phoneNumber,
          role: email === 'leom57583@gmail.com' ? 'admin' : 'user'
        };

        await setDoc(doc(db, 'users', user.uid), profileData);
        await setDoc(doc(db, 'usernames', usernameLower), { 
          email, 
          uid: user.uid 
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-black rounded-[40px] shadow-2xl overflow-hidden border border-black/5 dark:border-white/5"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight dark:text-white">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-black/40 dark:text-white/40 text-sm font-medium mt-1">
                  {isLogin ? 'Enter your credentials to continue' : 'Join our premium car rental fleet'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-medium">
                <div className="bg-rose-500 text-white p-1 rounded-full">
                  <X className="w-3 h-3" />
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {(isLogin || !isLogin) && (
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 dark:text-white/20" />
                  <input 
                    required
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="space-y-4">
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 dark:text-white/20" />
                    <input 
                      required
                      type="text" 
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 dark:text-white/20" />
                    <input 
                      required
                      type="text" 
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 dark:text-white/20" />
                    <input 
                      required
                      type="tel" 
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-black/20 dark:text-white/20" />
                    <textarea 
                      required
                      placeholder="Bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none resize-none dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 dark:text-white/20" />
                <input 
                  required
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black rounded-full animate-spin mx-auto" />
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
