import Header from "./components/Header";
import Hero from "./components/Hero";
import EventsGrid from "./components/EventsGrid";
import PastEvents from "./components/PastEvents";
import VideoSection from "./components/VideoSection";
import PressMarquee from "./components/PressMarquee";
import Membership from "./components/Membership";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import { events } from "./events-data";
import { SITE_URL } from "./site-config";

function buildEventJsonLd(event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: `${event.theme} — ${event.tagline}`,
    startDate: event.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
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

export default function Home() {
  return (
    <>
      {events.map((event) => (
        <script
          key={event.slug}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildEventJsonLd(event)),
          }}
        />
      ))}
      <Header />
      <main>
        <Hero />
        <EventsGrid />
        <PastEvents />
        <VideoSection />
        <PressMarquee />
        <Membership />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
