import { SITE_URL } from "./site-config";
import { events } from "./events-data";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...events.map((e) => ({
      url: `${SITE_URL}/events/${e.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
