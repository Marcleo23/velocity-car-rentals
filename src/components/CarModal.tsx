import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Car as CarIcon, Image as ImageIcon, DollarSign, Settings, Users, Fuel, Upload } from 'lucide-react';
import { Car, CarStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CarModalProps {
  car?: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: Omit<Car, 'id'> | Car) => Promise<void>;
}

export const CarModal: React.FC<CarModalProps> = ({ car, isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Omit<Car, 'id'>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Luxury',
    pricePerDay: 0,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 4,
    imageUrl: '',
    status: CarStatus.AVAILABLE,
    description: '',
    features: []
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (car) {
      setFormData({ ...car });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Luxury',
        pricePerDay: 0,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: 4,
        imageUrl: '',
        status: CarStatus.AVAILABLE,
        description: '',
        features: []
      });
    }
  }, [car, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(car ? { ...formData, id: car.id } as Car : formData);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        alert('Image is too large. Please select an image smaller than 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-black rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-black/5 dark:border-white/5"
        >
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-black dark:bg-white p-2 rounded-xl">
                <CarIcon className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold dark:text-white">{car ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Fleet Management</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Make</label>
                  <input 
                    required
                    type="text" 
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g. Porsche"
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Model</label>
                  <input 
                    required
                    type="text" 
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. 911 Carrera"
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Year</label>
                  <input 
                    required
                    type="number" 
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none appearance-none dark:text-white dark:bg-black"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Sport">Sport</option>
                    <option value="Electric">Electric</option>
                    <option value="SUV">SUV</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Technical Specs */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1 flex items-center gap-1">
                    <Settings className="w-3 h-3" /> Transmission
                  </label>
                  <select 
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white dark:bg-black"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1 flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> Fuel Type
                  </label>
                  <select 
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white dark:bg-black"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Seats
                  </label>
                  <input 
                    type="number" 
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Media */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Pricing & Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Price Per Day
                  </label>
                  <input 
                    required
                    type="number" 
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Image Source
                  </label>
                  <div className="flex gap-2">
                    <input 
                      required
                      type="text" 
                      value={formData.imageUrl.startsWith('data:') ? 'Local Image Selected' : formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      disabled={formData.imageUrl.startsWith('data:')}
                      className="flex-1 px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none disabled:opacity-50 dark:text-white"
                    />
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-colors"
                      title="Upload from device"
                    >
                      <Upload className="w-5 h-5 text-black/60 dark:text-white/60" />
                    </button>
                    {formData.imageUrl.startsWith('data:') && (
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="p-3 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors"
                        title="Clear local image"
                      >
                        <X className="w-5 h-5 text-rose-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {formData.imageUrl && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 aspect-video bg-black/5 dark:bg-white/5 relative group">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">Image Preview</p>
                  </div>
                </div>
              )}
            </section>

            {/* Description & Features */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Details & Features</h3>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the vehicle..."
                  className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none resize-none dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 px-1">Features</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-2 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 outline-none dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-xs font-medium dark:text-white"
                    >
                      {feature}
                      <button 
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </form>

          <div className="p-6 border-t border-black/5 dark:border-white/5 bg-white dark:bg-black sticky bottom-0 z-10">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {car ? 'Update Vehicle' : 'Save Vehicle'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
