import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DemoBanner from "../../components/DemoBanner";
import OrderConfirmation from "../../components/OrderConfirmation";

export const metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default async function OrderPage({ params }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <DemoBanner />
      <main className="section flow-page">
        <OrderConfirmation orderId={id} />
      </main>
      <Footer />
    </>
  );
}
