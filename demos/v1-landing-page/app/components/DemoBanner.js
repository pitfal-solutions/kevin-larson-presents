// Shown on every checkout/order/ticket page so the demo purchase flow can
// never be mistaken for a live one. Remove when real payments are wired up.
export default function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <strong>Demo checkout.</strong> No payment is taken and nothing is
      charged &mdash; this shows what buying a ticket on kevinlarsonpresents.com
      would feel like.
    </div>
  );
}
