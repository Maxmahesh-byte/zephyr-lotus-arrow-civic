import { createFileRoute, Link } from "@tanstack/react-router";
import { garages, services } from "@/lib/market";
import { abs } from "@/lib/site";
import { npr } from "@/lib/utils";

export const Route = createFileRoute("/garages/")({
  head: () => ({
    meta: [
      { title: "BAATO Garage — branded workshops in Nepal" },
      {
        name: "description",
        content:
          "Book a BAATO Garage in Kathmandu, Pokhara, or Butwal. Same labour card, named services, WhatsApp or phone.",
      },
    ],
    links: [{ rel: "canonical", href: abs("/garages") }],
  }),
  component: Garages,
});

function Garages() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-copper">Garages</p>
      <h1 className="mt-2 max-w-2xl font-display text-5xl tracking-wide">One brand. The bay you can name.</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Book a bay slot, ask for pickup, or leave a number for a callback. WhatsApp and a direct call stay open. Labour is the same card in every city.
      </p>
      <p className="mt-4">
        <Link to="/garages/join" className="text-sm text-copper">
          Run a workshop? Walk it onto the brand
        </Link>
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {services.map((s) => (
          <li key={s.id} className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-display text-2xl tracking-wide">{s.name}</p>
            <p className="mt-1 text-sm text-muted">{s.detail}</p>
            <p className="mt-3 tabular-nums">{npr(s.price)} labour</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {garages.map((g) => (
          <Link key={g.slug} to="/garages/$slug" params={{ slug: g.slug }} className="rounded-2xl border border-line bg-surface p-5 hover:border-copper">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{g.city}</p>
            <h2 className="mt-1 font-display text-3xl tracking-wide">{g.name}</h2>
            <p className="mt-2 text-sm text-muted">{g.area} · {g.hours}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
