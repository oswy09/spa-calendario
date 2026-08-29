import { google } from 'googleapis';
import readline from 'readline';

// ⚠️ REEMPLAZA CON TUS CREDENCIALES DE GOOGLE CLOUD CONSOLE
// Puedes definirlas como variables de entorno o pegarlas directamente aquí (nunca las subas a Git)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'TU_CLIENT_ID_AQUI';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'TU_CLIENT_SECRET_AQUI';
const REDIRECT_URI = 'http://localhost:5174';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent' // Fuerza a mostrar la pantalla de consentimiento
});

console.log('\n🔐 PASO 1: Autoriza esta app visitando esta URL:\n');
console.log(authUrl);
console.log('\n📋 PASO 2: Después de autorizar, copia el código de la URL\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('PASO 3: Pega el código aquí: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('❌ Error obteniendo token:', err);
      return;
    }
    
    console.log('\n✅ ¡Éxito! Guarda este Refresh Token:\n');
    console.log('━'.repeat(60));
    console.log(token.refresh_token);
    console.log('━'.repeat(60));
    console.log('\n📝 Configúralo en Firebase con:\n');
    console.log(`firebase functions:config:set google.refresh_token="${token.refresh_token}"`);
    console.log('\n');
  });
});
