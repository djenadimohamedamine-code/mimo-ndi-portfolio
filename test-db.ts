import { createBooking } from "./src/lib/bookings";

async function test() {
  console.log("🚀 Testing Firebase Connection...");
  try {
    const res = await createBooking({
      customerName: "Test Algérie",
      customerPhone: "0555001122",
      customerEmail: "test@algerie.dz",
      serviceId: "1",
      serviceName: "Coupe & Brushing",
      dateTime: new Date(),
      duration: 60,
    });
    console.log("✅ Booking Created Successfully! ID:", res.id);
    process.exit(0);
  } catch (err) {
    console.error("❌ Firebase Error:", err);
    process.exit(1);
  }
}

test();
