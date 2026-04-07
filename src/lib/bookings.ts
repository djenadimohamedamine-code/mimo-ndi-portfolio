import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface Booking {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  dateTime: Date;
  duration: number; // in minutes
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

// Collections
const bookingsCol = collection(db, "bookings");
const servicesCol = collection(db, "services");

// Bookings
export const createBooking = async (booking: Omit<Booking, "id" | "createdAt" | "status">) => {
  return await addDoc(bookingsCol, {
    ...booking,
    createdAt: Timestamp.now(),
    status: 'confirmed', // Auto-confirm for now
    dateTime: Timestamp.fromDate(booking.dateTime),
  });
};

export const getBookingsByDate = async (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    bookingsCol,
    where("dateTime", ">=", Timestamp.fromDate(startOfDay)),
    where("dateTime", "<=", Timestamp.fromDate(endOfDay)),
    orderBy("dateTime", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dateTime: (doc.data().dateTime as Timestamp).toDate(),
  })) as Booking[];
};

// Real-time listener for admin
export const subscribeToBookings = (callback: (bookings: Booking[]) => void) => {
  const q = query(bookingsCol, orderBy("dateTime", "desc"));
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateTime: (doc.data().dateTime as Timestamp).toDate(),
    })) as Booking[];
    callback(bookings);
  });
};

// Check availability
export const isSlotAvailable = async (dateTime: Date, duration: number) => {
  const start = Timestamp.fromDate(dateTime);
  const end = Timestamp.fromDate(new Date(dateTime.getTime() + duration * 60000));

  // Check for any booking that overlaps with this range
  const q = query(
    bookingsCol,
    where("dateTime", "<", end),
    orderBy("dateTime", "desc")
  );

  const snapshot = await getDocs(q);
  const overlapping = snapshot.docs.find(doc => {
    const b = doc.data();
    const bStart = (b.dateTime as Timestamp).toDate().getTime();
    const bEnd = bStart + b.duration * 60000;
    const reqStart = dateTime.getTime();
    const reqEnd = reqStart + duration * 60000;

    return bStart < reqEnd && bEnd > reqStart;
  });

  return !overlapping;
};
