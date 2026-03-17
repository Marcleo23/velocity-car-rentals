import React from 'react';
import { Car, User, LogOut, LayoutDashboard, Calendar, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: any;
  userProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  isAdmin: boolean;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  userProfile,
  onLogin, 
  onLogout, 
  isAdmin, 
  onNavigate,
  currentPage 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="bg-black dark:bg-white p-2 rounded-lg">
            <Car className="text-white dark:text-black w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight dark:text-white">VELOCITY</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
          >
            Fleet
          </button>
          {user && (
            <>
              <button 
                onClick={() => onNavigate('bookings')}
                className={`text-sm font-medium transition-colors ${currentPage === 'bookings' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
              >
                My Bookings
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className={`text-sm font-medium transition-colors ${currentPage === 'profile' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
              >
                Profile
              </button>
            </>
          )}
          {isAdmin && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`text-sm font-medium transition-colors ${currentPage === 'admin' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
            >
              Admin
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black/60 dark:text-white/60"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <User className="w-4 h-4 text-black/40 dark:text-white/40" />
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:inline dark:text-white">{userProfile?.displayName || user.displayName}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-black/60 dark:text-white/60" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-black/90 dark:hover:bg-white/90 transition-all active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
