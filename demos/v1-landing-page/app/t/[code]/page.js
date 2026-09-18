import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DemoBanner from "../../components/DemoBanner";
import TicketView from "../../components/TicketView";

export const metadata = {
  title: "Your ticket",
  robots: { index: false },
};

export default async function TicketPage({ params }) {
  const { code } = await params;
  return (
    <>
      <Header />
      <DemoBanner />
      <main className="section flow-page flow-page--narrow">
        <TicketView code={code} />
      </main>
      <Footer />
    </>
  );
}
