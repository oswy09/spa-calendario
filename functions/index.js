const {onCall} = require("firebase-functions/v2/https");
const {initializeApp, cert} = require("firebase-admin/app");
const {google} = require("googleapis");

// Inicializar Firebase Admin con Service Account
const serviceAccount = {
  type: "service_account",
  project_id: "reservas-487923",
  private_key_id: "8d77dc8bf39a50efa82603acf154fc0c02706af9",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoeR3VkZvQgDdu\nGzJNTjHS492ak2ORhIPQZUCNAdXWvi+0anOybTkGjDswC54QTXeLSBjs9p07cVup\nS/DkZbaVYaHJ6AP4FIp2qViR90LEgD5ys4hXV2klq6VpbCXOv+Tl1XhbIr+69WqU\nORjhib2hbtKu+ua74/qZzQNjx5V8VxdQXDQo5bTrVcMIOZSWyGdVyO9le4PWq2cJ\nhm2uoDqrXTUyhQCN+RR3H+ZpbGIUDBhpbjgBZER9ynWYIpXNiDUR7s0u0IMb+qB6\n1CfxeiW/j0B83JRgNGvzsnTmLPPOWYMLhgiUHPETZabkmcQi8OJcf/+I+YPK6jK6\nOzAeWArvAgMBAAECggEAGBP7Uhc17DYu9eMYLNlEoK3lcZ6oB9enGSUndR+yhrb2\nzXO7ZmBa2pc3LFY0uILB15utyEw0y5aXcZpDavkof7AM9fTdgFq7MVthp7btiXUE\nt9L15Pm+st4VzXvh6WselUSNp4TPXzKNEXMZnb5YZlaW8OA2Ettx6QJWfi+7qyHx\n+D980KY1uw7gupPvuxMjaFGOt1u24JIJTdDyACENTHwlHwvqXxZu7NSq1FuQfmI6\n/G/kjONnAO1qYqWr7QaXNvmyRlk/QVoPchZ2SrHl3sQiqURoiZo2dCw3AoLJY8Mp\nj2pM/ySdiQ7vrc+NOJ72EevBrHia862QbP9dVxJWJQKBgQDULZk5LetczPnVlvuW\nDvjc8q0G1uBpgoZ8zuLoXiF1/q7ppEJooo+KxCCv8ysTJlIGD7Fb9kMxbFFJPEaj\ngjEeVj+tFR28qRbsfEPBz38HX71GnFM3F+fjP1kSJi93CC/cu4vp2oSDsDAFvYuT\nqqI+tvJvPPXDdC//+9JUenJ7VQKBgQDLRLjdtGTNsO9G9Dy+A6qvQilzQLaQhAgA\ncJyOZm1frw9qHuWrM6sUDrR/cytn/jOawdi17A38hkNH4T+tSmkUeftRka7Lrhgr\n3bbUjCiOLsmWWi/b9qAxq640MsYvV74CdVDKWrYTuNN2TcOdVw2xyz9vIz3/KoEu\nlnTt4r2VMwKBgQDNNFiHM4D43IkX6JDjnRFU5yMuhSy+/mzBUnmjkD4+VxWlg6Zy\neh3ncC3I3Z4gRCR6Fj1LGo37w62N7czHoEeO9o1ZAR4kc0hnaPtC+0H4yMBPBSt6\nEhXD82VapzGqpnFbwsrbXephTknzk1DlfNazXs5zhPqPkNRHd64A4/fKjQKBgBwW\ngvUf2E4UBPxpA3u+RfexzMiASLnvhKuK5BdJUBPIvPiNDG971EgRQB/cakMUfU0F\nPEznMYeThfiIx6PKhHqv4GqFFwJOLEjjekAknfYHwRNlovdiPQCgGJJd8cTY+wib\n7W4I2uAeyhmu5Tj4rovC6iERXZ/E39TwNXgpvMjBAoGAGQXVn3mJRoqAW9appYdA\nDjG/PTBHSDyWRr9q9XUFy2IweGasgVxs/LHwYw8B4zAqakr78ASu+R+uHKqsacZd\n9vnATtroMEPQrFZxE1j+HTq5Q7i+mkPBvsB98N7qX2e0IerI018uZw1CRCyFZk45\nIAPAGcsglidtoqUYZxdKGqI=\n-----END PRIVATE KEY-----\n",
  client_email: "calendario-reservas@reservas-487923.iam.gserviceaccount.com",
  client_id: "104775382464303949503",
};

initializeApp({
  credential: cert(serviceAccount),
});

const CALENDAR_ID = "primary";

exports.createCalendarEvent = onCall(async (request) => {
  const {
    bookingId,
    serviceName,
    servicePrice,
    serviceDuration,
    bookingDate,
    bookingTime,
    clientName,
    clientEmail,
    clientPhone,
  } = request.data;

  try {
    console.log("📅 Creando evento en Google Calendar para:", serviceName);

    // Parsear la hora
    const timeMatch = bookingTime.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!timeMatch) {
      throw new Error("Formato de hora inválido");
    }

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3];

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    // Crear fecha de inicio
    const startDate = new Date(bookingDate);
    startDate.setHours(hours, minutes, 0, 0);

    // Calcular duración
    const durationMatch = serviceDuration.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60;
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Configurar Google Calendar API con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({version: "v3", auth});

    // Crear evento
    const event = {
      summary: `${serviceName} - ${clientName}`,
      location: "Aura Studio - Calle 123 #45-67",
      description: `Reserva en Aura Studio

Servicio: ${serviceName}
Duración: ${serviceDuration}
Precio: $${servicePrice.toLocaleString("es-CO")} COP

Cliente:
Nombre: ${clientName}
Email: ${clientEmail}
Teléfono: ${clientPhone}

ID de reserva: ${bookingId}

Contacto del spa:
Teléfono: +57 305 750 2790`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Bogota",
      },
      attendees: [
        {email: clientEmail},
      ],
      reminders: {
        useDefault: false,
        overrides: [
          {method: "email", minutes: 24 * 60},
          {method: "popup", minutes: 60},
        ],
      },
      colorId: "10",
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
      sendUpdates: "all",
    });

    console.log("✅ Evento creado exitosamente:", response.data.id);

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error("❌ Error creando evento:", error.message);
    throw new Error(`Error al crear evento: ${error.message}`);
  }
});
