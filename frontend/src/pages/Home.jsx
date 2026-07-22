import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-r from-green-50 to-amber-50 py-10 sm:py-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
              {t("homeTitle")}
            </h1>
            <p className="mt-4 text-slate-600">
              {t("homeSubtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary w-full sm:w-auto">{t("getStarted")}</Link>
              <Link to="/search" className="btn-outline w-full sm:w-auto">{t("searchMachinery")}</Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1685335686020-e0b487f7f426?q=80&w=1630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Agriculture"
            className="h-56 w-full rounded-2xl object-cover shadow-lg sm:h-72 lg:h-80"
          />
        </div>
      </section>
  );
};

export default Home;
