import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Coder from "./Coder";

const HeroSection = () => {
  return (
    <section className="flex py-20 px-4 w-full space-x-24">
      <div className="text-left w-1/2">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Master Code. <br />
          <span className="text-lime-600">Trek Far.</span> <br />
          Dominate.
        </h1>

        <p className="text-base text-zinc-400 mb-8">
          Push your limits. Track your growth. Own your journey. Join a
          community of coders, take on real challenges, and become the coder
          you’re meant to be.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="cursor-pointer">
            Start Coding
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button className="bg-zinc-900 hover:bg-zinc-800/35 border border-zinc-800 cursor-pointer">
            View Problems
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              className="inline-block size-8 rounded-full"
              src="/user-1.png"
              alt="user image"
            />
            <img
              className="inline-block size-8 rounded-full"
              src="/user-2.png"
              alt="user image"
            />
            <img
              className="inline-block size-8 rounded-full"
              src="/user-3.png"
              alt="user image"
            />
            <img
              className="inline-block size-8 rounded-full"
              src="/user-4.jpg"
              alt="user image"
            />
            <img
              className="inline-block object-cover size-8 rounded-full"
              src="/user-5.jpg"
              alt="user image"
            />
          </div>

          <p className="font-semibold text-lime-50">Joined by 1500+ coders</p>
        </div>
      </div>

      <div className="flex justify-center items-center w-1/2">
        <div className="w-full max-w-md">
          <Coder />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
