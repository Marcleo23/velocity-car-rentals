import React from 'react';
import { Car, Fuel, Gauge, Users, ArrowRight } from 'lucide-react';
import { Car as CarType, CarStatus } from '../types';

interface CarCardProps {
  car: CarType;
  onBook: (car: CarType) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  const isAvailable = car.status === CarStatus.AVAILABLE;

  return (
    <div className="group bg-white dark:bg-black rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden transition-all hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img 
          src={car.imageUrl} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isAvailable ? 'bg-emerald-500 text-white' : 'bg-black/40 text-white backdrop-blur-md'
          }`}>
            {car.status}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 dark:border-white/5">
          <span className="text-sm font-bold dark:text-white">${car.pricePerDay}</span>
          <span className="text-[10px] text-black/40 dark:text-white/40 font-medium ml-1">/ day</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-black dark:text-white leading-tight">{car.make} {car.model}</h3>
          <p className="text-sm text-black/40 dark:text-white/40 font-medium">{car.category} • {car.year}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-4 h-4 text-black/20 dark:text-white/20" />
            <span className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-black/5 dark:border-white/5">
            <Gauge className="w-4 h-4 text-black/20 dark:text-white/20" />
            <span className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-4 h-4 text-black/20 dark:text-white/20" />
            <span className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase">{car.seats} Seats</span>
          </div>
        </div>

        <button 
          onClick={() => onBook(car)}
          disabled={!isAvailable}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
            isAvailable 
              ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 active:scale-[0.98]' 
              : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 cursor-not-allowed'
          }`}
        >
          {isAvailable ? (
            <>
              Book Now
              <ArrowRight className="w-4 h-4" />
            </>
          ) : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
};
