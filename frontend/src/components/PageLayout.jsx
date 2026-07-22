import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const PageLayout = () => (
  <div className="flex min-h-screen min-w-0 flex-col">
    <Navbar />
    <main className="min-w-0 flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PageLayout;
