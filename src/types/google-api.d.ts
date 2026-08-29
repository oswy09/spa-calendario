declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void
      client: {
        init: (config: {
          apiKey?: string
          clientId: string
          discoveryDocs: string[]
          scope: string
        }) => Promise<void>
        calendar: {
          events: {
            insert: (params: any) => Promise<any>
            list: (params: any) => Promise<any>
          }
        }
      }
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean
            listen: (callback: (signedIn: boolean) => void) => void
          }
          signIn: () => Promise<void>
          signOut: () => Promise<void>
        }
      }
    }
  }
}

export {}
