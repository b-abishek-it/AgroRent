import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const Login = () => {
  const [form, setForm] = useState({ role: "farmer", phone: "", password: "" });
  const [forgot, setForgot] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "", resetToken: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
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
      setForgotStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email: forgot.email, otp: forgot.otp });
      setMessage("OTP verified. Please enter your new password.");
      setForgot({ ...forgot, resetToken: data.resetToken });
      setForgotStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to verify OTP");
    }
  };

  const resetPassword = async () => {
    if (forgot.newPassword !== forgot.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/reset-password", { 
        resetToken: forgot.resetToken, 
        newPassword: forgot.newPassword 
      });
      setMessage("Password reset successful. Please login.");
      setShowForgot(false);
      setForgotStep(1);
      setForgot({ email: "", otp: "", newPassword: "", confirmPassword: "", resetToken: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
      <div className="mx-auto my-auto w-full max-w-md px-4 py-6 sm:py-10">
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
        <button 
          className="text-brand-700 mt-3 hover:underline text-sm font-medium" 
          onClick={() => {
            setShowForgot(!showForgot);
            if (!showForgot) {
              setForgotStep(1);
              setForgot({ email: "", otp: "", newPassword: "", confirmPassword: "", resetToken: "" });
              setMessage("");
            }
          }}
        >
          {t("forgotPassword")}
        </button>
        {showForgot && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-slate-800">Reset Password</h3>
            
            {forgotStep === 1 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  className="input"
                  placeholder="Email address"
                  value={forgot.email}
                  onChange={(e) => setForgot({ ...forgot, email: e.target.value })}
                />
                <button className="btn-outline w-full" onClick={sendOtp}>{t("sendOtp")}</button>
              </div>
            )}
            
            {forgotStep === 2 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                <p className="text-sm text-slate-600 mb-2">Enter the OTP sent to <span className="font-medium text-slate-800">{forgot.email}</span></p>
                <input
                  className="input"
                  placeholder="6-digit OTP"
                  value={forgot.otp}
                  onChange={(e) => setForgot({ ...forgot, otp: e.target.value })}
                />
                <button className="btn-outline w-full" onClick={verifyOtp}>Verify OTP</button>
              </div>
            )}

            {forgotStep === 3 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                <input
                  className="input"
                  type="password"
                  placeholder="New 4 digit PIN"
                  value={forgot.newPassword}
                  onChange={(e) => setForgot({ ...forgot, newPassword: e.target.value })}
                />
                <input
                  className="input"
                  type="password"
                  placeholder="Confirm new 4 digit PIN"
                  value={forgot.confirmPassword}
                  onChange={(e) => setForgot({ ...forgot, confirmPassword: e.target.value })}
                />
                <button className="btn-primary w-full" onClick={resetPassword}>{t("resetPassword")}</button>
              </div>
            )}
          </div>
        )}
        {message && (
          <div className="mt-4 p-3 bg-slate-50 border rounded-lg">
            <p className="text-sm text-center text-slate-700">{message}</p>
          </div>
        )}
        <p className="mt-4 text-center text-sm border-t pt-4">
          {t("newUser")} <Link to="/register" className="text-brand-700 font-medium hover:underline">{t("navRegister")}</Link>
        </p>
      </div>
      </div>
  );
};

export default Login;
