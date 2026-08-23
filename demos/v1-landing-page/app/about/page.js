import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutHero from "../components/AboutHero";
import MeetTheVisionary from "../components/MeetTheVisionary";
import ShoutoutColorado from "../components/ShoutoutColorado";
import MeetTheTeam from "../components/MeetTheTeam";
import PressMarquee from "../components/PressMarquee";

export const metadata = {
  title: "About",
  description:
    "Meet Kevin Larson and the team behind Kevin Larson Presents — 30 years of Denver's signature themed events.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <MeetTheVisionary />
        <ShoutoutColorado />
        <MeetTheTeam />
        <PressMarquee />
      </main>
      <Footer />
    </>
  );
}
