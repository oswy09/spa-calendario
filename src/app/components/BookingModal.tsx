import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, ChevronRight, CheckCircle2, User, Phone, Mail, ChevronLeft } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

const SERVICES: Service[] = [
  { id: '1', name: 'Estética Facial Premium', price: 120000, duration: '60 min' },
  { id: '2', name: 'Tratamiento Reductor', price: 150000, duration: '90 min' },
  { id: '3', name: 'Limpieza Facial Profunda', price: 85000, duration: '45 min' },
  { id: '4', name: 'Rejuvenecimiento Láser', price: 250000, duration: '60 min' },
  { id: '5', name: 'Post Operatorio (Sesión)', price: 95000, duration: '50 min' },
  { id: '6', name: 'Depilación Cera Completa', price: 70000, duration: '40 min' },
  { id: '7', name: 'Extensión de Pestañas', price: 110000, duration: '120 min' },
  { id: '8', name: 'Masaje Relajante Femme', price: 130000, duration: '60 min' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Reserva solicitada con éxito! Te contactaremos pronto.');
    onClose();
    setTimeout(() => {
        setStep(1);
        setSelectedService(null);
        setSelectedDate(undefined);
        setSelectedTime(null);
    }, 500);
  };

  const stepsInfo = [
    { label: 'Servicio', icon: <Sparkles size={12} /> },
    { label: 'Fecha', icon: <CalendarIcon size={12} /> },
    { label: 'Datos', icon: <User size={12} /> },
    { label: 'Confirmar', icon: <CheckCircle2 size={12} /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-fuchsia-950/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(112,26,117,0.3)] flex flex-col max-h-[92vh] sm:max-h-[95vh]"
      >
        {/* Header Section */}
        <div className="relative pt-6 sm:pt-10 pb-4 sm:pb-6 px-6 sm:px-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-fuchsia-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-serif text-fuchsia-950 leading-tight">Agendar Bienestar</h2>
                <p className="text-fuchsia-600 font-medium text-xs sm:text-sm">En Femme Naturelle</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-50 hover:bg-fuchsia-50 rounded-xl sm:rounded-2xl transition-all text-gray-400 hover:text-fuchsia-600">
              <X size={20} sm:size={24} />
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="space-y-3">
            <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-linear-to-r from-fuchsia-400 to-purple-600 rounded-full"
              />
            </div>
            <div className="flex justify-between">
              {stepsInfo.map((s, idx) => (
                <div key={idx} className={`flex flex-col items-center gap-1 transition-colors ${step >= idx + 1 ? 'text-fuchsia-600 font-black' : 'text-gray-300 font-medium'}`}>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-tighter sm:tracking-widest hidden xs:block">{s.label}</span>
                    <div className={`w-1 h-1 rounded-full ${step >= idx + 1 ? 'bg-fuchsia-600' : 'bg-gray-200'} xs:hidden`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 bg-gray-50/30">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center mb-6 sm:mb-10">
                    <h3 className="text-lg sm:text-2xl font-serif text-gray-900 italic">¿Qué tratamiento deseas disfrutar hoy?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`group p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border-2 transition-all flex justify-between items-start text-left bg-white ${
                        selectedService?.id === service.id 
                          ? 'border-fuchsia-500 shadow-xl shadow-fuchsia-100 ring-4 ring-fuchsia-50/50' 
                          : 'border-white hover:border-fuchsia-100 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedService?.id === service.id ? 'bg-fuchsia-600 text-white' : 'bg-fuchsia-50 text-fuchsia-400'}`}>
                                <CheckCircle2 size={14} sm:size={16} />
                            </div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-fuchsia-700 transition-colors line-clamp-1">{service.name}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 ml-8 sm:ml-11">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{service.duration}</span>
                        </div>
                      </div>
                      <p className="text-base sm:text-lg font-black text-fuchsia-600 ml-2">${service.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-12 items-stretch">
                  <div className="flex-1 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-fuchsia-50">
                    <h3 className="text-lg sm:text-xl font-bold text-fuchsia-950 mb-4 sm:mb-6 flex items-center gap-3">
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-500" /> Selecciona la Fecha
                    </h3>
                    <div className="flex justify-center calendar-responsive">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={es}
                        disabled={{ before: new Date() }}
                        modifiersStyles={{
                            selected: { backgroundColor: '#c026d3', color: 'white', borderRadius: '12px', fontWeight: 'bold' },
                            today: { color: '#c026d3', fontWeight: 'black', textDecoration: 'underline' }
                        }}
                        className="border-none p-0 w-full flex justify-center"
                        styles={{
                            head_cell: { color: '#a21caf', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.05em' },
                            cell: { padding: '2px' },
                            day: { width: '40px', height: '40px', sm: '48px', sm_height: '48px', fontSize: '0.875rem', borderRadius: '10px' },
                            nav_button_previous: { color: '#c026d3' },
                            nav_button_next: { color: '#c026d3' }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="bg-fuchsia-600 p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-xl text-white flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Horarios Disponibles
                        </h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {TIME_SLOTS.map((time) => (
                            <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 sm:py-4 px-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all border-2 ${
                                selectedTime === time 
                                ? 'bg-white text-fuchsia-700 border-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] scale-105' 
                                : 'bg-fuchsia-500/30 border-fuchsia-400/30 hover:bg-fuchsia-400/50 text-white'
                            }`}
                            >
                            {time}
                            </button>
                        ))}
                        </div>
                        {selectedDate && selectedTime && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-fuchsia-400/30 text-center">
                                <p className="text-fuchsia-100 text-[10px] sm:text-xs font-medium uppercase tracking-widest mb-1">Tu cita sería el:</p>
                                <p className="text-lg sm:text-xl font-serif italic leading-tight capitalize">{format(selectedDate, 'EEEE, d MMMM', { locale: es })}</p>
                                <p className="text-base sm:text-lg font-black mt-1">{selectedTime}</p>
                            </motion.div>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-6 sm:space-y-8"
              >
                <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-fuchsia-100 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 sm:mb-6 rotate-12 shrink-0">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-600 -rotate-12" />
                    </div>
                    <h3 className="text-xl sm:text-3xl font-serif text-gray-900 mb-1 sm:mb-2 italic">Información Personal</h3>
                    <p className="text-sm text-gray-500">Para enviarte el recordatorio de tu cita</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] font-black text-fuchsia-800 uppercase tracking-widest ml-4">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-300" />
                        <input
                            type="text"
                            required
                            className="w-full pl-12 sm:pl-16 pr-6 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-fuchsia-50 focus:border-fuchsia-400 focus:shadow-xl focus:shadow-fuchsia-100 outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Carolina Herrera"
                        />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] font-black text-fuchsia-800 uppercase tracking-widest ml-4">Teléfono WhatsApp</label>
                    <div className="relative">
                        <Phone className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-300" />
                        <input
                            type="tel"
                            required
                            className="w-full pl-12 sm:pl-16 pr-6 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-fuchsia-50 focus:border-fuchsia-400 focus:shadow-xl focus:shadow-fuchsia-100 outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="321 000 0000"
                        />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] font-black text-fuchsia-800 uppercase tracking-widest ml-4">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-300" />
                        <input
                            type="email"
                            className="w-full pl-12 sm:pl-16 pr-6 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-fuchsia-50 focus:border-fuchsia-400 focus:shadow-xl focus:shadow-fuchsia-100 outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="tu@correo.com"
                        />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto space-y-6 sm:space-y-8"
              >
                <div className="bg-linear-to-br from-fuchsia-600 to-purple-800 p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 italic leading-tight">¡Resumen de tu Cita!</h3>
                        
                        <div className="space-y-3 sm:space-y-4 text-base sm:text-lg">
                            <div className="flex justify-between items-start py-3 border-b border-white/10 gap-4">
                                <span className="opacity-70 font-medium text-sm sm:text-base shrink-0">Tratamiento</span>
                                <span className="font-black text-right text-sm sm:text-lg">{selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="opacity-70 font-medium text-sm sm:text-base">Día</span>
                                <span className="font-black text-sm sm:text-lg">{selectedDate ? format(selectedDate, 'PPP', { locale: es }) : ''}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="opacity-70 font-medium text-sm sm:text-base">Hora</span>
                                <span className="font-black text-sm sm:text-lg">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg sm:text-xl font-serif">Inversión</span>
                                <span className="text-2xl sm:text-3xl font-black">${selectedService?.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Recibirás un WhatsApp para validar tu reserva.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-10 bg-white border-t border-gray-100 flex justify-between items-center gap-4">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 sm:px-10 py-3 sm:py-4 text-fuchsia-600 font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-fuchsia-50 rounded-xl sm:rounded-2xl transition-all flex items-center gap-2"
            >
              <ChevronLeft size={14} sm:size={16} /> <span className="hidden xs:inline">Volver</span>
            </button>
          ) : (
            <div className="w-1/4" />
          )}
          
          <button
            disabled={(step === 1 && !selectedService) || (step === 2 && (!selectedDate || !selectedTime)) || (step === 3 && (!formData.name || !formData.phone))}
            onClick={step < 4 ? handleNext : handleSubmit}
            className={`flex-1 sm:flex-none sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-[2rem] font-black text-sm sm:text-lg transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed ${
                step === 4 
                ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-fuchsia-200' 
                : 'bg-fuchsia-950 text-white hover:bg-black shadow-gray-200'
            }`}
          >
            {step === 4 ? 'Confirmar Cita' : 'Siguiente'} 
            {step < 4 && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper component for progress dots on mobile
function Sparkles({ size }: { size: number }) {
  return <div className="w-1 h-1 bg-current rounded-full" style={{ width: size, height: size }} />;
}
