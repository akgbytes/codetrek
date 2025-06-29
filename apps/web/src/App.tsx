import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-[calc(100vh-1px)] flex flex-col bg-neutral-900 text-zinc-50">
      <Navbar />
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
