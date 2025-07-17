import { TbFlame } from "react-icons/tb";
import { Button } from "@repo/ui/components/button";
import { CodeXml } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  const navLinks = [
    { label: "Problems", to: "" },
    { label: "Contests", to: "" },
    { label: "Discuss", to: "" },
    { label: "Sheets", to: "" },
  ];

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

          <div className="h-full flex items-center gap-6 text-zinc-200">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm font-medium hover:text-lime-500 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="h-full flex items-center space-x-4">
            <TbFlame className="mt-1" size={18} data-tip="daily streak" />
            {user ? (
              <Button>Sign out</Button>
            ) : (
              <Link to={"/signin"}>
                <Button className="bg-lime-600 cursor-pointer hover:bg-lime-600/90">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
