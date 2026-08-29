<template>
  <div v-if="showAdminPanel" class="admin-panel-container">
    <AdminPanel @back="showAdminPanel = false" />
  </div>
  <div v-else class="min-h-screen flex flex-col items-center justify-center bg-sage-50 font-sans text-sage-900 selection:bg-sage-200 p-4 sm:p-8 relative">
    
    <!-- Admin Link -->
    <button
      @click="showAdminPanel = true"
      class="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full bg-sage-400/15 text-sage-700 hover:bg-sage-400/30 transition-colors"
    >
      Admin
    </button>
    
    <div class="w-full max-w-xl bg-white rounded-[2rem] shadow-[0_12px_48px_rgb(17,16,74,0.10)] border border-sage-100 p-6 sm:p-12 relative overflow-hidden">
      <!-- Accent bar -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage-400 via-sage-500 to-sage-400 rounded-t-[2rem]"></div>

      <!-- Header -->
      <div class="text-center mb-10">
        <div class="font-serif text-xl tracking-widest uppercase text-sage-500 mb-2">Aura Studio</div>
        <h1 class="font-serif text-3xl sm:text-4xl text-sage-900 font-bold">Reserva tu cita</h1>
      </div>

      <!-- Progress Indicator -->
      <div v-if="step < 5" class="mb-10">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs font-semibold tracking-widest uppercase text-sage-900">
            Paso {{ step }} de 4
          </span>
          <span class="text-xs font-medium text-sage-700">
            <span v-if="step === 1">Servicio</span>
            <span v-else-if="step === 2">Fecha</span>
            <span v-else-if="step === 3">Hora</span>
            <span v-else-if="step === 4">Detalles</span>
          </span>
        </div>
        <div class="h-1 w-full bg-sage-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-sage-400 rounded-full transition-all duration-500"
            :style="{ width: `${(step / 4) * 100}%` }"
          />
        </div>
      </div>

      <!-- Step Content -->
      <div class="min-h-[420px] relative">
        
        <!-- STEP 1: SERVICES -->
        <div v-if="step === 1" class="flex flex-col animate-fade-in">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-white shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21C12 21 7 17 7 11C7 7.7 9.2 6 12 8C14.8 6 17 7.7 17 11C17 17 12 21 12 21Z"/>
                <path d="M7 11C5 10 3 10.5 3 13C3 15.5 5.5 17 8 16.5"/>
                <path d="M17 11C19 10 21 10.5 21 13C21 15.5 18.5 17 16 16.5"/>
                <line x1="12" y1="21" x2="12" y2="23.5"/>
              </svg>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold">Elige un servicio</h2>
          </div>

          <!-- Categories -->
          <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            <button
              v-for="category in spaServices"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="{
                'bg-sage-900 text-white': selectedCategory === category.id,
                'bg-sage-50 text-sage-600 hover:bg-sage-100': selectedCategory !== category.id
              }"
              class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- Services List -->
          <div class="space-y-3 overflow-y-auto pr-2 pb-4 flex-1">
            <button
              v-for="service in activeCategory?.services"
              :key="service.id"
              @click="selectedService = service"
              :class="{
                'border-sage-500 bg-sage-50 shadow-sm ring-1 ring-sage-500/20': selectedService?.id === service.id,
                'border-sage-100 hover:border-sage-300 hover:bg-sage-50/50': selectedService?.id !== service.id
              }"
              class="w-full text-left p-4 rounded-2xl border transition-all duration-200 flex justify-between items-center"
            >
              <div>
                <h3 :class="{ 'text-sage-900': selectedService?.id === service.id, 'text-sage-800': selectedService?.id !== service.id }" class="font-bold">
                  {{ service.name }}
                </h3>
                <p class="text-sm text-sage-600 mt-1">{{ service.duration }}</p>
              </div>
              <div :class="{ 'text-sage-900': selectedService?.id === service.id, 'text-sage-600': selectedService?.id !== service.id }" class="font-serif text-2xl font-bold">
                ${{ service.price.toLocaleString('es-CO') }}
              </div>
            </button>
          </div>
        </div>

        <!-- STEP 2: DATE -->
        <div v-if="step === 2" class="flex flex-col animate-fade-in">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-white shrink-0">
              <Calendar :size="20" :strokeWidth="2" />
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold">Elige una fecha</h2>
          </div>

          <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-sage-100">
            <div class="flex justify-between items-center mb-6">
              <button @click="prevMonth" class="p-2 hover:bg-sage-50 rounded-full transition-colors text-sage-500">
                ← 
              </button>
              <h3 class="font-medium text-lg capitalize">
                {{ monthNames[currentMonthDate.getMonth()] }} {{ currentMonthDate.getFullYear() }}
              </h3>
              <button @click="nextMonth" class="p-2 hover:bg-sage-50 rounded-full transition-colors text-sage-500">
                →
              </button>
            </div>

            <div class="grid grid-cols-7 gap-y-4 gap-x-1 justify-items-center mb-2">
              <div v-for="day in dayNames" :key="day" class="text-xs font-semibold text-sage-700 uppercase tracking-wider w-10 text-center">
                {{ day }}
              </div>
              <template v-for="item in calendarDays" :key="item.key">
                <div v-if="!item.day" class="h-10 w-10"></div>
                <button
                  v-else
                  @click="selectDate(item.day)"
                  :disabled="item.isPast || item.isFullyBooked"
                  :class="{
                    'text-gray-300 cursor-not-allowed': item.isPast,
                    'text-sage-300 cursor-not-allowed opacity-50': !item.isPast && item.isFullyBooked,
                    'bg-sage-500 text-white hover:shadow-md shadow-sm': item.isSelected,
                    'hover:bg-sage-100 cursor-pointer': !item.isPast && !item.isSelected && !item.isFullyBooked,
                    'text-sage-900': !item.isPast && !item.isFullyBooked
                  }"
                  class="h-10 w-10 rounded-full flex flex-col items-center justify-center text-sm transition-all duration-200 relative"
                >
                  <span>{{ item.day }}</span>
                  <!-- Dot indicator -->
                  <span
                    v-if="!item.isPast && item.bookingCount >= 0"
                    :class="item.isFullyBooked
                      ? 'bg-sage-300'
                      : item.bookingCount > 0
                        ? 'bg-sage-400'
                        : 'bg-sage-500'"
                    class="absolute bottom-1 w-1 h-1 rounded-full"
                  ></span>
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- STEP 3: TIME -->
        <div v-if="step === 3" class="flex flex-col animate-fade-in">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-white shrink-0">
              <Clock :size="20" :strokeWidth="2" />
            </div>
            <div>
              <h2 class="font-serif text-2xl sm:text-3xl font-bold">Elige una hora</h2>
              <p class="text-sm text-sage-700 mt-1 capitalize">
                {{ selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              v-for="time in allTimeSlots"
              :key="time"
              @click="selectedTime = time"
              :disabled="reservedTimes.includes(time)"
              :class="{
                'border-sage-600 bg-sage-500 text-white shadow-md': selectedTime === time,
                'border-sage-100 bg-white text-sage-700 hover:border-sage-400 hover:bg-sage-50': selectedTime !== time && !reservedTimes.includes(time),
                'border-red-200 bg-red-50 text-red-400 cursor-not-allowed': reservedTimes.includes(time)
              }"
              class="py-4 px-4 sm:px-6 rounded-2xl border text-sm font-medium transition-all duration-200"
            >
              {{ time }}
              <span v-if="reservedTimes.includes(time)" class="text-xs ml-1">❌</span>
            </button>
          </div>
        </div>

        <!-- STEP 4: DETAILS -->
        <div v-if="step === 4" class="flex flex-col animate-fade-in">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-white shrink-0">
              <User :size="20" :strokeWidth="2" />
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold">Tus datos</h2>
          </div>

          <div class="space-y-6">
            <div>
              <label for="name" class="block text-xs font-semibold uppercase tracking-widest text-sage-700 mb-2">Nombre completo</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                placeholder="Ej. María García"
                class="w-full bg-transparent border-b-2 border-sage-200 py-3 text-sage-900 placeholder:text-sage-300/80 focus:outline-none focus:border-sage-500 transition-colors text-lg"
              />
            </div>
            
            <div>
              <label for="email" class="block text-xs font-semibold uppercase tracking-widest text-sage-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="maria@ejemplo.com"
                class="w-full bg-transparent border-b-2 border-sage-200 py-3 text-sage-900 placeholder:text-sage-300/80 focus:outline-none focus:border-sage-500 transition-colors text-lg"
              />
            </div>

            <div>
              <label for="phone" class="block text-xs font-semibold uppercase tracking-widest text-sage-700 mb-2">Celular</label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                placeholder="+34 600 000 000"
                class="w-full bg-transparent border-b-2 border-sage-200 py-3 text-sage-900 placeholder:text-sage-300/80 focus:outline-none focus:border-sage-500 transition-colors text-lg"
              />
            </div>
          </div>
        </div>

        <!-- STEP 5: SUCCESS -->
        <div v-if="step === 5" class="flex flex-col items-center justify-center text-center animate-fade-in">
          <div class="w-20 h-20 rounded-full bg-sage-400 flex items-center justify-center mb-6 shadow-lg shadow-sage-400/30">
            <Check :size="40" :strokeWidth="2" class="text-white" />
          </div>
          <h2 class="font-serif text-3xl sm:text-4xl mb-3 font-bold">¡Reserva confirmada!</h2>
          <p class="text-sage-700 mb-8 max-w-sm text-sm sm:text-base">
            Gracias {{ formData.name.split(' ')[0] }}. Hemos enviado los detalles de tu cita a {{ formData.email }}.
          </p>
          
          <div class="bg-sage-50 rounded-2xl p-5 sm:p-6 w-full border border-sage-200 text-left mb-8 space-y-4">
            
            <div class="flex items-start gap-4 pb-4 border-b border-sage-200/60">
              <div class="text-white shrink-0 w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                <Sparkles :size="16" :strokeWidth="2" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-semibold uppercase tracking-wider text-sage-600">Servicio</p>
                <div class="flex justify-between items-center mt-0.5">
                  <p class="font-medium text-sage-800">{{ selectedService?.name }}</p>
                  <p class="font-serif text-2xl font-bold text-sage-900">${{ selectedService?.price.toLocaleString('es-CO') }}</p>
                </div>
                <p class="text-xs text-sage-600 mt-0.5">{{ selectedService?.duration }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4 pb-4 border-b border-sage-200/60">
              <div class="text-white w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                <Calendar :size="16" :strokeWidth="2" />
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-sage-600">Fecha</p>
                <p class="font-medium text-sage-800 capitalize">
                  {{ selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="text-white w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                <Clock :size="16" :strokeWidth="2" />
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-sage-600">Hora</p>
                <p class="font-medium text-sage-800">{{ selectedTime }}</p>
              </div>
            </div>

          </div>

          <button 
            @click="resetForm"
            class="w-full py-3 px-6 bg-sage-500 text-white rounded-full font-medium text-sm hover:bg-sage-600 transition-colors flex items-center justify-center gap-2"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div v-if="step < 5" class="mt-8 flex items-center justify-between pt-6 border-t border-sage-100">
        <button
          v-if="step > 1"
          @click="prevStep"
          class="flex items-center gap-2 text-sage-600 hover:text-sage-900 transition-colors font-medium text-sm px-4 py-2 -ml-4"
        >
          ← Atrás
        </button>
        <div v-else></div>
        
        <button
          @click="nextStep"
          :disabled="!isStepValid() || isSavingBooking"
          :class="{
            'bg-sage-500 text-white hover:shadow-xl hover:-translate-y-0.5 shadow-lg': isStepValid() && !isSavingBooking,
            'bg-sage-100 text-sage-400 cursor-not-allowed': !isStepValid() || isSavingBooking
          }"
          class="px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2"
        >
          <span v-if="isSavingBooking">Guardando...</span>
          <span v-else>{{ step === 4 ? 'Confirmar reserva' : 'Continuar' }}</span>
          <span v-if="step < 4 && !isSavingBooking">→</span>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-5 flex flex-col items-center gap-2">
      <div class="flex items-center gap-3 text-sage-300">
        <div class="h-px w-12 bg-sage-200"></div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <div class="h-px w-12 bg-sage-200"></div>
      </div>
      <a
        href="https://oswal.com.co/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-sage-500 hover:text-sage-700 transition-colors tracking-wide"
      >
        Creado por <span class="font-semibold text-sage-700">Oswal</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Calendar, Clock, User, Check, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useFirebaseBooking } from './composables/useFirebaseBooking'
import AdminPanel from './views/AdminPanel.vue'

const { saveBooking, getReservedTimes, getMonthAvailability } = useFirebaseBooking()
const isSavingBooking = ref(false)
const bookingSaved = ref(false)
const showAdminPanel = ref(false)
const reservedTimes = ref<string[]>([])
const monthAvailability = ref<Record<number, number>>({})

const TOTAL_SLOTS = 7

const loadMonthAvailability = async () => {
  const y = currentMonthDate.value.getFullYear()
  const m = currentMonthDate.value.getMonth()
  monthAvailability.value = await getMonthAvailability(y, m)
}

interface FormData {
  name: string
  email: string
  phone: string
}

interface Service {
  id: string
  name: string
  price: number
  duration: string
}

interface Category {
  id: string
  name: string
  services: Service[]
}

const spaServices: Category[] = [
  {
    id: 'masajes',
    name: 'Masajes',
    services: [
      { id: 'm1', name: 'Masaje Sueco Relajante', price: 250000, duration: '60 min' },
      { id: 'm2', name: 'Tejido Profundo', price: 350000, duration: '60 min' },
      { id: 'm3', name: 'Piedras Calientes', price: 400000, duration: '90 min' },
    ]
  },
  {
    id: 'faciales',
    name: 'Faciales',
    services: [
      { id: 'f1', name: 'Limpieza Profunda', price: 200000, duration: '45 min' },
      { id: 'f2', name: 'Facial Anti-Edad', price: 300000, duration: '60 min' },
      { id: 'f3', name: 'Hidratación Intensiva', price: 260000, duration: '60 min' },
    ]
  },
  {
    id: 'corporales',
    name: 'Corporales',
    services: [
      { id: 'c1', name: 'Exfoliación Corporal', price: 220000, duration: '45 min' },
      { id: 'c2', name: 'Envoltura de Barro', price: 320000, duration: '60 min' },
      { id: 'c3', name: 'Masaje con Aceites Aromáticos', price: 280000, duration: '60 min' },
    ]
  },
  {
    id: 'bienestar',
    name: 'Bienestar',
    services: [
      { id: 'b1', name: 'Yoga y Meditación', price: 180000, duration: '60 min' },
      { id: 'b2', name: 'Sesión de Reiki', price: 220000, duration: '50 min' },
      { id: 'b3', name: 'Baño de Sonido', price: 260000, duration: '75 min' },
    ]
  }
]

const allTimeSlots = [
  '09:00 AM', '10:00 AM', '11:30 AM', 
  '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
]

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const step = ref(1)
const selectedCategory = ref(spaServices[0].id)
const selectedService = ref<Service | null>(null)
const currentMonthDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedTime = ref<string | null>(null)
const formData = ref<FormData>({
  name: '',
  email: '',
  phone: ''
})

const activeCategory = computed(() => spaServices.find(c => c.id === selectedCategory.value))

const availableTimeSlots = computed(() => {
  return allTimeSlots.filter(time => !reservedTimes.value.includes(time))
})

const calendarDays = computed(() => {
  const year = currentMonthDate.value.getFullYear()
  const month = currentMonthDate.value.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const today = new Date()

  const days = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push({ key: `empty-${i}`, day: null })
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const isSelected = selectedDate.value?.getDate() === day && 
                       selectedDate.value?.getMonth() === month && 
                       selectedDate.value?.getFullYear() === year
    
    const bookingCount = monthAvailability.value[day] ?? -1
    const isFullyBooked = bookingCount >= TOTAL_SLOTS

    days.push({
      key: `day-${day}`,
      day,
      isPast,
      isSelected,
      bookingCount,
      isFullyBooked
    })
  }
  
  return days
})

const nextMonth = async () => {
  currentMonthDate.value = new Date(currentMonthDate.value.getFullYear(), currentMonthDate.value.getMonth() + 1, 1)
  await loadMonthAvailability()
}

const prevMonth = async () => {
  currentMonthDate.value = new Date(currentMonthDate.value.getFullYear(), currentMonthDate.value.getMonth() - 1, 1)
  await loadMonthAvailability()
}

const selectDate = async (day: number) => {
  const date = new Date(currentMonthDate.value.getFullYear(), currentMonthDate.value.getMonth(), day)
  const today = new Date()
  if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    selectedDate.value = date
    // Cargar horas reservadas para esa fecha
    reservedTimes.value = await getReservedTimes(date)
  }
}

