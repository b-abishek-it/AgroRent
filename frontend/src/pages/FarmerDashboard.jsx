import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookingCard from "../components/BookingCard";
import { api } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState({ bookingId: "", description: "" });
  const [message, setMessage] = useState("");
  const { t, lang } = useLanguage();

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get("/bookings/farmer");
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "farmer") {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [fetchBookings, navigate, user]);

  useEffect(() => {
    if (location.state?.paymentSuccessMessage) {
      setMessage(location.state.paymentSuccessMessage);
      navigate(location.pathname, { replace: true, state: {} });
      fetchBookings();
    }
  }, [fetchBookings, location.pathname, location.state, navigate]);

  const requestCancellation = async (id) => {
    await api.put(`/bookings/${id}/request-cancel`);
    const { data } = await api.get("/bookings/farmer");
    setBookings(data);
  };

  const downloadInvoice = async (id) => {
    const response = await api.get(`/bookings/${id}/invoice`, {
      responseType: "blob",
      params: { lang },
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", feedback);
      setMessage("Feedback submitted");
      setFeedback({ bookingId: "", description: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-2xl font-bold">
            Welcome {user?.name} {user?.farmerId ? `(${user.farmerId})` : ""}
          </h2>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">{t("bookingHistory")}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking}>
              <div className="mt-3 flex flex-wrap gap-3">
                {booking.status === "Approved" && (
                  <button
                    className="btn-primary w-full text-center sm:flex-1 sm:min-w-[180px]"
                    onClick={() => navigate(`/payment/${booking._id}`)}
                  >
                    {t("proceedToPay")}
                  </button>
                )}
                {["Pending", "Approved", "Waiting"].includes(booking.status) && (
                  <button
                    className="btn-outline w-full text-center sm:flex-1 sm:min-w-[180px]"
                    onClick={() => requestCancellation(booking._id)}
                  >
                    {t("cancelRequest")}
                  </button>
                )}
                {booking.paymentCompletedAt && (
                  <button
                    className="btn-outline w-full text-center sm:flex-1 sm:min-w-[180px]"
                    onClick={() => downloadInvoice(booking._id)}
                  >
                    {t("downloadInvoice")}
                  </button>
                )}
              </div>
            </BookingCard>
          ))}
        </div>

        <div className="card mt-8 max-w-xl">
          <h3 className="text-lg font-semibold mb-2">{t("submitFeedback")}</h3>
          <form onSubmit={submitFeedback} className="space-y-2">
            <input
              className="input"
              placeholder={t("bookingId")}
              value={feedback.bookingId}
              onChange={(e) => setFeedback({ ...feedback, bookingId: e.target.value })}
              required
            />
            <textarea
              className="input"
              placeholder={t("feedbackDescription")}
              value={feedback.description}
              onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
              required
            />
            <button className="btn-primary">{t("submit")}</button>
          </form>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
