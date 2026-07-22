import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const changeLanguage = (nextLang) => {
    setLang(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  const toggleLanguage = () => changeLanguage(lang === "en" ? "ta" : "en");

  const value = useMemo(
    () => ({
      lang,
      setLang: changeLanguage,
      toggleLanguage,
      t,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
