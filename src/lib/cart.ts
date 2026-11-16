import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { slug: string; qty: number; vendorId?: string };

type CartState = {
  lines: CartLine[];
  add: (slug: string, qty?: number, vendorId?: string) => void;
  setQty: (slug: string, qty: number, vendorId?: string) => void;
  remove: (slug: string, vendorId?: string) => void;
  clear: () => void;
};

function same(a: CartLine, slug: string, vendorId?: string) {
  return a.slug === slug && (a.vendorId ?? "") === (vendorId ?? "");
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, qty = 1, vendorId) =>
        set((s) => {
          const hit = s.lines.find((l) => same(l, slug, vendorId));
          if (hit) {
            return {
              lines: s.lines.map((l) =>
                same(l, slug, vendorId) ? { ...l, qty: Math.min(99, l.qty + qty) } : l,
              ),
            };
          }
          return { lines: [...s.lines, { slug, qty, vendorId }] };
        }),
      setQty: (slug, qty, vendorId) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => !same(l, slug, vendorId))
              : s.lines.map((l) => (same(l, slug, vendorId) ? { ...l, qty: Math.min(99, qty) } : l)),
        })),
      remove: (slug, vendorId) => set((s) => ({ lines: s.lines.filter((l) => !same(l, slug, vendorId)) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "baato-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}
