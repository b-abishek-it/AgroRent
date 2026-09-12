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

  const navLinks = (
    <>
      <Link to="/" onClick={closeMenu} className="flex items-center gap-2 p-2 md:px-2 md:py-1.5 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors" title={t("navHome")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="md:hidden font-medium">{t("navHome")}</span>
      </Link>
      <Link to="/search" onClick={closeMenu} className="font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center">{t("navSearch")}</Link>
    </>
  );

  const actionButtons = (
    <>
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label="Toggle language"
        title={lang === "en" ? t("tamil") : t("english")}
        className="relative inline-flex h-8 w-[72px] shrink-0 items-center rounded-full border border-slate-300 bg-slate-100 px-1 transition-colors"
      >
        <span className="absolute left-2.5 text-[10px] font-bold text-slate-600">EN</span>
        <span className="absolute right-2.5 text-[10px] font-bold text-slate-600">TA</span>
        <span className={`h-6 w-8 rounded-full bg-white shadow transition-transform ${lang === "ta" ? "translate-x-8" : "translate-x-0"}`} />
      </button>

      {!user ? (
        <>
          <Link to="/login" onClick={closeMenu} className="font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors text-sm">{t("navLogin")}</Link>
          <Link to="/register" onClick={closeMenu} className="btn-primary shadow-sm py-1.5 px-4 text-sm">{t("navRegister")}</Link>
        </>
      ) : (
        <>
          <Link to={user.role === "farmer" ? "/farmer" : user.role === "owner" ? "/owner" : "/admin"} onClick={closeMenu} className="btn-outline bg-white py-1.5 px-4 text-sm">
            {t("navDashboard")}
          </Link>
          <button onClick={onLogout} className="btn-primary shadow-sm !bg-red-600 hover:!bg-red-700 border-none py-1.5 px-4 text-sm">{t("navLogout")}</button>
        </>
      )}
    </>
  );

  return (
    <nav className="relative z-20 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left side: Logo */}
        <div className="flex items-center">
          <Link to="/" onClick={closeMenu} className="text-xl font-bold text-brand-700 sm:text-2xl tracking-tight">AgroRent</Link>
        </div>

        {/* Center: Spacer */}
        <div className="hidden md:flex flex-1">
        </div>

        {/* Right side: Nav Links & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {navLinks}
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          {actionButtons}
        </div>

        {/* Mobile menu button */}
        <button type="button" className="inline-flex rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Toggle navigation" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
          <span className="text-2xl leading-none">{isMenuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-full border-b bg-white px-4 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <div className="flex flex-col gap-4 px-2">{navLinks}</div>
            <div className="h-px bg-slate-100 my-2"></div>
            <div className="flex flex-col gap-4 px-2">{actionButtons}</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
