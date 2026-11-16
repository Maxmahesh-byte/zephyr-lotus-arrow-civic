import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { slots, upcomingDays, useBookings, type BookingKind } from "@/lib/bookings";
import { garageBySlug, services } from "@/lib/market";
import { telHref, waHref } from "@/lib/phone";
import { abs } from "@/lib/site";
import { npr } from "@/lib/utils";

export const Route = createFileRoute("/garages/$slug")({
  loader: ({ params }) => {
    const garage = garageBySlug(params.slug);
    if (!garage) throw notFound();
    return { garage };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.garage;
    if (!g) return { meta: [{ title: "Garage — BAATO" }] };
    return {
      meta: [
        { title: `${g.name} — book a bay` },
        { name: "description", content: g.blurb },
      ],
      links: [{ rel: "canonical", href: abs(`/garages/${g.slug}`) }],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl">That bay is not open</h1>
      <Link to="/garages" className="mt-4 inline-block text-copper">
        All garages
      </Link>
    </main>
  ),
  component: GaragePage,
});

const methods: { id: BookingKind | "whatsapp" | "call"; label: string }[] = [
  { id: "slot", label: "Bay slot" },
  { id: "pickup", label: "Pickup" },
  { id: "callback", label: "Call me" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Call now" },
];

function GaragePage() {
  const { garage } = Route.useLoaderData();
  const add = useBookings((s) => s.add);
  const bookings = useBookings((s) => s.bookings);
  const [job, setJob] = useState(services[0].id);
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("slot");
  const days = upcomingDays();
  const [day, setDay] = useState(days[0].iso);
  const [slot, setSlot] = useState(slots[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [done, setDone] = useState("");
  const service = services.find((s) => s.id === job) ?? services[0];
  const text = `BAATO Garage ${garage.city}: book ${service.name} (${npr(service.price)} labour). I will send the vehicle model.`;
  const taken = new Set(
    bookings.filter((b) => b.garage === garage.slug && b.kind === "slot" && b.when.startsWith(day)).map((b) => b.when.split(" · ")[1]),
  );

  function confirm(kind: BookingKind, when: string, note: string) {
    if (!name.trim() || phone.trim().length < 8) return;
    add({ garage: garage.slug, kind, service: service.name, when, name: name.trim(), phone: phone.trim(), note });
    setDone(`${service.name} · ${when}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-copper">{garage.city}</p>
      <h1 className="mt-2 font-display text-5xl tracking-wide">{garage.name}</h1>
      <p className="mt-3 text-muted">{garage.blurb}</p>
      <p className="mt-2 text-sm text-muted">
        {garage.area} · {garage.hours}
      </p>

      <fieldset className="mt-8">
        <legend className="font-display text-2xl tracking-wide">Labour card</legend>
        <div className="mt-3 grid gap-2">
          {services.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4">
              <input type="radio" name="job" className="mt-1 accent-copper" checked={job === s.id} onChange={() => setJob(s.id)} />
              <span>
                <span className="block font-medium">
                  {s.name} · {npr(s.price)}
                </span>
                <span className="text-sm text-muted">{s.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="How to book">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={method === m.id}
            onClick={() => {
              setMethod(m.id);
              setDone("");
            }}
            className={`h-11 rounded-full border px-4 text-sm ${method === m.id ? "border-copper text-copper" : "border-line text-muted"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {done && <p className="mt-4 rounded-2xl border border-line bg-surface p-4 text-sm">Held on this desk: {done}. The bay sees the same list.</p>}

      {method === "slot" && (
        <form
          className="mt-4 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            confirm("slot", `${day} · ${slot}`, "");
          }}
        >
          <p className="text-sm text-muted">A bay is held for that window. Two jobs do not share it.</p>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDay(d.iso)}
                className={`h-11 rounded-full border px-4 text-sm ${day === d.iso ? "border-copper text-fg" : "border-line text-muted"}`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                disabled={taken.has(s)}
                onClick={() => setSlot(s)}
                className={`h-11 rounded-full border px-4 text-sm disabled:opacity-40 ${slot === s ? "border-copper text-fg" : "border-line text-muted"}`}
              >
                {taken.has(s) ? `${s} taken` : s}
              </button>
            ))}
          </div>
          <ContactFields name={name} phone={phone} setName={setName} setPhone={setPhone} />
          <button type="submit" className="h-12 rounded-full bg-copper text-sm font-medium text-bg">
            Hold this bay
          </button>
        </form>
      )}

      {method === "pickup" && (
        <form
          className="mt-4 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            confirm("pickup", `${day} pickup`, address.trim());
          }}
        >
          <p className="text-sm text-muted">The bay collects the vehicle inside the city and returns it after the job. Labour is the card. Pickup is quoted on the call if you are outside the area.</p>
          <label className="grid gap-1 text-sm">
            Pickup address
            <input required value={address} onChange={(e) => setAddress(e.target.value)} className="h-12 rounded-xl border border-line bg-surface px-3" />
          </label>
          <label className="grid gap-1 text-sm">
            Day
            <select value={day} onChange={(e) => setDay(e.target.value)} className="h-12 rounded-xl border border-line bg-surface px-3">
              {days.map((d) => (
                <option key={d.iso} value={d.iso}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <ContactFields name={name} phone={phone} setName={setName} setPhone={setPhone} />
          <button type="submit" className="h-12 rounded-full bg-copper text-sm font-medium text-bg">
            Request pickup
          </button>
        </form>
      )}

      {method === "callback" && (
        <form
          className="mt-4 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            confirm("callback", "Callback today", "");
          }}
        >
          <p className="text-sm text-muted">Leave a number. The bay calls back to lock the job. You do not have to pick a slot first.</p>
          <ContactFields name={name} phone={phone} setName={setName} setPhone={setPhone} />
          <button type="submit" className="h-12 rounded-full bg-copper text-sm font-medium text-bg">
            Ask for a callback
          </button>
        </form>
      )}

      {method === "whatsapp" && (
        <p className="mt-4">
          <a href={waHref(garage.phone, text)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full bg-copper px-6 text-sm font-medium text-bg">
            Open WhatsApp
          </a>
        </p>
      )}

      {method === "call" && (
        <p className="mt-4">
          <a href={telHref(garage.phone)} className="inline-flex h-12 items-center rounded-full bg-copper px-6 text-sm font-medium text-bg">
            Call the bay
          </a>
        </p>
      )}
    </main>
  );
}

function ContactFields({
  name,
  phone,
  setName,
  setPhone,
}: {
  name: string;
  phone: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1 text-sm">
        Name
        <input required value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl border border-line bg-surface px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        Phone
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 rounded-xl border border-line bg-surface px-3" />
      </label>
    </div>
  );
}
