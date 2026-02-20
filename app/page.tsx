import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TechStackSection from "@/components/TechStackSection";
import ImpactSection from "@/components/ImpactSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";
import { Instrument_Serif } from "next/font/google";
import localFont from 'next/font/local';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  style: ['normal', 'italic'],
});

const nohemi = localFont({
  src: [
    {
      path: '../public/fonts/nohemi/Nohemi-Light-BF6438cc5899919.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nohemi',
});

const Home = () => {
  return (
    <div className={`min-h-screen ${nohemi.variable} ${instrumentSerif.variable}`}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TechStackSection />
      <ImpactSection />
      <RoadmapSection />
      <Footer />
    </div>
  );
};

export default Home;
