import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const PageLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/admin";

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <Navbar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
