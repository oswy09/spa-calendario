# 🔥 Configuración de Firebase + Google Calendar

## 📋 Pasos para configurar el proyecto

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Firestore Database**
4. Habilita **Cloud Functions**

### 2. Obtener credenciales de Firebase

En Firebase Console → Project Settings → General:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Copia estos valores en `.env.local`

### 3. Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 4. Inicializar Firebase en el proyecto

```bash
firebase init
```

Selecciona:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting (opcional)

### 5. Configurar Google Calendar API

#### 5.1 Habilitar Google Calendar API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto de Firebase
3. Ve a **APIs & Services** → **Library**
4. Busca "Google Calendar API" y habilítala

#### 5.2 Obtener Refresh Token

Ejecuta este script una vez para obtener el refresh token:

```javascript
// obtener-refresh-token.js
const {google} = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  'TU_CLIENT_ID',
  'TU_CLIENT_SECRET',
  'http://localhost:5174'
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Autoriza esta app visitando esta URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Ingresa el código de autorización: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error obteniendo token:', err);
    console.log('Refresh Token:', token.refresh_token);
  });
});
```

Ejecuta:
```bash
node obtener-refresh-token.js
```

### 6. Configurar variables de entorno en Firebase

```bash
firebase functions:config:set \
  google.client_id="TU_CLIENT_ID" \
  google.client_secret="TU_CLIENT_SECRET" \
  google.redirect_uri="http://localhost:5174" \
  google.refresh_token="TU_REFRESH_TOKEN"
```

### 7. Desplegar Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 🗄️ Estructura de Firestore

### Colección: `bookings`

```javascript
{
  bookingDate: Timestamp,
  bookingTime: "02:30 PM",
  clientEmail: "cliente@email.com",
  clientName: "María García",
  clientPhone: "+57 300 123 4567",
  createdAt: Timestamp,
  serviceId: "m1",
  serviceName: "Masaje Sueco Relajante",
  servicePrice: 250000,
  serviceDuration: "60 min",
  status: "confirmed"
}
```

## 🔄 Flujo completo

1. **Cliente hace reserva** → Frontend (App.vue)
2. **Se guarda en Firestore** → Firebase Firestore
3. **Se activa Cloud Function** → `createCalendarEvent`
4. **Se crea evento** → Google Calendar de la dueña
5. **Se envía email** → Cliente recibe invitación

## 🧪 Probar localmente

```bash
# Iniciar emuladores de Firebase
firebase emulators:start

# En otra terminal, ejecutar el proyecto
npm run dev
```

## 📝 Notas importantes

- El refresh token se obtiene **una sola vez** cuando la dueña del spa autoriza la app
- Las Cloud Functions solo se ejecutan en producción o con emuladores
- Si no hay Cloud Functions desplegadas, la reserva se guarda pero no se crea el evento en Calendar
