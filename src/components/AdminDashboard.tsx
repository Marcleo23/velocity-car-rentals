import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Car as CarIcon, Users, Calendar } from 'lucide-react';
import { Car, Booking, CarStatus, UserProfile } from '../types';
import { CarModal } from './CarModal';

interface AdminDashboardProps {
  cars: Car[];
  bookings: (Booking & { car?: Car; userEmail?: string })[];
  users?: UserProfile[];
  onAddCar: (car: Omit<Car, 'id'>) => void;
  onUpdateCar: (id: string, updates: Partial<Car>) => void;
  onDeleteCar: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: string) => void;
  onUpdateUserRole?: (uid: string, role: 'user' | 'admin') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  cars, 
  bookings, 
  users = [],
  onAddCar, 
  onUpdateCar, 
  onDeleteCar,
  onUpdateBookingStatus,
  onUpdateUserRole
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'bookings' | 'users'>('fleet');
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsCarModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (carData: Omit<Car, 'id'> | Car) => {
    if ('id' in carData) {
      const { id, ...updates } = carData;
      await onUpdateCar(id, updates);
    } else {
      await onAddCar(carData);
    }
    setIsCarModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 dark:text-white">Management Console</h1>
          <p className="text-black/40 dark:text-white/40 font-medium">Control your fleet and monitor active rentals</p>
        </div>
        
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'fleet' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
          >
            Fleet
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'bookings' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
          >
            Bookings
          </button>
          {users.length > 0 && (
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
            >
              Users
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-black p-6 rounded-[32px] border border-black/5 dark:border-white/5 flex items-center gap-4">
          <div className="bg-blue-500/10 p-4 rounded-2xl">
            <CarIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold dark:text-white">{cars.length}</div>
            <div className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Total Vehicles</div>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-6 rounded-[32px] border border-black/5 dark:border-white/5 flex items-center gap-4">
          <div className="bg-emerald-500/10 p-4 rounded-2xl">
            <Calendar className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold dark:text-white">{bookings.length}</div>
            <div className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Total Bookings</div>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-6 rounded-[32px] border border-black/5 dark:border-white/5 flex items-center gap-4">
          <div className="bg-amber-500/10 p-4 rounded-2xl">
            <Users className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-bold dark:text-white">{new Set(bookings.map(b => b.userId)).size}</div>
            <div className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Active Customers</div>
          </div>
        </div>
      </div>

      {activeTab === 'fleet' ? (
        <div className="bg-white dark:bg-black rounded-[32px] border border-black/5 dark:border-white/5 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
              <input 
                type="text" 
                placeholder="Search fleet..." 
                className="w-full pl-11 pr-4 py-2 bg-black/5 dark:bg-white/5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 dark:text-white"
              />
            </div>
            <button 
              onClick={handleAddCar}
              className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-black/90 dark:hover:bg-white/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Vehicle</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Price/Day</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={car.imageUrl} alt="" className="w-12 h-8 object-cover rounded-lg bg-black/5 dark:bg-white/5" referrerPolicy="no-referrer" />
                        <div>
                          <div className="font-bold text-sm dark:text-white">{car.make} {car.model}</div>
                          <div className="text-[10px] text-black/40 dark:text-white/40 font-medium">{car.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-black/60 dark:text-white/60">{car.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        car.status === CarStatus.AVAILABLE ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm dark:text-white">${car.pricePerDay}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditCar(car)}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                        </button>
                        <button onClick={() => onDeleteCar(car.id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'bookings' ? (
        <div className="bg-white dark:bg-black rounded-[32px] border border-black/5 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Vehicle</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Period</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold dark:text-white">{booking.userEmail}</div>
                      <div className="text-[10px] text-black/40 dark:text-white/40 font-medium">ID: {booking.userId.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold dark:text-white">{booking.car?.make} {booking.car?.model}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-bold text-black/60 dark:text-white/60">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={booking.status}
                        onChange={(e) => onUpdateBookingStatus(booking.id, e.target.value)}
                        className="text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 dark:text-white dark:bg-black"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-sm dark:text-white">${booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-black rounded-[32px] border border-black/5 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                            <Users className="w-4 h-4 text-black/20 dark:text-white/20" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold dark:text-white">{user.displayName}</div>
                          <div className="text-[10px] text-black/40 dark:text-white/40 font-medium">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black/60 dark:text-white/60">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.email !== 'leom57583@gmail.com' && (
                        <select 
                          value={user.role}
                          onChange={(e) => onUpdateUserRole?.(user.uid, e.target.value as 'user' | 'admin')}
                          className="text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 dark:text-white dark:bg-black"
                        >
                          <option value="user">Make User</option>
                          <option value="admin">Make Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CarModal 
        isOpen={isCarModalOpen}
        car={selectedCar}
        onClose={() => setIsCarModalOpen(false)}
        onSave={handleSaveCar}
      />
    </div>
  );
};
