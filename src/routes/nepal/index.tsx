import { createFileRoute, Link } from "@tanstack/react-router";
import { towns, usePlace } from "@/lib/nepal";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/nepal/")({
  head: () => ({
    meta: [
      { title: "Parts delivery across Nepal — BAATO" },
      {
        name: "description",
        content:
          "BAATO moves parts from one Valley cage through spokes in Pokhara, Butwal, Birgunj, and Biratnagar. Same day in the Valley. Next day on the highways. Quoted in the high hills.",
      },
    ],
    links: [{ rel: "canonical", href: abs("/nepal") }],
  }),
  component: NepalIndex,
});

function NepalIndex() {
  const setSlug = usePlace((s) => s.setSlug);
  const provinces = [...new Set(towns.map((t) => t.province))];
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-copper">All Nepal</p>
      <h1 className="mt-2 max-w-3xl font-display text-5xl tracking-wide">One cage. Spokes. No fake same-day.</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Stock sits in Kathmandu. Highway towns are served by a spoke, not by pretending every shop is a warehouse. Pick where the vehicle actually is.
      </p>
      {provinces.map((province) => (
        <section key={province} className="mt-10">
          <h2 className="font-display text-3xl tracking-wide">{province}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {towns
              .filter((t) => t.province === province)
              .map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/nepal/$slug"
                    params={{ slug: t.slug }}
                    onClick={() => setSlug(t.slug)}
                    className="block rounded-2xl border border-line bg-surface p-4 hover:border-copper"
                  >
                    <span className="font-display text-2xl tracking-wide">{t.name}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {t.eta} · {t.hub}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
