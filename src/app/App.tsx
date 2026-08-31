import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Star, 
  Check, 
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Toaster } from 'sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { BookingModal } from './components/BookingModal';

const SERVICES_LIST = [
  {
    title: 'Estética Facial',
    description: 'Limpieza profunda, rejuvenecimiento y tratamientos personalizados para el cuidado de tu piel con tecnología avanzada.',
    image: 'https://images.unsplash.com/photo-1761718210055-e83ca7e2c9ad?q=80&w=1080',
    price: 'Desde $85.000'
  },
  {
    title: 'Corporal y Reductores',
    description: 'Tratamientos corporales especializados para moldear tu figura y reducir medidas de forma efectiva y segura.',
    image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?q=80&w=1080',
    price: 'Desde $150.000'
  },
  {
    title: 'Post Operatorio',
    description: 'Cuidados especializados y drenajes linfáticos para una recuperación óptima después de tu cirugía estética.',
    image: 'https://fisiogracia.com/wp-content/uploads/2024/09/Masajes-Post-Operativos_web-1200x800.jpg',
    price: 'Desde $95.000'
  },
  {
    title: 'Depilación y Pestañas',
    description: 'Realza tu mirada con extensiones de pestañas técnica clásica o volumen, y depilación profesional con cera.',
    image: 'https://images.unsplash.com/photo-1718720410628-6aa1b860ea78?q=80&w=1080',
    price: 'Desde $70.000'
  }
];

const REVIEWS = [
  {
    name: 'Carolina Ruiz',
    rating: 5,
    text: 'La mejor atención en Bogotá. El tratamiento reductor dio resultados desde la primera sesión. ¡Súper recomendado!',
    date: 'Hace 1 mes',
    avatar: 'CR'
  },
  {
    name: 'Andrés Morales',
    rating: 5,
    text: 'Fui por una limpieza facial y salí como nuevo. El local es impecable y la atención es de primera clase.',
    date: 'Hace 2 semanas',
    avatar: 'AM'
  },
  {
    name: 'Valentina Gómez',
    rating: 5,
    text: 'Mis pestañas quedaron hermosas y muy naturales. El spa Femme Naturelle realmente irradia bienestar y serenidad.',
    date: 'Hace 3 días',
    avatar: 'VG'
  }
];

