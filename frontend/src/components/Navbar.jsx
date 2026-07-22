import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { lang, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navigation = (
    <>
      <Link to="/search" onClick={closeMenu} className="text-slate-700 hover:text-brand-700">{t("navSearch")}</Link>
      <Link to="/" onClick={closeMenu} className="btn-outline">{t("navHome")}</Link>
      {!user ? (
        <>
          <Link to="/register" onClick={closeMenu} className="btn-primary">{t("navRegister")}</Link>
          <Link to="/login" onClick={closeMenu} className="btn-outline">{t("navLogin")}</Link>
        </>
      ) : (
        <>
          <Link to={user.role === "farmer" ? "/farmer" : user.role === "owner" ? "/owner" : "/admin"} onClick={closeMenu} className="btn-outline">
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
        className="relative inline-flex h-9 w-20 shrink-0 items-center rounded-full border border-slate-300 bg-slate-100 px-1 transition-colors"
      >
        <span className="absolute left-3 text-xs font-semibold text-slate-600">EN</span>
        <span className="absolute right-3 text-xs font-semibold text-slate-600">TA</span>
        <span className={`h-7 w-9 rounded-full bg-white shadow transition-transform ${lang === "ta" ? "translate-x-9" : "translate-x-0"}`} />
      </button>
    </>
  );

  return (
    <nav className="relative z-20 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" onClick={closeMenu} className="text-xl font-bold text-brand-700 sm:text-2xl">AgroRent</Link>
        <button type="button" className="inline-flex rounded-lg p-2 text-slate-700 hover:bg-brand-50 md:hidden" aria-label="Toggle navigation" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
          <span className="text-2xl leading-none">{isMenuOpen ? "×" : "☰"}</span>
        </button>
        <div className="hidden items-center gap-3 md:flex">{navigation}</div>
      </div>
      {isMenuOpen && <div className="absolute inset-x-0 top-full border-b bg-white px-4 py-4 shadow-md md:hidden"><div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3">{navigation}</div></div>}
    </nav>
  );
};

export default Navbar;
