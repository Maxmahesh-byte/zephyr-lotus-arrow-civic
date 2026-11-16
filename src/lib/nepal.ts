import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Town = {
  slug: string;
  name: string;
  province: string;
  hub: string;
  eta: string;
  promise: string;
  garage?: string;
};

export const towns: Town[] = [
  { slug: "kathmandu", name: "Kathmandu", province: "Bagmati", hub: "Valley cage", eta: "Same day", promise: "In-stock lines leave before 14:00. After that, next morning.", garage: "koteshwor" },
  { slug: "lalitpur", name: "Lalitpur", province: "Bagmati", hub: "Valley cage", eta: "Same day", promise: "Patan and Satdobato ride with the Valley run.", garage: "koteshwor" },
  { slug: "bhaktapur", name: "Bhaktapur", province: "Bagmati", hub: "Valley cage", eta: "Same day", promise: "East Valley is still the same cage, not a separate warehouse." },
  { slug: "bharatpur", name: "Bharatpur", province: "Bagmati", hub: "Hetauda spoke", eta: "Next day", promise: "Chitwan gets the morning truck off the Valley cage." },
  { slug: "hetauda", name: "Hetauda", province: "Bagmati", hub: "Hetauda spoke", eta: "Next day", promise: "The spoke breaks bulk. Your town does not wait on a full truck." },
  { slug: "pokhara", name: "Pokhara", province: "Gandaki", hub: "Pokhara spoke", eta: "Next day", promise: "Prithvi Highway overnight. In-spoke stock can be same day.", garage: "pokhara" },
  { slug: "butwal", name: "Butwal", province: "Lumbini", hub: "Butwal spoke", eta: "Next day", promise: "West highway hub. Corridor towns pull from here, not from Kathmandu one by one.", garage: "butwal" },
  { slug: "nepalgunj", name: "Nepalgunj", province: "Lumbini", hub: "Butwal spoke", eta: "Two days", promise: "Two hops: cage to Butwal, Butwal to the west." },
  { slug: "dhangadhi", name: "Dhangadhi", province: "Sudurpashchim", hub: "Butwal spoke", eta: "Two days", promise: "Far west is scheduled, not wished. Miss the Butwal truck and it is the next one." },
  { slug: "birgunj", name: "Birgunj", province: "Madhesh", hub: "Birgunj spoke", eta: "Next day", promise: "Border town. Parts and the return of bad parts both move on this lane." },
  { slug: "janakpur", name: "Janakpur", province: "Madhesh", hub: "Birgunj spoke", eta: "Two days", promise: "East Tarai off the Birgunj spoke. Not a Valley rider." },
  { slug: "biratnagar", name: "Biratnagar", province: "Koshi", hub: "Biratnagar spoke", eta: "Next day", promise: "East hub. The overnight bus lane carries the cage box." },
  { slug: "dharan", name: "Dharan", province: "Koshi", hub: "Biratnagar spoke", eta: "Next day", promise: "Same east spoke as Itahari. Hill road after the hub is still next day if the box left on time." },
  { slug: "itahari", name: "Itahari", province: "Koshi", hub: "Biratnagar spoke", eta: "Next day", promise: "Junction town. The spoke drops here before Damak." },
  { slug: "damak", name: "Damak", province: "Koshi", hub: "Biratnagar spoke", eta: "Two days", promise: "End of the east lane. Two days is the promise. Same day is a lie." },
  { slug: "jumla", name: "Jumla", province: "Karnali", hub: "Nepalgunj spoke", eta: "Quoted", promise: "No pretended SLA. The desk quotes the flight or the jeep after the part is in Nepalgunj." },
];

export function townBySlug(slug: string) {
  return towns.find((t) => t.slug === slug);
}

type PlaceState = {
  slug: string;
  setSlug: (slug: string) => void;
};

export const usePlace = create<PlaceState>()(
  persist(
    (set) => ({
      slug: "kathmandu",
      setSlug: (slug) => set({ slug }),
    }),
    { name: "baato-place" },
  ),
);
