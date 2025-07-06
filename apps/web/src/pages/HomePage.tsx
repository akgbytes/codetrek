import HeroSection from "../components/HeroSection";
import { FAQs } from "../components/ui/FAQs";
import Features from "../components/ui/Features";

const HomePage = () => {
  return (
    <>
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <HeroSection />
        <div className="max-w-7xl mx-auto mt-5 px-4">
          <h2 className="text-5xl font-bold mb-12 text-center text-white">
            Why coders choose <span className="text-lime-600">CodeTrek</span>
          </h2>
          <Features />
          <h2 className="text-5xl font-bold mb-12 text-center text-white">
            Frequently asked questions
          </h2>
          <FAQs />
        </div>
      </div>
    </>
  );
};

export default HomePage;
