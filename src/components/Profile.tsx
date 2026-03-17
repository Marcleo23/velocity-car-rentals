import React, { useState, useRef } from 'react';
import { User, Mail, Shield, Phone, FileText, Save, Loader2, Camera, Upload, X, Globe } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    phoneNumber: profile.phoneNumber || '',
    bio: profile.bio || '',
    photoURL: profile.photoURL || ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert('Image size must be less than 800KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
      setShowUrlInput(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-12 text-center">
        <div className="relative inline-block mb-6 group">
          <div className="relative">
            {formData.photoURL ? (
              <img 
                src={formData.photoURL} 
                alt="" 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-black shadow-xl object-cover" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-4 border-white dark:border-black shadow-xl">
                <User className="w-12 h-12 text-black/20 dark:text-white/20" />
              </div>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer overflow-hidden">
                <div className="flex flex-col items-center gap-1 text-white">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase">Change</span>
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white dark:border-black" />
          
          {isEditing && (
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white dark:bg-black rounded-full shadow-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black/60 dark:text-white/60"
                title="Upload Local Image"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="p-2 bg-white dark:bg-black rounded-full shadow-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black/60 dark:text-white/60"
                title="Enter Image URL"
              >
                <Globe className="w-4 h-4" />
              </button>
              {formData.photoURL && (
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photoURL: '' }))}
                  className="p-2 bg-white dark:bg-black rounded-full shadow-md hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-rose-500"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {isEditing && showUrlInput && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 max-w-sm mx-auto"
            >
              <input 
                type="url"
                placeholder="Paste image URL here..."
                value={formData.photoURL.startsWith('data:') ? '' : formData.photoURL}
                onChange={(e) => setFormData(prev => ({ ...prev, photoURL: e.target.value }))}
                className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-bold tracking-tight mb-1 dark:text-white">{profile.displayName}</h1>
        <div className="flex items-center justify-center gap-2 text-black/40 dark:text-white/40 font-medium text-sm">
          <Mail className="w-3.5 h-3.5" />
          {profile.email}
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-[32px] border border-black/5 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold dark:text-white">Account Details</h2>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-sm font-bold text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                  <input 
                    type="text" 
                    disabled
                    value={profile.username}
                    className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium opacity-50 outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none disabled:opacity-50 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none disabled:opacity-50 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-black/20 dark:text-white/20" />
                  <textarea 
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none disabled:opacity-50 resize-none dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-black/40 dark:text-white/40" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider dark:text-white/60">Account Role</div>
                      <div className="text-sm font-medium text-black/60 dark:text-white/80 capitalize">{profile.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setShowUrlInput(false);
                    setFormData({
                      displayName: profile.displayName,
                      phoneNumber: profile.phoneNumber || '',
                      bio: profile.bio || '',
                      photoURL: profile.photoURL || ''
                    });
                  }}
                  className="flex-1 py-3 bg-black/5 dark:bg-white/5 text-black dark:text-white rounded-xl font-bold text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