// Verified high-quality avatar images
const CLIENT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80'
];

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleBooking = () => setIsBookingOpen(!isBookingOpen);

  return (
    <div className="min-h-screen bg-[#faf8f9] text-gray-900 font-sans selection:bg-fuchsia-100 selection:text-fuchsia-900 pb-20 md:pb-0 antialiased">
      <Toaster position="top-right" />
      
      {/* Navigation Bar with Larger Header Logo Title */}
      <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-fuchsia-100/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            
            {/* Header Title - Made visibly larger and bolder */}
            <a href="#" className="flex flex-col group focus:outline-none py-1">
              <span className="text-3xl sm:text-4xl lg:text-[2.65rem] font-serif font-normal text-fuchsia-950 tracking-tight leading-none group-hover:text-fuchsia-800 transition-colors">
                Femme <span className="italic font-light text-fuchsia-700">Naturelle</span>
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-fuchsia-600/85 font-semibold mt-1.5">
                Estética & Bienestar
              </span>
            </a>
            
            {/* Desktop Navigation Links - Title Case (No Uppercase) */}
            <div className="hidden md:flex items-center gap-9">
              <a href="#servicios" className="text-gray-700 hover:text-fuchsia-700 transition-colors text-sm font-medium">
                Servicios
              </a>
              <a href="#experiencia" className="text-gray-700 hover:text-fuchsia-700 transition-colors text-sm font-medium">
                Experiencia
              </a>
              <a href="#testimonios" className="text-gray-700 hover:text-fuchsia-700 transition-colors text-sm font-medium">
                Testimonios
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-fuchsia-700 transition-colors text-sm font-medium">
                Contacto
              </a>
              <button 
                onClick={toggleBooking}
                className="bg-fuchsia-600 text-white text-sm font-medium px-7 py-3 rounded-full hover:bg-fuchsia-700 transition-all shadow-sm hover:shadow-md hover:shadow-fuchsia-200 active:scale-95 cursor-pointer"
              >
                Reservar cita
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2.5 text-fuchsia-950 hover:bg-fuchsia-50 rounded-xl transition-colors focus:outline-none" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="md:hidden bg-white border-b border-fuchsia-100 px-6 py-6 space-y-4 shadow-xl"
          >
            <a 
              href="#servicios" 
              className="block text-gray-800 hover:text-fuchsia-700 text-base font-medium py-1" 
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </a>
            <a 
              href="#experiencia" 
              className="block text-gray-800 hover:text-fuchsia-700 text-base font-medium py-1" 
              onClick={() => setIsMenuOpen(false)}
            >
              Experiencia
            </a>
            <a 
              href="#testimonios" 
              className="block text-gray-800 hover:text-fuchsia-700 text-base font-medium py-1" 
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonios
            </a>
            <a 
              href="#contacto" 
              className="block text-gray-800 hover:text-fuchsia-700 text-base font-medium py-1" 
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>
            <button 
              onClick={() => { toggleBooking(); setIsMenuOpen(false); }}
              className="w-full bg-fuchsia-600 text-white py-3.5 rounded-xl font-medium text-sm shadow-md cursor-pointer"
            >
              Reservar cita
            </button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section - Background image with smooth gradient fading to full clarity on the right */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 lg:pt-28 overflow-hidden">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1688213156669-42aca74e8940?q=80&w=2000" 
            alt="Femme Naturelle Spa Experience" 
            className="w-full h-full object-cover object-right-top sm:object-right"
          />
          {/* Smooth gradient: opaque on left for clear text, completely transparent on the right so the image is fully visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f9] via-[#faf8f9]/80 via-40% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f9]/50 via-transparent to-[#faf8f9]/30 sm:hidden" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl lg:max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Minimalist Subtitle */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-fuchsia-200/80 mb-6 backdrop-blur-md shadow-xs">
                <Sparkles size={13} className="text-fuchsia-600" />
                <span className="text-fuchsia-900 font-semibold text-xs tracking-wide">
                  Estética avanzada & bienestar en Bogotá
                </span>
              </div>
              
              {/* Clean Editorial Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-[4.75rem] font-serif text-fuchsia-950 font-normal leading-[1.04] mb-6">
                Belleza que <br />
                <span className="italic font-light text-fuchsia-700">nace del interior.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-700 max-w-lg mb-8 leading-relaxed font-normal">
                Descubre <b>Femme Naturelle</b>, tu santuario de armonía y cuidado personal. Tratamientos especializados en rejuvenecimiento facial, cuidado corporal y post-operatorios.
              </p>
              
              {/* CTAs & Real Visible Happy Client Photos */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                <button 
                  onClick={toggleBooking}
                  className="px-8 py-4 bg-fuchsia-600 text-white rounded-full font-medium text-base hover:bg-fuchsia-700 hover:shadow-lg hover:shadow-fuchsia-200 transition-all flex items-center justify-center gap-2.5 active:scale-95 group cursor-pointer"
                >
                  <span>Agendar cita</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Social Proof with working real images: '+ de 200 clientes felices' */}
                <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-full border border-fuchsia-100 shadow-sm">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {CLIENT_AVATARS.map((avatarUrl, i) => (
                      <img 
                        key={i}
                        src={avatarUrl} 
                        alt={`Cliente feliz ${i + 1}`} 
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                        loading="eager"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-fuchsia-950">
                      + de 200 clientes felices
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Experience Section */}
      <section id="experiencia" className="py-20 bg-white border-y border-fuchsia-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Visual Image */}
            <div className="relative">
              <div className="aspect-[4/4.5] rounded-3xl overflow-hidden shadow-lg border border-fuchsia-100/80 relative z-10">
                <ImageWithFallback 
                  src="https://fisiogracia.com/wp-content/uploads/2024/09/Masajes-Post-Operativos_web.jpg" 
                  alt="Procedimiento estético en Femme Naturelle" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-md border border-fuchsia-100 hidden sm:flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Protocolos Certificados</p>
                  <p className="text-[11px] text-gray-500">Tecnología estética de vanguardia</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-fuchsia-600 font-semibold">
                  Cuidado integral & personalizado
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-fuchsia-950 mt-2 font-normal">
                  Procedimientos que transforman y cuidan tu piel
                </h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-base font-normal">
                En <b>Femme Naturelle</b> combinamos aparatología de vanguardia con técnicas manuales especializadas para ofrecer resultados visibles desde la primera sesión, siempre priorizando la salud y naturalidad de tu piel.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Limpieza facial profunda',
                  'Peeling regenerador',
                  'Tratamientos anti-edad',
                  'Drenaje post-quirúrgico',
                  'Moldeo corporal y reductor',
                  'Diseño de cejas y pestañas'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 bg-[#faf8f9] p-3 rounded-xl border border-fuchsia-100/50">
                    <div className="w-5 h-5 rounded-full bg-fuchsia-100 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-fuchsia-700" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={toggleBooking} 
                  className="text-fuchsia-700 hover:text-fuchsia-900 font-medium text-sm inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
                >
                  <span>Agendar una valoración personalizada</span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="servicios" className="py-20 bg-[#faf8f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-fuchsia-600 font-semibold block mb-2">
              Nuestros Tratamientos
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-fuchsia-950 font-normal">
              Colección de bienestar & estética
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Selecciona el tratamiento que deseas y permítenos brindarte una experiencia renovadora.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_LIST.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-fuchsia-100/80 shadow-xs hover:shadow-md hover:border-fuchsia-200 transition-all duration-300 flex flex-col group"
              >
                <div className="h-52 overflow-hidden relative">
                  <ImageWithFallback 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-medium text-fuchsia-900 border border-fuchsia-100">
                    Tratamiento
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-serif text-fuchsia-950 mb-2 font-medium">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-5 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-fuchsia-700 font-semibold text-sm">
                      {service.price}
                    </span>
                    <button 
                      onClick={toggleBooking}
                      className="px-3.5 py-1.5 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-600 hover:text-white rounded-full text-xs font-medium transition-all cursor-pointer"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 bg-white border-y border-fuchsia-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-fuchsia-600 font-semibold block mb-2">
                Opiniones Reales
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-fuchsia-950 font-normal">
                Experiencias Femme Naturelle
              </h2>
            </div>
            
            {/* Rating summary badge */}
            <div className="inline-flex items-center gap-3 bg-[#faf8f9] px-4 py-2 rounded-xl border border-fuchsia-100">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-fuchsia-950">
                4.9 / 5 en Google Reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, index) => (
              <div 
                key={index} 
                className="bg-[#faf8f9] p-6 rounded-2xl border border-fuchsia-100/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-fuchsia-700 font-medium text-xs border border-fuchsia-100 shadow-xs">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                        <span className="text-[11px] text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic font-normal">
                    "{review.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced & Minimalist Footer (Without Terms and Policies) */}
      <footer id="contacto" className="bg-[#1c0d1b] text-white pt-16 pb-8 border-t border-fuchsia-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            
            {/* Column 1: Typographic Brand & Bio (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <a href="#" className="flex flex-col group focus:outline-none">
                <span className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-white group-hover:text-fuchsia-200 transition-colors">
                  Femme <span className="italic font-normal text-fuchsia-300">Naturelle</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-fuchsia-300/70 font-medium mt-1">
                  Estética Avanzada & Spa
                </span>
              </a>
              <p className="text-xs text-white/65 leading-relaxed max-w-sm pt-1">
                Tu espacio de armonía y bienestar en Bogotá. Especialistas en rejuvenecimiento facial, moldeamiento corporal y recuperación post-quirúrgica.
              </p>
              
              {/* Contact Icons */}
              <div className="pt-2 space-y-2 text-xs text-white/75">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-fuchsia-400 shrink-0" />
                  <span>Cl. 154a #94-91 local 205, Bogotá</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-fuchsia-400 shrink-0" />
                  <span>+57 321 481 7438</span>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation Links (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
                Navegación
              </p>
              <ul className="space-y-2 text-xs text-white/65">
                <li>
                  <a href="#servicios" className="hover:text-white transition-colors">Servicios estéticos</a>
                </li>
                <li>
                  <a href="#experiencia" className="hover:text-white transition-colors">Nuestra experiencia</a>
                </li>
                <li>
                  <a href="#testimonios" className="hover:text-white transition-colors">Opiniones de clientas</a>
                </li>
                <li>
                  <button onClick={toggleBooking} className="hover:text-white transition-colors text-left cursor-pointer">
                    Agendar cita en línea
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Business Hours (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
                Horarios de Atención
              </p>
              <div className="space-y-1.5 text-xs text-white/65">
                <div className="flex justify-between">
                  <span>Lunes a Viernes:</span>
                  <span className="text-white/90 font-medium">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span className="text-white/90 font-medium">9:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between text-fuchsia-300/80">
                  <span>Domingos y Festivos:</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>

            {/* Column 4: Social & Booking (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
                Conectar
              </p>
              <div className="flex gap-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-fuchsia-600 flex items-center justify-center transition-colors text-white"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-fuchsia-600 flex items-center justify-center transition-colors text-white"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href="https://wa.me/573214817438" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors text-white"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
              <div className="pt-2">
                <button 
                  onClick={toggleBooking}
                  className="w-full text-center py-2.5 px-4 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-full text-xs font-medium text-white transition-all shadow-sm hover:shadow-md hover:shadow-fuchsia-900/40 active:scale-95 cursor-pointer"
                >
                  Reservar cita
                </button>
              </div>
            </div>
          </div>
          
          {/* Clean Bottom Bar (No terms or policies links) */}
          <div className="pt-8 text-center text-xs text-white/45">
            <p>© {new Date().getFullYear()} Femme Naturelle · Bogotá, Colombia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Contact Button */}
      <a 
        href="https://wa.me/573214817438" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Dudas? Escríbenos por WhatsApp
        </span>
      </a>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-fuchsia-100 z-40 md:hidden flex gap-2">
        <a 
          href="https://wa.me/573214817438" 
          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium text-xs text-center flex items-center justify-center gap-1.5"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <button 
          onClick={toggleBooking}
          className="flex-[2] bg-fuchsia-600 text-white py-3 rounded-xl font-medium text-xs text-center shadow-xs cursor-pointer"
        >
          Reservar cita
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={toggleBooking} />
    </div>
  );
}
