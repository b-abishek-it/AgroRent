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
      <Link to="/" onClick={closeMenu} className="font-medium text-slate-600 hover:text-brand-700 transition-colors">{t("navHome")}</Link>
      <Link to="/search" onClick={closeMenu} className="font-medium text-slate-600 hover:text-brand-700 transition-colors">{t("navSearch")}</Link>
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
          <Link to="/login" onClick={closeMenu} className="font-medium text-slate-600 hover:text-brand-700 px-2 transition-colors">{t("navLogin")}</Link>
          <Link to="/register" onClick={closeMenu} className="btn-primary py-1.5 shadow-sm">{t("navRegister")}</Link>
        </>
      ) : (
        <>
          <Link to={user.role === "farmer" ? "/farmer" : user.role === "owner" ? "/owner" : "/admin"} onClick={closeMenu} className="btn-outline py-1.5 bg-white">
            {t("navDashboard")}
          </Link>
          <button onClick={onLogout} className="btn-primary py-1.5 shadow-sm !bg-red-600 hover:!bg-red-700 border-none">{t("navLogout")}</button>
        </>
      )}
    </>
  );

  return (
    <nav className="relative z-20 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left side: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" onClick={closeMenu} className="text-xl font-bold text-brand-700 sm:text-2xl tracking-tight">AgroRent</Link>
          <div className="hidden md:flex items-center gap-6">{navLinks}</div>
        </div>

        {/* Right side: Actions */}
        <div className="hidden md:flex items-center gap-4">{actionButtons}</div>

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
