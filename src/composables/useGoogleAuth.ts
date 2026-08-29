declare global {
  interface Window {
    google: any
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function useGoogleAuth() {
  const initializeGoogleAuth = async () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => resolve(response)
        })
      }
      script.onerror = () => reject(new Error('Failed to load Google SDK'))
      document.head.appendChild(script)
    })
  }

  const requestCalendarAccess = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar',
        ux_mode: 'popup',
        callback: (response) => {
          if (response.code) {
            resolve(response.code)
          } else {
            reject(new Error('No authorization code received'))
          }
        },
        error_callback: (error) => {
          reject(error)
        }
      })
      client.requestCode()
    })
  }

  const createCalendarEvent = async (accessToken: string, eventData: any) => {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Error creating event: ${error.error.message}`)
    }

    return await response.json()
  }

  return {
    initializeGoogleAuth,
    requestCalendarAccess,
    createCalendarEvent
  }
}
