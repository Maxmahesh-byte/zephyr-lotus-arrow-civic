import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { JsonLd } from "@/components/json-ld";
import { garageBySlug } from "@/lib/market";
import { townBySlug, usePlace } from "@/lib/nepal";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/nepal/$slug")({
  loader: ({ params }) => {
    const town = townBySlug(params.slug);
    if (!town) throw notFound();
    return { town };
  },
  head: ({ loaderData }) => {
    const town = loaderData?.town;
    if (!town) return { meta: [{ title: "Town — BAATO" }] };
    return {
      meta: [
        { title: `Vehicle parts in ${town.name} — ${town.eta} | BAATO` },
        {
          name: "description",
          content: `${town.name}, ${town.province}: ${town.promise} Parts move ${town.hub}.`,
        },
      ],
      links: [{ rel: "canonical", href: abs(`/nepal/${town.slug}`) }],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl">That town is not on a lane yet</h1>
      <Link to="/nepal" className="mt-4 inline-block text-copper">
        All lanes
      </Link>
    </main>
  ),
  component: TownPage,
});

function TownPage() {
  const { town } = Route.useLoaderData();
  const setSlug = usePlace((s) => s.setSlug);
  const garage = town.garage ? garageBySlug(town.garage) : undefined;
  useEffect(() => {
    setSlug(town.slug);
  }, [setSlug, town.slug]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Vehicle parts delivery in ${town.name}`,
          areaServed: { "@type": "City", name: town.name },
          provider: { "@type": "Organization", name: "BAATO" },
          description: town.promise,
        }}
      />
      <p className="text-xs uppercase tracking-[0.18em] text-copper">{town.province}</p>
      <h1 className="mt-2 font-display text-5xl tracking-wide">Parts in {town.name}</h1>
      <p className="mt-3 text-muted">{town.promise}</p>
      <dl className="mt-8 divide-y divide-line border-y border-line">
        <div className="flex justify-between gap-4 py-3 text-sm">
          <dt className="text-muted">Promise</dt>
          <dd>{town.eta}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3 text-sm">
          <dt className="text-muted">Lane</dt>
          <dd>{town.hub}</dd>
        </div>
      </dl>
      <ol className="mt-8 grid gap-3">
        {["Valley cage picks the SKU", `${town.hub} receives the box`, `${town.name} gets ${town.eta.toLowerCase()}`].map((step, i) => (
          <li key={step} className="rounded-2xl border border-line bg-surface p-4">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">Hop {i + 1}</span>
            <span className="mt-1 block font-display text-2xl tracking-wide">{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/parts" search={{}} className="inline-flex h-12 items-center rounded-full bg-copper px-6 text-sm font-medium text-bg">
          Order for {town.name}
        </Link>
        {garage && (
          <Link to="/garages/$slug" params={{ slug: garage.slug }} className="inline-flex h-12 items-center rounded-full border border-line px-6 text-sm">
            {garage.name}
          </Link>
        )}
      </div>
    </main>
  );
}
