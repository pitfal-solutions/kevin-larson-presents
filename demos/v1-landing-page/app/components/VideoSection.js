// Real KLP recap video, embedded from kevinlarsonpresents.com (2026-08-23).
const YOUTUBE_ID = "UoX8UOkA5Tg";

export default function VideoSection() {
  return (
    <section className="section video-section">
      <div className="section__header">
        <p className="section__eyebrow">See It For Yourself</p>
        <h2 className="section__title">Watch the Vibe</h2>
      </div>
      <div className="video-section__frame">
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?wmode=transparent`}
          title="Kevin Larson Presents recap video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
