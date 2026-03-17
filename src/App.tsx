import React, { useState, useEffect, Component } from 'react';
import { 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { Car, Booking, UserProfile, CarStatus, BookingStatus } from './types';
import { Navbar } from './components/Navbar';
import { CarCard } from './components/CarCard';
import { BookingModal } from './components/BookingModal';
import { MyBookings } from './components/MyBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        if (firebaseUser) {
          // Fetch or create user profile
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              username: firebaseUser.email?.split('@')[0] || 'user',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || undefined,
              role: firebaseUser.email === 'leom57583@gmail.com' ? 'admin' : 'user'
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile(null);
        }
      } catch (err: any) {
        console.error('Auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fleet Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
      setCars(carsData);
      
      // Seed initial data if empty
      if (carsData.length === 0 && userProfile?.role === 'admin') {
        seedInitialData();
      }
    }, (err) => {
      console.error('Fleet error:', err);
      setError(err.message);
    });
    return () => unsubscribe();
  }, [userProfile]);

  // Bookings Listener
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    let q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    if (userProfile?.role === 'admin') {
      q = query(collection(db, 'bookings'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bookingsData);
    }, (err) => {
      console.error('Bookings error:', err);
      setError(err.message);
    });
    return () => unsubscribe();
  }, [user, userProfile]);

  // Users Listener (Super Admin only)
  useEffect(() => {
    if (userProfile?.role !== 'admin' || userProfile?.email !== 'leom57583@gmail.com') {
      setAllUsers([]);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
      setAllUsers(usersData);
    }, (err) => {
      console.error('Users error:', err);
      setError(err.message);
    });
    return () => unsubscribe();
  }, [userProfile]);

  const seedInitialData = async () => {
    try {
      const initialCars: Omit<Car, 'id'>[] = [
        {
          make: 'Porsche',
          model: '911 Carrera',
          year: 2024,
          category: 'Luxury',
          pricePerDay: 450,
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 4,
          imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000',
          status: CarStatus.AVAILABLE,
          description: 'The ultimate driving machine.',
          features: ['Sport Mode', 'Bose Sound System', 'Leather Interior']
        },
        {
          make: 'Tesla',
          model: 'Model S Plaid',
          year: 2023,
          category: 'Electric',
          pricePerDay: 350,
          transmission: 'Automatic',
          fuelType: 'Electric',
          seats: 5,
          imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
          status: CarStatus.AVAILABLE,
          description: 'Beyond fast.',
          features: ['Autopilot', 'Ludicrous Mode', 'Panoramic Roof']
        },
        {
          make: 'Range Rover',
          model: 'Sport SVR',
          year: 2024,
          category: 'SUV',
          pricePerDay: 380,
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          imageUrl: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=1000',
          status: CarStatus.AVAILABLE,
          description: 'Luxury meets off-road capability.',
          features: ['Air Suspension', 'Meridian Audio', 'Heated Seats']
        }
      ];

      for (const car of initialCars) {
        await addDoc(collection(db, 'cars'), car);
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (err: any) {
      console.error('Logout failed:', err);
      setError(err.message);
    }
  };

  const handleBookCar = (car: Car) => {
    if (!user) {
      handleLogin();
      return;
    }
    setSelectedCar(car);
  };

  const confirmBooking = async (data: { startDate: string; endDate: string; totalPrice: number }) => {
    if (!selectedCar || !user) return;

    try {
      const bookingData = {
        carId: selectedCar.id,
        userId: user.uid,
        userEmail: user.email,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        status: BookingStatus.PENDING,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      await updateDoc(doc(db, 'cars', selectedCar.id), { status: CarStatus.RENTED });
      
      setSelectedCar(null);
      setCurrentPage('bookings');
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (err: any) {
      console.error('Update booking error:', err);
      setError(err.message);
    }
  };

  const updateUserRole = async (uid: string, role: 'user' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', uid), { role });
    } catch (err: any) {
      console.error('Update user role error:', err);
      setError(err.message);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message);
    }
  };

  const addCar = async (carData: Omit<Car, 'id'>) => {
    try {
      await addDoc(collection(db, 'cars'), carData);
    } catch (err: any) {
      console.error('Add car error:', err);
      setError(err.message);
    }
  };

  const updateCar = async (id: string, updates: Partial<Car>) => {
    try {
      await updateDoc(doc(db, 'cars', id), updates);
    } catch (err: any) {
      console.error('Update car error:', err);
      setError(err.message);
    }
  };

  const deleteCar = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cars', id));
    } catch (err: any) {
      console.error('Delete car error:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-black/20 dark:text-white/20" />
      </div>
    );
  }

  if (error) {
    let displayMessage = "Something went wrong.";
    try {
      if (error.includes("insufficient permissions")) {
        displayMessage = "You don't have permission to perform this action.";
      } else {
        displayMessage = error;
      }
    } catch (e) {
      displayMessage = error;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 dark:bg-rose-950/20 p-6 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-black p-8 rounded-[32px] shadow-xl text-center border border-black/5 dark:border-white/5">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 dark:text-white">Application Error</h2>
          <p className="text-black/60 dark:text-white/60 text-sm mb-6">{displayMessage}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all active:scale-95"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] text-black dark:text-white font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-300">
      <Navbar 
        user={user} 
        userProfile={userProfile}
        onLogin={handleLogin} 
        onLogout={handleLogout}
        isAdmin={userProfile?.role === 'admin'}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />

      <main className="pt-24 pb-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6"
            >
              <div className="mb-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[0.9] dark:text-white">
                  Drive the <br />
                  <span className="text-black/20 dark:text-white/20 italic">Extraordinary.</span>
                </h1>
                <p className="text-lg text-black/40 dark:text-white/40 font-medium max-w-xl">
                  Experience premium mobility with our curated fleet of luxury, performance, and electric vehicles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map(car => (
                  <CarCard key={car.id} car={car} onBook={handleBookCar} />
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'bookings' && (
            <motion.div 
              key="bookings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MyBookings 
                bookings={bookings.map(b => ({
                  ...b,
                  car: cars.find(c => c.id === b.carId)
                }))} 
              />
            </motion.div>
          )}

          {currentPage === 'admin' && userProfile?.role === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AdminDashboard 
                cars={cars}
                bookings={bookings.map(b => ({
                  ...b,
                  car: cars.find(c => c.id === b.carId),
                  userEmail: (b as any).userEmail
                }))}
                users={allUsers}
                onAddCar={addCar}
                onUpdateCar={updateCar}
                onDeleteCar={deleteCar}
                onUpdateBookingStatus={updateBookingStatus}
                onUpdateUserRole={updateUserRole}
              />
            </motion.div>
          )}

          {currentPage === 'profile' && userProfile && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Profile 
                profile={userProfile} 
                onUpdate={updateProfile} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BookingModal 
        car={selectedCar} 
        onClose={() => setSelectedCar(null)}
        onConfirm={confirmBooking}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
