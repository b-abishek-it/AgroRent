import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { lang, toggleLanguage, t } = useLanguage();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-700">AgroRent</Link>
        <div className="flex items-center gap-3">
          <Link to="/search" className="text-slate-700 hover:text-brand-700">{t("navSearch")}</Link>
          <Link to="/" className="btn-outline">{t("navHome")}</Link>
          {!user ? (
            <>
              <Link to="/register" className="btn-primary">{t("navRegister")}</Link>
              <Link to="/login" className="btn-outline">{t("navLogin")}</Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === "farmer" ? "/farmer" : user.role === "owner" ? "/owner" : "/admin"}
                className="btn-outline"
              >
                {t("navDashboard")}
              </Link>
              <button onClick={onLogout} className="btn-primary">{t("navLogout")}</button>
            </>
          )}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            title={lang === "en" ? t("tamil") : t("english")}
            className="relative inline-flex h-9 w-20 items-center rounded-full border border-slate-300 bg-slate-100 px-1 transition-colors"
          >
            <span className="absolute left-3 text-xs font-semibold text-slate-600">EN</span>
            <span className="absolute right-3 text-xs font-semibold text-slate-600">TA</span>
            <span
              className={`h-7 w-9 rounded-full bg-white shadow transition-transform ${
                lang === "ta" ? "translate-x-9" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
