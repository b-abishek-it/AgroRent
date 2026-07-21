import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  return (
    <div>
      <Navbar />
      <section className="relative bg-gradient-to-r from-green-50 to-amber-50 py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              {t("homeTitle")}
            </h1>
            <p className="mt-4 text-slate-600">
              {t("homeSubtitle")}
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="btn-primary">{t("getStarted")}</Link>
              <Link to="/search" className="btn-outline">{t("searchMachinery")}</Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1685335686020-e0b487f7f426?q=80&w=1630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Agriculture"
            className="w-full h-80 object-cover rounded-2xl shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
