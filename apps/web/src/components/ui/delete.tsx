import {
  Boxes,
  Bot,
  Flame,
  MessagesSquare,
  FileText,
  Code2,
  LayoutDashboard,
} from "lucide-react";
import FeatureDash from "./FeatureDash";

const Features = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:auto-rows-[240px] auto-rows-auto items-start">
      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl p-6 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2 row-span-1  lg:row-span-1">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">
            Structured DSA <br /> Practice
            <Boxes size={24} className="ml-2 text-[#f97316] inline" />
          </span>
        </h3>
        <p className="text-sm text-gray-00">
          Master Data Structures and Algorithms with a thoughtfully organized
          set of problems. Tackle key topics like Arrays, Strings, Dynamic
          Programming, Trees, and Graphs. Easily filter by difficulty or focus
          on company-specific patterns to align your prep with your dream role.
        </p>
      </div>

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl p-6 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2 row-span-2 lg:row-span-2">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-2xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Discuss with AlgoAI</span>
          <Bot size={24} className="mt-1 text-[#a855f7]" />
        </h3>
        <p className="text-sm text-gray-300">
          Stuck on a problem? Just ask AlgoAI, your on-demand assistant that
          explains concepts, breaks down solutions, and answers your questions
          in real-time. It’s like having a mentor, 24/7.
        </p>
        <div className="-mb-4 mt-2">
          <img src="/mfeat.png" alt="" />
        </div>
      </div>

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl p-6 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2 row-span-2  lg:row-span-2">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Profile Dashboard</span>
          <LayoutDashboard size={24} className="mt-1 text-cyan-500" />
        </h3>
        <p className="text-sm text-gray-300 ">
          See how far you’ve come and where to go next. Your dashboard
          highlights solved problems, daily streaks, recent submissions, and
          in-depth performance analytics. Visual graphs help you spot trends,
          stay motivated, and focus your efforts where they matter most.
        </p>
        <div className="-mb-3 flex justify-center items-center">
          <FeatureDash />
        </div>
      </div>

      <div className="bg-neutral-900/10 mt-3 relative border border-neutral-800 rounded-2xl p-6 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2    lg:row-span-1 ">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Practice Sheets</span>
          <FileText size={24} className="mt-1 text-[#10b981]" />
        </h3>
        <p className="text-sm text-gray-400">
          No more guesswork, access ready-made practice sheets for every topic
          and skill level. Want more control? Build your own custom problem sets
          tailored to your goals.
        </p>
      </div>

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-10  hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-4  lg:row-span-1 md:-mt-14   ">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Code Editors</span>
          <Code2 size={24} className="mt-1 text-[#22d3ee]" />
        </h3>
        <p className="text-sm text-gray-400">
          Solve problems in a fast, responsive editor designed for both
          beginners and competitive coders. Enjoy multi-language support,
          intelligent autocomplete and real-time feedback, all in one place.
        </p>
        <div className="mt-2 z-50 relative h-[310px]">
          <img
            src="/twoSum.svg"
            className="cursor-pointer rounded-xl w-full h-[340px]  shadow-xs shadow-neutral-100"
          />
        </div>
      </div>

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-10 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2  lg:row-span-1 lg:-mt-14">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Discussion Forum</span>
          <MessagesSquare size={24} className="mt-1 text-[#ef4444]" />
        </h3>
        <p className="text-sm text-gray-400">
          Join a passionate community of developers. Share insights, ask
          questions, discuss solutions, and exchange interview experiences.
          Learn and grow together.
        </p>
      </div>

      <div className="bg-neutral-900/10 relative border border-neutral-800 rounded-2xl px-6 py-16 hover:shadow-md hover:shadow-neutral-500/40 col-span-6 lg:col-span-2  lg:col-start-5 lg:-mt-28">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-white">
          <span className="text-zinc-100 text-2xl">Daily Streak Feature</span>
          <Flame size={24} className="mt-1 text-[#eca409]" />
        </h3>
        <p className="text-sm text-gray-400">
          Build a habit, not just a profile. Keep your daily streak alive and
          stay accountable. Visualize your consistency, spot weak areas, and
          celebrate wins, one day at a time.
        </p>
      </div>
    </div>
  );
};

export default Features;
