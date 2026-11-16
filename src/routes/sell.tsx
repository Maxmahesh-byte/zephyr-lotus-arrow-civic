import { createFileRoute } from "@tanstack/react-router";
import { parts } from "@/lib/catalog";
import { useMarket, vendors } from "@/lib/market";
import { abs } from "@/lib/site";
import { npr } from "@/lib/utils";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Vendor desk — mark stock and price | BAATO" },
      {
        name: "description",
        content: "Vendors check the parts they actually hold and set the NPR price customers see.",
      },
    ],
    links: [{ rel: "canonical", href: abs("/sell") }],
  }),
  component: Sell,
});

function Sell() {
  const offers = useMarket((s) => s.offers);
  const acting = useMarket((s) => s.actingVendorId);
  const setActing = useMarket((s) => s.setActingVendor);
  const toggle = useMarket((s) => s.toggle);
  const setPrice = useMarket((s) => s.setPrice);
  const vendor = vendors.find((v) => v.id === acting) ?? vendors[0];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-copper">Vendor</p>
      <h1 className="mt-2 font-display text-5xl tracking-wide">Check what you hold.</h1>
      <p className="mt-3 text-sm text-muted">
        A checked line is live for customers, with your price, WhatsApp, and phone. Uncheck it and it leaves the shelf.
      </p>
      <label className="mt-6 block text-sm">
        Acting as
        <select
          value={vendor.id}
          onChange={(e) => setActing(e.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-surface px-3"
        >
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {v.area}
            </option>
          ))}
        </select>
      </label>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {parts.map((part) => {
          const offer = offers.find((o) => o.vendorId === vendor.id && o.slug === part.slug);
          const on = Boolean(offer?.inStock);
          return (
            <li key={part.slug} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <label className="flex min-w-0 flex-1 items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 size-5 accent-copper"
                  checked={on}
                  onChange={() => toggle(vendor.id, part.slug, part.price)}
                />
                <span>
                  <span className="block font-medium">{part.name}</span>
                  <span className="text-sm text-muted">
                    List {npr(part.price)} · {part.sku}
                  </span>
                </span>
              </label>
              <label className="text-sm text-muted">
                Your price
                <input
                  type="number"
                  min={0}
                  disabled={!offer}
                  value={offer?.price ?? part.price}
                  onChange={(e) => setPrice(vendor.id, part.slug, Number(e.target.value))}
                  className="mt-1 h-11 w-36 rounded-xl border border-line bg-surface px-3 text-fg disabled:opacity-40"
                />
              </label>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
