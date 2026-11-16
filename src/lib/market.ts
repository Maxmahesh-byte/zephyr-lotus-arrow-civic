import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parts } from "@/lib/catalog";

export type Vendor = {
  id: string;
  name: string;
  city: string;
  area: string;
  phone: string;
  note: string;
};

export type Garage = {
  slug: string;
  name: string;
  city: string;
  area: string;
  phone: string;
  hours: string;
  blurb: string;
};

export type Offer = {
  vendorId: string;
  slug: string;
  price: number;
  inStock: boolean;
};

export const vendors: Vendor[] = [
  {
    id: "kalimati",
    name: "Kalimati Motor Spares",
    city: "Kathmandu",
    area: "Kalimati",
    phone: "9779801001100",
    note: "Same-day rider inside the Valley for in-stock lines.",
  },
  {
    id: "chainhouse",
    name: "Valley Chain House",
    city: "Kathmandu",
    area: "Koteshwor",
    phone: "9779801002200",
    note: "Drive kits and brake parts. Will not sell a chain without the sprocket.",
  },
  {
    id: "pokhara",
    name: "Lakeside Parts",
    city: "Pokhara",
    area: "Lakeside",
    phone: "9779801003300",
    note: "Next-day from the Valley cage, same-day if it is already on their shelf.",
  },
];

export const garages: Garage[] = [
  {
    slug: "koteshwor",
    name: "BAATO Garage Koteshwor",
    city: "Kathmandu",
    area: "Koteshwor",
    phone: "9779802001100",
    hours: "08:00–19:00",
    blurb: "Branded bay for bikes and small cars. Labour is listed. Parts come from a BAATO vendor, not a drawer of unmarked boxes.",
  },
  {
    slug: "pokhara",
    name: "BAATO Garage Pokhara",
    city: "Pokhara",
    area: "Chipledhunga",
    phone: "9779802002200",
    hours: "08:00–18:30",
    blurb: "Same service menu and same labour card as Kathmandu. The bay, not a random workshop, owns the job.",
  },
  {
    slug: "butwal",
    name: "BAATO Garage Butwal",
    city: "Butwal",
    area: "Traffic Chowk",
    phone: "9779802003300",
    hours: "08:00–18:30",
    blurb: "Corridor garage for highway bikes and Alto/i10 traffic. Book on WhatsApp, arrive with the model year.",
  },
];

export const services = [
  { id: "service", name: "Periodic service", price: 1500, detail: "Oil, filter, chain lube, and a written checklist." },
  { id: "brake", name: "Brake job", price: 800, detail: "Pads or shoes plus bed-in. Parts billed separate." },
  { id: "chain", name: "Chain and sprocket", price: 600, detail: "Fit a matched kit. Old sprocket is not reused." },
  { id: "battery", name: "Battery and charging test", price: 400, detail: "Install and a regulator check before you leave." },
  { id: "inspect", name: "Pre-buy inspection", price: 1200, detail: "A one-page report on a used bike or small car." },
];

function seedOffers(): Offer[] {
  const picks: Record<string, string[]> = {
    kalimati: parts.slice(0, 8).map((p) => p.slug),
    chainhouse: parts.filter((p) => p.category === "chains" || p.category === "brakes").map((p) => p.slug),
    pokhara: parts.filter((p) => p.category === "filters" || p.category === "electrical").map((p) => p.slug),
  };
  const out: Offer[] = [];
  for (const vendor of vendors) {
    for (const slug of picks[vendor.id] ?? []) {
      const part = parts.find((p) => p.slug === slug);
      if (!part) continue;
      const bump = vendor.id === "pokhara" ? 150 : vendor.id === "chainhouse" ? -80 : 0;
      out.push({ vendorId: vendor.id, slug, price: Math.max(100, part.price + bump), inStock: true });
    }
  }
  return out;
}

type MarketState = {
  offers: Offer[];
  actingVendorId: string;
  setActingVendor: (id: string) => void;
  toggle: (vendorId: string, slug: string, listPrice: number) => void;
  setPrice: (vendorId: string, slug: string, price: number) => void;
};

export const useMarket = create<MarketState>()(
  persist(
    (set) => ({
      offers: seedOffers(),
      actingVendorId: "kalimati",
      setActingVendor: (id) => set({ actingVendorId: id }),
      toggle: (vendorId, slug, listPrice) =>
        set((s) => {
          const hit = s.offers.find((o) => o.vendorId === vendorId && o.slug === slug);
          if (!hit) return { offers: [...s.offers, { vendorId, slug, price: listPrice, inStock: true }] };
          if (hit.inStock) {
            return { offers: s.offers.map((o) => (o === hit ? { ...o, inStock: false } : o)) };
          }
          return { offers: s.offers.map((o) => (o === hit ? { ...o, inStock: true } : o)) };
        }),
      setPrice: (vendorId, slug, price) =>
        set((s) => ({
          offers: s.offers.map((o) =>
            o.vendorId === vendorId && o.slug === slug ? { ...o, price: Math.max(0, price) } : o,
          ),
        })),
    }),
    { name: "baato-market" },
  ),
);

export function vendorById(id: string) {
  return vendors.find((v) => v.id === id);
}

export function garageBySlug(slug: string) {
  return garages.find((g) => g.slug === slug);
}

export function liveOffers(offers: Offer[], slug: string) {
  return offers
    .filter((o) => o.slug === slug && o.inStock)
    .slice()
    .sort((a, b) => a.price - b.price);
}
