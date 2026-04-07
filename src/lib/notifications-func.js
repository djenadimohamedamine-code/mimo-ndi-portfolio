const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifySalonOnBooking = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snapshot, context) => {
    const booking = snapshot.data();

    // Notification payload
    const payload = {
      notification: {
        title: "Nouveau rendez-vous ! ✂️",
        body: `${booking.customerName} a réservé pour ${booking.serviceName}.`,
        clickAction: "FLUTTER_NOTIFICATION_CLICK", // or your admin URL
      },
    };

    // Get Admin Tokens from settings
    const settingsDoc = await admin.firestore().collection("settings").doc("admin").get();
    const tokens = settingsDoc.data().notificationTokens || [];

    if (tokens.length > 0) {
      return admin.messaging().sendToDevice(tokens, payload);
    }
  });
