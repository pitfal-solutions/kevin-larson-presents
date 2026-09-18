import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DemoBanner from "../../components/DemoBanner";
import CheckoutForm from "../../components/CheckoutForm";
import { events, getEvent } from "../../events-data";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  return event
    ? { title: `Checkout — ${event.name}`, robots: { index: false } }
    : {};
}

export default async function CheckoutPage({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <Header />
      <DemoBanner />
      <main className="section flow-page">
        <p className="section__eyebrow">Checkout</p>
        <h1 className="section__title flow-page__title">{event.name}</h1>
        <Suspense fallback={<p className="checkout__hint">Loading your selection…</p>}>
          <CheckoutForm event={event} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
