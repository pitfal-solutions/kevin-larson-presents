import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EventPageHero from "../../components/EventPageHero";
import EventDetails from "../../components/EventDetails";
import EventGallery from "../../components/EventGallery";
import MoreEvents from "../../components/MoreEvents";
import { events, getEvent } from "../../events-data";
import { SITE_URL } from "../../site-config";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};

  const description = `${event.theme} — ${event.tagline} ${event.venue}, ${event.dateLabel}.`;
  const imageUrl = event.hasPhotos
    ? `${SITE_URL}/images/events/${event.slug}/hero.jpg`
    : undefined;

  return {
    title: event.name,
    description,
    openGraph: {
      title: `${event.name} | Kevin Larson Presents`,
      description,
      url: `${SITE_URL}/events/${event.slug}`,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} | Kevin Larson Presents`,
      description,
    },
  };
}

function eventJsonLd(event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: `${event.theme} — ${event.tagline}`,
    startDate: event.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: event.hasPhotos
      ? [`${SITE_URL}/images/events/${event.slug}/hero.jpg`]
      : undefined,
    location: {
      "@type": "Place",
      name: event.venue,
      address: event.address,
    },
    organizer: {
      "@type": "Organization",
      name: "Kevin Larson Presents",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: event.ticketUrl,
      availability: "https://schema.org/InStock",
    },
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event)) }}
      />
      <Header />
      <main>
        <EventPageHero event={event} />
        <EventDetails event={event} />
        <EventGallery event={event} />
        <MoreEvents excludeSlug={event.slug} />
      </main>
      <Footer />
    </>
  );
}