const nextStep = async () => {
  if (step.value < 5 && isStepValid()) {
    if (step.value === 1) {
      await loadMonthAvailability()
    }
    if (step.value === 4) {
      // Guardar en Firebase y crear evento en Google Calendar
      if (selectedService.value && selectedDate.value && selectedTime.value) {
        isSavingBooking.value = true
        try {
          const result = await saveBooking({
            serviceId: selectedService.value.id,
            serviceName: selectedService.value.name,
            servicePrice: selectedService.value.price,
            serviceDuration: selectedService.value.duration,
            bookingDate: selectedDate.value,
            bookingTime: selectedTime.value,
            clientName: formData.value.name,
            clientEmail: formData.value.email,
            clientPhone: formData.value.phone
          })
          
          if (result.success) {
            console.log('✅ Reserva guardada:', result.bookingId)
            bookingSaved.value = true
            
            // NO abrimos Google Calendar para el cliente - solo para el admin
          } else {
            console.error('❌ Error:', result.error)
            alert('Hubo un problema al guardar tu reserva. Por favor intenta nuevamente.')
            isSavingBooking.value = false
            return
          }
        } catch (error) {
          console.error('❌ Error inesperado:', error)
          alert('Hubo un problema al guardar tu reserva. Por favor intenta nuevamente.')
          isSavingBooking.value = false
          return
        } finally {
          isSavingBooking.value = false
        }
      }
    }
    step.value++
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const isStepValid = () => {
  if (step.value === 1) return selectedService.value !== null
  if (step.value === 2) return selectedDate.value !== null
  if (step.value === 3) return selectedTime.value !== null
  if (step.value === 4) return formData.value.name.trim() !== '' && formData.value.email.includes('@') && formData.value.phone.trim() !== ''
  return true
}

const resetForm = () => {
  step.value = 1
  selectedService.value = null
  selectedDate.value = null
  selectedTime.value = null
  formData.value = {name: '', email: '', phone: ''}
  bookingSaved.value = false
}


</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
