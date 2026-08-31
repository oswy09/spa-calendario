import { ref } from 'vue'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || ''
const SCOPES = 'https://www.googleapis.com/auth/calendar'

interface BookingEvent {
  serviceName: string
  servicePrice: number
  duration: string
  date: Date
  time: string
  clientName: string
  clientEmail: string
  clientPhone: string
}

export function useGoogleCalendar() {
  const isAuthenticated = ref(false)
  const isInitialized = ref(false)

  const initGoogleAPI = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.gapi) {
          window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
              scope: SCOPES
            }).then(() => {
              isInitialized.value = true
              const authInstance = window.gapi.auth2.getAuthInstance()
              isAuthenticated.value = authInstance.isSignedIn.get()
              
              authInstance.isSignedIn.listen((signedIn: boolean) => {
                isAuthenticated.value = signedIn
              })
              
              resolve(true)
            }).catch((error: any) => {
              console.error('Error initializing Google API:', error)
              resolve(false)
            })
          })
        }
      }
      document.head.appendChild(script)
    })
  }

  const signIn = async () => {
    try {
      if (!isInitialized.value) {
        await initGoogleAPI()
      }
      
      const authInstance = window.gapi.auth2.getAuthInstance()
      await authInstance.signIn()
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.error('Error signing in:', error)
      return false
    }
  }

  const signOut = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance()
      await authInstance.signOut()
      isAuthenticated.value = false
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const createCalendarEvent = async (booking: BookingEvent) => {
    if (!isAuthenticated.value) {
      throw new Error('User not authenticated')
    }

    // Parsear la hora
    const timeMatch = booking.time.match(/(\d+):(\d+)\s*(AM|PM)/)
    if (!timeMatch) throw new Error('Invalid time format')
    
    let hours = parseInt(timeMatch[1])
    const minutes = parseInt(timeMatch[2])
    const period = timeMatch[3]
    
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    
    // Fecha y hora de inicio
    const startDate = new Date(booking.date)
    startDate.setHours(hours, minutes, 0, 0)
    
    // Calcular fecha de fin según duración
    const durationMatch = booking.duration.match(/(\d+)/)
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

    const event = {
      summary: `${booking.serviceName} - ${booking.clientName}`,
      location: 'Spa Studio - Calle 123 #45-67',
      description: `Reserva en Spa Studio
      
Servicio: ${booking.serviceName}
Duración: ${booking.duration}
Precio: $${booking.servicePrice.toLocaleString('es-CO')} COP

Cliente:
Nombre: ${booking.clientName}
Email: ${booking.clientEmail}
Teléfono: ${booking.clientPhone}

Contacto del spa:
Teléfono: +57 305 750 2790`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Bogota'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Bogota'
      },
      attendees: [
        { email: booking.clientEmail }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 }
        ]
      },
      colorId: '10' // Verde basil
    }

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all' // Envía email al cliente también
      })
      
      return {
        success: true,
        eventId: response.result.id,
        eventLink: response.result.htmlLink
      }
    } catch (error: any) {
      console.error('Error creating calendar event:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  const checkAvailability = async (date: Date, timeSlots: string[]) => {
    if (!isAuthenticated.value) {
      return timeSlots.map(time => ({ time, available: true }))
    }

    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })

      const events = response.result.items || []
      
      return timeSlots.map(timeSlot => {
        const timeMatch = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/)
        if (!timeMatch) return { time: timeSlot, available: true }
        
        let hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const period = timeMatch[3]
        
        if (period === 'PM' && hours !== 12) hours += 12
        if (period === 'AM' && hours === 12) hours = 0
        
        const slotDateTime = new Date(date)
        slotDateTime.setHours(hours, minutes, 0, 0)
        
        // Verificar si hay conflicto
        const hasConflict = events.some((event: any) => {
          const eventStart = new Date(event.start.dateTime || event.start.date)
          const eventEnd = new Date(event.end.dateTime || event.end.date)
          return slotDateTime >= eventStart && slotDateTime < eventEnd
        })
        
        return {
          time: timeSlot,
          available: !hasConflict
        }
      })
    } catch (error) {
      console.error('Error checking availability:', error)
      return timeSlots.map(time => ({ time, available: true }))
    }
  }

  return {
    isAuthenticated,
    isInitialized,
    initGoogleAPI,
    signIn,
    signOut,
    createCalendarEvent,
    checkAvailability
  }
}
