import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { brandSteps } from "@/lib/bookings";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/garages/join")({
  head: () => ({
    meta: [
      { title: "Turn a workshop into a BAATO Garage" },
      {
        name: "description",
        content:
          "The path from an independent Nepali workshop to a branded BAATO bay: labour card, named parts, job card, hours, one number, the sign, one trained tech.",
      },
    ],
    links: [{ rel: "canonical", href: abs("/garages/join") }],
  }),
  component: Join,
});

function Join() {
  const [shop, setShop] = useState("");
  const [city, setCity] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const ready = done.length === brandSteps.length && shop.trim().length > 1 && city.trim().length > 1;

  function flip(id: string) {
    setDone((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-copper">From workshop to brand</p>
      <h1 className="mt-2 font-display text-5xl tracking-wide">Same bay. A name people can trust.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        An independent garage already has the tools. What it does not have is one price, one parts source, and a job card the customer can read. BAATO Garage is that layer. Tick the standard. When every line is true, the shop can carry the sign.
      </p>
      <ol className="mt-8 grid gap-3">
        {brandSteps.map((step, i) => {
          const on = done.includes(step.id);
          return (
            <li key={step.id}>
              <label className="flex cursor-pointer gap-4 rounded-2xl border border-line bg-surface p-4">
                <input type="checkbox" className="mt-1 size-5 accent-copper" checked={on} onChange={() => flip(step.id)} />
                <span>
                  <span className="text-xs uppercase tracking-[0.16em] text-muted">Step {i + 1}</span>
                  <span className="mt-1 block font-display text-2xl tracking-wide">{step.title}</span>
                  <span className="mt-1 block text-sm text-muted">{step.detail}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm text-muted">
        {done.length} of {brandSteps.length} standards in place.
      </p>
      {sent ? (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-4 text-sm">
          {shop} in {city} is on the brand list for this desk. A live network would send the sign kit and the first labour card after a bay visit.
        </p>
      ) : (
        <form
          className="mt-6 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!ready) return;
            setSent(true);
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Workshop name
              <input required value={shop} onChange={(e) => setShop(e.target.value)} className="h-12 rounded-xl border border-line bg-surface px-3" />
            </label>
            <label className="grid gap-1 text-sm">
              City
              <input required value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-xl border border-line bg-surface px-3" />
            </label>
          </div>
          <button type="submit" disabled={!ready} className="h-12 rounded-full bg-copper text-sm font-medium text-bg disabled:opacity-40">
            {ready ? "Request the BAATO sign" : "Finish the standard first"}
          </button>
        </form>
      )}
      <p className="mt-6 text-sm">
        <Link to="/garages" className="text-copper">
          See bays already on the brand
        </Link>
      </p>
    </main>
  );
}
