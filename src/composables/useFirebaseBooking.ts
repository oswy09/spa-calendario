import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

interface BookingData {
  serviceName: string
  servicePrice: number
  serviceDuration: string
  serviceId: string
  bookingDate: Date
  bookingTime: string
  clientName: string
  clientEmail: string
  clientPhone: string
}

// Generar enlace de Google Calendar con evento pre-relleno
const generateGoogleCalendarLink = (bookingData: BookingData, bookingId: string) => {
  // Parsear hora
  const timeMatch = bookingData.bookingTime.match(/(\d+):(\d+)\s*(AM|PM)/)
  if (!timeMatch) return null

  let hours = parseInt(timeMatch[1])
  const minutes = parseInt(timeMatch[2])
  const period = timeMatch[3]

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  // Crear fecha de inicio
  const startDate = new Date(bookingData.bookingDate)
  startDate.setHours(hours, minutes, 0, 0)

  // Calcular duración
  const durationMatch = bookingData.serviceDuration.match(/(\d+)/)
  const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

  const title = `${bookingData.serviceName} - ${bookingData.clientName}`
  const description = `Reserva en Spa Studio\n\nServicio: ${bookingData.serviceName}\nDuración: ${bookingData.serviceDuration}\nPrecio: $${bookingData.servicePrice.toLocaleString('es-CO')} COP\n\nCliente:\nNombre: ${bookingData.clientName}\nEmail: ${bookingData.clientEmail}\nTeléfono: ${bookingData.clientPhone}\n\nID de reserva: ${bookingId}`

  // Formatear fechas para Google Calendar (ISO 8601)
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: description,
    location: 'Spa Studio - Calle 123 #45-67',
    add: bookingData.clientEmail,
  })

  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`
}

export function useFirebaseBooking() {
  // Obtener horas ya reservadas para una fecha específica
  const getReservedTimes = async (date: Date): Promise<string[]> => {
    try {
      // Crear rango de fecha
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      // Consultar Firestore
      const q = query(
        collection(db, 'bookings'),
        where('bookingDate', '>=', Timestamp.fromDate(startOfDay)),
        where('bookingDate', '<=', Timestamp.fromDate(endOfDay))
      )

      const snapshot = await getDocs(q)
      const reservedTimes = snapshot.docs.map(doc => doc.data().bookingTime)
      
      console.log(`Horas reservadas para ${date.toLocaleDateString()}:`, reservedTimes)
      return reservedTimes
    } catch (error) {
      console.error('Error obteniendo horas reservadas:', error)
      return []
    }
  }

  const saveBooking = async (bookingData: BookingData) => {
    try {
      console.log('🔄 Iniciando guardado en Firestore...')
      console.log('📦 Datos a guardar:', bookingData)
      
      // Guardar en Firestore
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        serviceId: bookingData.serviceId,
        serviceName: bookingData.serviceName,
        servicePrice: bookingData.servicePrice,
        serviceDuration: bookingData.serviceDuration,
        bookingDate: Timestamp.fromDate(bookingData.bookingDate),
        bookingTime: bookingData.bookingTime,
        clientName: bookingData.clientName,
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone,
        createdAt: Timestamp.now(),
        status: 'confirmed',
        calendarEventCreated: false
      })

      console.log('✅ Reserva guardada en Firestore:', bookingRef.id)

      // Enviar automáticamente al Google Apps Script webhook
      const webhookURL = 'https://script.google.com/macros/s/AKfycbzi1tvZ6z66yw-1QtiCP32KfzXfW4C-E_rlnL9egVBRLfHGClW0el7-D04EN76pBlypTA/exec'
      
      const eventData = {
        bookingId: bookingRef.id,
        serviceName: bookingData.serviceName,
        servicePrice: bookingData.servicePrice,
        serviceDuration: bookingData.serviceDuration,
        bookingDate: bookingData.bookingDate.toISOString().split('T')[0],
        bookingTime: bookingData.bookingTime,
        clientName: bookingData.clientName,
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone
      }

      console.log('📅 Enviando evento a Google Calendar...')
      
      try {
        const response = await fetch(webhookURL, {
          method: 'POST',
          body: JSON.stringify(eventData)
        })
        
        const result = await response.json()
        console.log('✅ Respuesta del webhook:', result)
        
        if (result.status === 'success') {
          console.log('✅ Evento creado automáticamente en Google Calendar')
        }
      } catch (webhookError) {
        console.warn('⚠️ Error enviando al webhook (continuando de todos modos):', webhookError)
      }

      // Generar enlace de Google Calendar (por si acaso)
      const calendarLink = generateGoogleCalendarLink(bookingData, bookingRef.id)
      
      return {
        success: true,
        bookingId: bookingRef.id,
        calendarLink: calendarLink,
        message: 'Reserva confirmada y guardada en la base de datos'
      }
    } catch (error: any) {
      console.error('❌ Error guardando reserva:', error)
      console.error('❌ Mensaje:', error.message)
      console.error('❌ Código:', error.code)
      return {
        success: false,
        error: error.message || 'Error desconocido'
      }
    }
  }

  const getMonthAvailability = async (year: number, month: number): Promise<Record<number, number>> => {
    try {
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0)
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999)

      const q = query(
        collection(db, 'bookings'),
        where('bookingDate', '>=', Timestamp.fromDate(startOfMonth)),
        where('bookingDate', '<=', Timestamp.fromDate(endOfMonth))
      )

      const snapshot = await getDocs(q)
      const countByDay: Record<number, number> = {}

      snapshot.docs.forEach(doc => {
        const date = (doc.data().bookingDate as Timestamp).toDate()
        const day = date.getDate()
        countByDay[day] = (countByDay[day] || 0) + 1
      })

      return countByDay
    } catch (error) {
      console.error('Error obteniendo disponibilidad del mes:', error)
      return {}
    }
  }

  return {
    saveBooking,
    getReservedTimes,
    getMonthAvailability
  }
}

