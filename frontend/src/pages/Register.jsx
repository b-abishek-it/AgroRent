import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, locations } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: locations[0],
    role: "farmer",
    password: "",
  });

  // OTP State
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/register", form);
      if (res.data.requiresOtpVerification) {
        setIsOtpMode(true);
        setCooldown(60);
        setMessage(res.data.message || "OTP sent to your email.");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted/typed by accident in one box
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if there is a value
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).replace(/[^0-9]/g, "");
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus the next empty box or the last box
      const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[nextIndex].focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    
    setIsLoading(true);
    setMessage("");
    try {
      await api.post("/auth/verify-registration-otp", {
        email: form.email,
        otp: otpString
      });
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    setIsLoading(true);
    setMessage("");
    try {
      await api.post("/auth/resend-registration-otp", { email: form.email });
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      setMessage("A new OTP has been sent to your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOtpMode) {
    const isOtpComplete = otp.every((digit) => digit !== "");
    
    return (
      <div className="mx-auto my-auto w-full max-w-md px-4 py-6 sm:py-10">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-sm text-slate-600 mb-6">
            We sent a 6-digit verification code to: <br/>
            <span className="font-semibold text-brand-700">{form.email}</span>
          </p>

          <form onSubmit={verifyOtp} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border-2 rounded-lg border-slate-200 focus:border-brand-600 focus:ring-0 transition-colors"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  required
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading || !isOtpComplete}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {message && <p className={`mt-4 text-sm ${message.includes('sent') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}

          <div className="mt-6 pt-4 border-t border-slate-100">
            {cooldown > 0 ? (
              <p className="text-sm text-slate-500">Resend OTP in {cooldown} seconds</p>
            ) : (
              <button 
                onClick={resendOtp} 
                disabled={isLoading}
                className="text-sm text-brand-700 font-medium hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-auto w-full max-w-md px-4 py-6 sm:py-10">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">{t("registerTitle")}</h2>
        <form onSubmit={submitRegister} className="space-y-3">
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
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? "Processing..." : t("createAccount")}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-center text-red-500">{message}</p>}
        <p className="mt-3 text-center text-sm">
          {t("alreadyAccount")} <Link to="/login" className="text-brand-700">{t("navLogin")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
