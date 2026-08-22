import { SOCIAL_LINKS, TAGLINE } from "../site-config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="brand">
          <span className="brand__flame" aria-hidden="true">
            🔥
          </span>
          <span className="brand__name">Kevin Larson Presents</span>
        </div>
        <p className="site-footer__tagline">{TAGLINE}</p>
        <div className="site-footer__social">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
        </div>
        <p className="site-footer__fine-print">
          Demo built for Kevin Larson Presents — not a live ticketing site.
          Event details sourced from kevinlarsonpresents.com and its event
          pages.
        </p>
      </div>
    </footer>
  );
}
