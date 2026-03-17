import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Booking, Car, BookingStatus } from '../types';

interface MyBookingsProps {
  bookings: (Booking & { car?: Car })[];
}

export const MyBookings: React.FC<MyBookingsProps> = ({ bookings }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'bg-emerald-500';
      case BookingStatus.PENDING: return 'bg-amber-500';
      case BookingStatus.CANCELLED: return 'bg-rose-500';
      case BookingStatus.COMPLETED: return 'bg-blue-500';
      default: return 'bg-black/40';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return <CheckCircle2 className="w-3 h-3" />;
      case BookingStatus.CANCELLED: return <XCircle className="w-3 h-3" />;
      case BookingStatus.PENDING: return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2 dark:text-white">My Bookings</h1>
        <p className="text-black/40 dark:text-white/40 font-medium">Manage your current and past rentals</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-[32px] border border-dashed border-black/10 dark:border-white/10">
            <p className="text-black/40 dark:text-white/40 font-medium">No bookings found yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="group bg-white dark:bg-black p-6 rounded-[32px] border border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5">
              <div className="w-full md:w-48 aspect-[16/10] bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden">
                {booking.car && (
                  <img src={booking.car.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold dark:text-white">{booking.car?.make} {booking.car?.model}</h3>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-black/20 dark:text-white/20 uppercase tracking-widest">Pickup</span>
                    <div className="flex items-center gap-2 text-sm font-medium dark:text-white/80">
                      <Calendar className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                      {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-black/20 dark:text-white/20 uppercase tracking-widest">Return</span>
                    <div className="flex items-center gap-2 text-sm font-medium dark:text-white/80">
                      <Calendar className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                      {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-black/20 dark:text-white/20 uppercase tracking-widest">Total</span>
                    <div className="text-sm font-bold dark:text-white">${booking.totalPrice}</div>
                  </div>
                </div>
              </div>

              <button className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
