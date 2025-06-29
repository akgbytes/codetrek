import HeroSection from "../components/HeroSection";
import Features from "../components/ui/Features";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <h2 className="text-5xl font-bold mb-12 text-center text-white">
          Why coders choose <span className="text-lime-600">CodeTrek</span>
        </h2>

        <Features />
      </div>
    </div>
  );
};

export default Home;
