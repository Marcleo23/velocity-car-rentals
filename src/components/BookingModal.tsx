import React, { useState } from 'react';
import { X, Calendar, CreditCard, Info } from 'lucide-react';
import { Car } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
  onConfirm: (bookingData: { startDate: string; endDate: string; totalPrice: number }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ car, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!car) return null;

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * car.pricePerDay;
  };

  const totalPrice = calculateTotal();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-black rounded-[32px] shadow-2xl overflow-hidden border border-black/5 dark:border-white/5"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white">Book Your Ride</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-2xl mb-8">
              <img src={car.imageUrl} alt="" className="w-20 h-12 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-sm dark:text-white">{car.make} {car.model}</h3>
                <p className="text-xs text-black/40 dark:text-white/40 font-medium">${car.pricePerDay} / day</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white dark:bg-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white dark:bg-black"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium opacity-60">Total Amount</span>
                  <span className="text-2xl font-bold">${totalPrice}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium opacity-40 uppercase tracking-widest">
                  <Info className="w-3 h-3" />
                  Includes all taxes and fees
                </div>
              </div>

              <button 
                onClick={() => onConfirm({ startDate, endDate, totalPrice })}
                disabled={!startDate || !endDate || totalPrice <= 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-4 h-4" />
                Confirm Booking
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
