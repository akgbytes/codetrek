import { CodeXml, Heart } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-800 mt-20">
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 py-8 flex flex-col  md:flex-row md:justify-between">
        {/* Left Section */}
        <div className="flex gap-4 flex-col max-w-md">
          <div className="flex gap-2 w-48 hover:scale-105 transition-all duration-300 cursor-pointer">
            <CodeXml color="#65a30d" />
            <div className="text-base font-semibold">
              Code<span className="">Trek</span>
            </div>
          </div>

          <p className="text-sm text-zinc-400/85">
            Track your coding journey, challenge your peers, and grow together
            as confident coders.
          </p>

          <div className="flex mt-1 gap-4 text-zinc-500">
            <a
              href="https://github.com/akgbytes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-600 hover:scale-105 transition-all"
            >
              <FiGithub className="icon" />
            </a>
            <a
              href="https://x.com/akgbytes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-600 hover:scale-105 transition-all"
            >
              <FaXTwitter className="icon" />
            </a>
            <a
              href="https://www.linkedin.com/in/akgbytes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-600 hover:scale-105 transition-all"
            >
              <FiLinkedin className="icon" />
            </a>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex flex-col gap-2 text-sm text-zinc-500">
          <h3 className="text-zinc-200 font-semibold">Quick Links</h3>

          <Link to="" className="hover:text-zinc-300">
            Problems
          </Link>
          <Link to="" className="hover:text-zinc-300">
            Contests
          </Link>
          <Link to="" className="hover:text-zinc-300">
            Sheets
          </Link>
          <Link to="" className="hover:text-zinc-300">
            Discussion Forum
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm text-zinc-500">
          <h3 className="text-zinc-200 ">Legal</h3>
          <Link to="" className="hover:text-zinc-300">
            Terms of Service
          </Link>
          <Link to="" className="hover:text-zinc-300">
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 border-t border-zinc-800 py-3">
        <div className="flex justify-between text-sm text-zinc-300 dark:text-zinc-300 gap-3">
          <div>© 2025 CodeTrek. All rights reserved.</div>
          <div>
            <span className="">
              Made with <Heart className="inline border-none size-5" /> by{" "}
            </span>
            <span className="cursor-pointer hover:text-lime-600 hover:underline">
              akgbytes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
