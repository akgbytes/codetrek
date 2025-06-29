import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { Footer } from "../Footer";

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default HomeLayout;
