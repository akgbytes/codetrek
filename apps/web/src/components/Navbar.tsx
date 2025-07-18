import { TbFlame } from "react-icons/tb";
import { Button } from "@repo/ui/components/button";
import { CodeXml } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-zinc-800 backdrop-blur-lg transition-all">
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex z-40 font-semibold space-x-2 items-center justify-center"
          >
            <CodeXml color="#65a30d" />
            <div className="text-xl font-semibold">
              Code<span className="">Trek</span>
            </div>
          </Link>

          <div className="h-full flex items-center space-x-6">
            <Link to="" className="hover:text-lime-600">
              Problems
            </Link>
            <Link to="" className="hover:text-lime-600">
              Contests
            </Link>
            <Link to="" className="hover:text-lime-600">
              Discuss
            </Link>
            <Link to="" className="hover:text-lime-600">
              Sheets
            </Link>
          </div>

          <div className="h-full flex items-center space-x-4">
            <TbFlame className="mt-1" size={18} data-tip="daily streak" />
            {false ? (
              <Button>Sign out</Button>
            ) : (
              <Button className="bg-lime-600 cursor-pointer hover:bg-lime-600/90">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
