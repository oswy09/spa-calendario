<template>
  <div class="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-4xl font-serif font-bold text-sage-900 mb-2">Panel de Administrador</h1>
          <p class="text-sage-600">Spa Studio - Sistema de Reservas</p>
        </div>
        <button
          @click="$emit('back')"
          class="text-sage-600 hover:text-sage-900 text-sm font-medium px-4 py-2 hover:bg-sage-200 rounded-full transition-colors"
        >
          ← Volver
        </button>
      </div>

      <!-- Authentication Status -->
      <div v-if="!isAdminAuthenticated" class="bg-white rounded-2xl shadow-md p-8 text-center mb-8">
        <h2 class="text-2xl font-bold text-sage-900 mb-4">Autenticación del Administrador</h2>
        <p class="text-sage-600 mb-6">Ingresa tu contraseña para acceder al panel de reservas.</p>
        
        <button
          @click="authenticateAdmin"
          class="px-8 py-3 bg-sage-500 text-white rounded-full font-medium hover:bg-sage-600 transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>

      <!-- Admin Authenticated -->
      <div v-else>
        <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 class="text-2xl font-serif font-bold text-sage-900">Reservas Confirmadas</h2>
            <p class="text-sm text-sage-600 mt-1">📅 Haz click en "Agregar a Calendario" para sincronizar con Google Calendar</p>
          </div>
          
          <button
            @click="logout"
            class="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <!-- No Reservas -->
        <div v-if="bookings.length === 0" class="bg-white rounded-2xl shadow-md p-8 text-center">
          <p class="text-sage-600">No hay reservas aún.</p>
        </div>

        <!-- Reservas Grid -->
        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <!-- Service -->
            <div class="mb-4 pb-4 border-b border-sage-100">
              <h3 class="text-lg font-bold text-sage-900">{{ booking.serviceName }}</h3>
              <p class="text-sm text-sage-500 mt-1">{{ booking.serviceDuration }}</p>
            </div>

            <!-- DateTime -->
            <div class="mb-4 space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium text-sage-600">📅</span>
                <span class="text-sage-700">{{ formatDate(booking.bookingDate) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium text-sage-600">🕐</span>
                <span class="text-sage-700">{{ booking.bookingTime }}</span>
              </div>
            </div>

            <!-- Client Info -->
            <div class="mb-4 pb-4 border-b border-sage-100 space-y-1 text-sm">
              <p class="text-sage-700"><span class="font-medium">Cliente:</span> {{ booking.clientName }}</p>
              <p class="text-sage-700"><span class="font-medium">Email:</span> {{ booking.clientEmail }}</p>
              <p class="text-sage-700"><span class="font-medium">Teléfono:</span> {{ booking.clientPhone }}</p>
            </div>

            <!-- Price & Action -->
            <div class="flex items-center justify-between">
              <span class="text-2xl font-serif font-bold text-sage-900">
                ${{ booking.servicePrice.toLocaleString('es-CO') }}
              </span>
              <button
                v-if="!booking.calendarEventCreated"
                @click="addToCalendar(booking)"
                :disabled="creatingEvent === booking.id"
                class="px-4 py-2 bg-sage-500 text-white rounded-full text-sm font-medium hover:bg-sage-600 transition-colors disabled:bg-sage-300"
              >
                {{ creatingEvent === booking.id ? 'Creando...' : 'Agregar a Calendario' }}
              </button>
              <div v-else class="flex items-center gap-2 text-sage-600">
                <span class="text-sm font-medium">✓ En calendario</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

defineEmits<{
  back: []
}>()

interface Booking {
  id: string
  serviceName: string
  servicePrice: number
  serviceDuration: string
  bookingDate: any
  bookingTime: string
  clientName: string
  clientEmail: string
  clientPhone: string
  calendarEventCreated?: boolean
  createdAt: any
}

const bookings = ref<Booking[]>([])
const isAdminAuthenticated = ref(false)
const adminAccessToken = ref<string | null>(null)
const creatingEvent = ref<string | null>(null)

// Admin password
const ADMIN_PASSWORD = 'admin123'

onMounted(() => {
  // Checking if admin is logged in
  const storedToken = localStorage.getItem('adminAccessToken')
  if (storedToken) {
    isAdminAuthenticated.value = true
    adminAccessToken.value = storedToken
  }

  // Subscribe to bookings
  if (isAdminAuthenticated.value) {
    subscribeToBookings()
  }
})

const subscribeToBookings = () => {
  const q = query(collection(db, 'bookings'))
  onSnapshot(q, (snapshot) => {
    bookings.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Booking[]
    
    // Sort by date descending
    bookings.value.sort((a, b) => {
      const dateA = a.bookingDate?.toDate?.() || new Date(a.bookingDate)
      const dateB = b.bookingDate?.toDate?.() || new Date(b.bookingDate)
      return dateB.getTime() - dateA.getTime()
    })
  })
}

const authenticateAdmin = async () => {
  // Simple password auth for demo
  const password = prompt('Ingresa la contraseña de administrador:')
  if (password === ADMIN_PASSWORD) {
    // For now, just use a demo token
    // In production, implement OAuth here
    const demoToken = 'demo-token-' + Date.now()
    localStorage.setItem('adminAccessToken', demoToken)
    isAdminAuthenticated.value = true
    adminAccessToken.value = demoToken
    subscribeToBookings()
  } else {
    alert('Contraseña incorrecta')
  }
}

const authenticateWithPassword = () => {
  const password = prompt('Ingresa la contraseña de administrador:')
  if (password === ADMIN_PASSWORD) {
    const demoToken = 'demo-token-' + Date.now()
    localStorage.setItem('adminAccessToken', demoToken)
    isAdminAuthenticated.value = true
    adminAccessToken.value = demoToken
    subscribeToBookings()
  } else {
    alert('Contraseña incorrecta')
  }
}

const logout = () => {
  localStorage.removeItem('adminAccessToken')
  isAdminAuthenticated.value = false
  adminAccessToken.value = null
  bookings.value = []
}

const formatDate = (date: any) => {
  const dateObj = date?.toDate?.() || new Date(date)
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const addToCalendar = async (booking: Booking) => {
  creatingEvent.value = booking.id
  
  try {
    // Parsear la hora
    const timeMatch = booking.bookingTime.match(/(\d+):(\d+)\s*(AM|PM)/)
    if (!timeMatch) throw new Error('Formato de hora inválido')

    let hours = parseInt(timeMatch[1])
    const minutes = parseInt(timeMatch[2])
    const period = timeMatch[3]

    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0

    // Crear fecha de inicio
    const bookingDate = booking.bookingDate?.toDate?.() || new Date(booking.bookingDate)
    const startDate = new Date(bookingDate)
    startDate.setHours(hours, minutes, 0, 0)

    // Calcular duración
    const durationMatch = booking.serviceDuration.match(/(\d+)/)
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

    // Formatear fechas para Google Calendar
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${booking.serviceName} - ${booking.clientName}`,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: `Cliente: ${booking.clientName}\nEmail: ${booking.clientEmail}\nTeléfono: ${booking.clientPhone}\nPrecio: $${booking.servicePrice.toLocaleString('es-CO')} COP\nID Reserva: ${booking.id}`,
      location: 'Spa Studio - Calle 123 #45-67',
      add: booking.clientEmail,
    })

    // Abrir Google Calendar
    window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`, '_blank')

    // Marcar como creado después de 1 segundo
    setTimeout(async () => {
      try {
        const bookingRef = doc(db, 'bookings', booking.id)
        await updateDoc(bookingRef, { calendarEventCreated: true })
      } catch (error) {
        console.error('Error actualizando reserva:', error)
      }
      creatingEvent.value = null
    }, 1000)
  } catch (error) {
    console.error('Error:', error)
    alert('Error al crear el evento')
    creatingEvent.value = null
  }
}
</script>

<style scoped>
/* Tailwind will handle styling */
</style>
