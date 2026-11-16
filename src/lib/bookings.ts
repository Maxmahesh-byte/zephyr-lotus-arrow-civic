import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingKind = "slot" | "pickup" | "callback";

export type Booking = {
  id: string;
  garage: string;
  kind: BookingKind;
  service: string;
  when: string;
  name: string;
  phone: string;
  note: string;
};

export const slots = ["08:30–10:30", "11:00–13:00", "14:00–16:00", "16:30–18:30"];

export function upcomingDays(count = 4) {
  const out: { iso: string; label: string }[] = [];
  const start = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    out.push({ iso, label });
  }
  return out;
}

type BookState = {
  bookings: Booking[];
  add: (b: Omit<Booking, "id">) => void;
};

export const useBookings = create<BookState>()(
  persist(
    (set) => ({
      bookings: [],
      add: (b) =>
        set((s) => ({
          bookings: [{ ...b, id: `${Date.now()}` }, ...s.bookings].slice(0, 20),
        })),
    }),
    { name: "baato-bookings" },
  ),
);

export const brandSteps = [
  { id: "card", title: "Labour card", detail: "Publish the BAATO prices. No verbal discounts at the bay." },
  { id: "parts", title: "Named parts", detail: "Buy wear items from a BAATO vendor. No unmarked boxes on the job." },
  { id: "card-out", title: "Written job card", detail: "The customer leaves with the checklist, not a shrug." },
  { id: "hours", title: "Posted hours", detail: "The door hours match the page. Late work is a booked slot, not a surprise." },
  { id: "phone", title: "One desk number", detail: "WhatsApp and calls hit the bay, not a personal SIM that changes." },
  { id: "sign", title: "The sign", detail: "BAATO Garage on the shutter. The old shop name can stay smaller underneath." },
  { id: "tech", title: "One trained tech", detail: "Someone on the floor can run the checklist without the owner present." },
] as const;
