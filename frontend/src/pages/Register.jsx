import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, locations } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: locations[0],
    role: "farmer",
    password: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
      <div className="mx-auto mt-6 w-full max-w-md px-4 sm:mt-10">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">{t("registerTitle")}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" name="name" placeholder={t("fullName")} onChange={onChange} required />
          <input className="input" name="email" type="email" placeholder={t("emailAddress")} onChange={onChange} required />
          <input className="input" name="phone" placeholder={t("phoneNumber")} onChange={onChange} required />
          <select className="input" name="location" value={form.location} onChange={onChange}>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <select className="input" name="role" value={form.role} onChange={onChange}>
            <option value="farmer">Farmer</option>
            <option value="owner">Machinery Owner</option>
          </select>
          <input className="input" name="password" type="password" placeholder="4 digit PIN" onChange={onChange} required />
          <button className="btn-primary w-full">{t("createAccount")}</button>
        </form>
        {message && <p className="mt-3 text-sm text-center">{message}</p>}
        <p className="mt-3 text-center text-sm">
          {t("alreadyAccount")} <Link to="/login" className="text-brand-700">{t("navLogin")}</Link>
        </p>
      </div>
      </div>
  );
};

export default Register;
