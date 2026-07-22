import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const Login = () => {
  const [form, setForm] = useState({ role: "farmer", phone: "", password: "" });
  const [forgot, setForgot] = useState({ email: "", otp: "", newPassword: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "farmer") navigate("/farmer");
      if (data.user.role === "owner") navigate("/owner");
      if (data.user.role === "admin") navigate("/admin");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const sendOtp = async () => {
    try {
      await api.post("/auth/forgot-password", { email: forgot.email });
      setMessage("OTP sent to your email");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    try {
      await api.post("/auth/reset-password", forgot);
      setMessage("Password reset successful. Please login.");
      setShowForgot(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
      <div className="mx-auto mt-6 w-full max-w-md px-4 sm:mt-10">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">{t("loginTitle")}</h2>
        <form onSubmit={submitLogin} className="space-y-3">
          <select name="role" value={form.role} onChange={onChange} className="input">
            <option value="farmer">Farmer</option>
            <option value="owner">Machinery Owner</option>
            <option value="admin">Admin</option>
          </select>
          <input
            className="input"
            name="phone"
            placeholder={form.role === "admin" ? "Username" : t("phoneNumber")}
            value={form.phone}
            onChange={onChange}
          />
          <input className="input" type="password" name="password" placeholder="4 digit PIN" value={form.password} onChange={onChange} />
          <button className="btn-primary w-full">{t("navLogin")}</button>
        </form>
        <button className="text-brand-700 mt-3" onClick={() => setShowForgot(!showForgot)}>
          {t("forgotPassword")}
        </button>
        {showForgot && (
          <div className="mt-3 space-y-2 border-t pt-3">
            <input
              className="input"
              placeholder="Email"
              value={forgot.email}
              onChange={(e) => setForgot({ ...forgot, email: e.target.value })}
            />
            <button className="btn-outline w-full" onClick={sendOtp}>{t("sendOtp")}</button>
            <input
              className="input"
              placeholder="OTP"
              value={forgot.otp}
              onChange={(e) => setForgot({ ...forgot, otp: e.target.value })}
            />
            <input
              className="input"
              placeholder="New 4 digit PIN"
              value={forgot.newPassword}
              onChange={(e) => setForgot({ ...forgot, newPassword: e.target.value })}
            />
            <button className="btn-primary w-full" onClick={resetPassword}>{t("resetPassword")}</button>
          </div>
        )}
        {message && <p className="mt-3 text-sm text-center text-slate-700">{message}</p>}
        <p className="mt-3 text-center text-sm">
          {t("newUser")} <Link to="/register" className="text-brand-700">{t("navRegister")}</Link>
        </p>
      </div>
      </div>
  );
};

export default Login;
