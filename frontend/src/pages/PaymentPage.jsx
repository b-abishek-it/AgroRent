import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getMachineImageUrl } from "../api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const PaymentPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "farmer") {
      navigate("/login");
      return;
    }

    const loadBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load payment details");
      }
    };

    loadBooking();
  }, [bookingId, navigate, user]);

  const pricing = useMemo(() => {
    const total = Number(booking?.totalAmount || 0);
    const adminCommission = Number((total * 0.05).toFixed(2));
    const machineRentalCost = Number((total - adminCommission).toFixed(2));

    return { total, adminCommission, machineRentalCost };
  }, [booking]);

  const handlePayment = async () => {
    if (!booking || isPaying) return;

    setIsPaying(true);
    setError("");

    try {
      await api.put(`/bookings/${booking._id}/complete`);
      navigate("/farmer", {
        replace: true,
        state: {
          paymentSuccessMessage: "Payment completed successfully. Invoice download is now available.",
        },
      });
    } catch (paymentError) {
      setError(paymentError.response?.data?.message || "Payment failed");
      setIsPaying(false);
    }
  };

  return (
      <div className="mx-auto max-w-4xl p-4 sm:py-6">
        <div className="card space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <p className="text-sm font-semibold text-brand-700">Razorpay Payment</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Review and pay for your booking</h1>
            <p className="text-sm text-slate-600 mt-2">
              Confirm the booking details below. The invoice will be enabled in both farmer and machinery owner dashboards after payment is completed.
            </p>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {!booking ? (
            <p className="text-sm text-slate-600">Loading payment details...</p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Amount</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(pricing.total)}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700">Machine Rental Cost</p>
                  <p className="mt-2 text-2xl font-bold text-amber-950">{formatCurrency(pricing.machineRentalCost)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Admin Commission</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-950">{formatCurrency(pricing.adminCommission)}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                  {booking.machineId?.image && <img src={getMachineImageUrl(booking.machineId.image)} alt={booking.machineId?.name || "Machine"} className="mb-3 h-44 w-full rounded-lg object-cover" />}
                  <h2 className="text-lg font-semibold text-slate-900">Booking Details</h2>
                  <p><span className="font-medium">Booking ID:</span> {booking.bookingCode || booking._id}</p>
                  <p><span className="font-medium">Machine:</span> {booking.machineId?.name || "Machine"}</p>
                  <p><span className="font-medium">Machine Type:</span> {booking.machineId?.type || "-"}</p>
                  <p><span className="font-medium">Location:</span> {booking.machineId?.location || "-"}</p>
                  <p><span className="font-medium">Date:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">From Time:</span> {booking.fromTime}</p>
                  <p><span className="font-medium">To Time:</span> {booking.toTime}</p>
                  <p><span className="font-medium">Duration:</span> {booking.durationHours} hr</p>
                  <p><span className="font-medium">Current Status:</span> {booking.status}</p>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                  <h2 className="text-lg font-semibold text-slate-900">People and Machine Info</h2>
                  <p><span className="font-medium">Farmer:</span> {booking.farmerId?.name || "-"}</p>
                  <p><span className="font-medium">Farmer Location:</span> {booking.farmerId?.location || "-"}</p>
                  <p><span className="font-medium">Machinery Owner:</span> {booking.ownerId?.name || "-"}</p>
                  <p><span className="font-medium">Machine Registration No:</span> {booking.machineId?.registrationNumber || "-"}</p>
                  <p><span className="font-medium">Driver Name:</span> {booking.machineId?.driverName || "-"}</p>
                  <p><span className="font-medium">Driver Phone:</span> {booking.machineId?.driverPhoneNumber || "-"}</p>
                  <p><span className="font-medium">Price Unit:</span> {booking.machineId?.priceUnit || "-"}</p>
                  <p><span className="font-medium">Payment Reference:</span> {booking.paymentReference || "Will be generated after payment"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="btn-outline w-full sm:w-auto"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  Back
                </button>
                <button
                  className="btn-primary w-full sm:w-auto"
                  onClick={handlePayment}
                  disabled={isPaying || Boolean(booking.paymentCompletedAt)}
                  type="button"
                >
                  {booking.paymentCompletedAt ? "Payment Completed" : isPaying ? "Processing..." : "Pay"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
  );
};

export default PaymentPage;
