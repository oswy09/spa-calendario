import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function saveBooking(bookingData: any) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          service_id: bookingData.service_id,
          service_name: bookingData.service_name,
          service_price: bookingData.service_price,
          booking_date: bookingData.booking_date,
          booking_time: bookingData.booking_time,
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) {
      console.error('Error saving booking:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: 'Error inesperado al guardar la reserva' }
  }
}
