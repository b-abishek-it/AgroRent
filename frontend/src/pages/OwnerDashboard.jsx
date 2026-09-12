import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, locations, machineTypes, getMachineImageUrl } from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import StarRating from "../components/StarRating";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { t, lang } = useLanguage();

  const [machines, setMachines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState({ bookingId: "", rating: 5, description: "" });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editId, setEditId] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: machineTypes[0],
    description: "",
    registrationNumber: "",
    location: locations[0],
    price: "",
    priceUnit: "day",
    driverName: "",
    driverLicenseNumber: "",
    driverPhoneNumber: "",
    image: null,
  });

  const loadData = async () => {
    const [{ data: ownerMachines }, { data: ownerBookings }] = await Promise.all([
      api.get("/machines/owner/my"),
      api.get("/bookings/owner"),
    ]);
    setMachines(ownerMachines);
    setBookings(ownerBookings);
  };

  useEffect(() => {
    if (!user || user.role !== "owner") {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate, user]);

  const submitMachine = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") payload.append(key, value);
      });

      if (editId) {
        await api.put(`/machines/${editId}`, payload);
      } else {
        await api.post("/machines", payload);
      }

      setForm({
        name: "",
        type: machineTypes[0],
        description: "",
        registrationNumber: "",
        location: locations[0],
        price: "",
        priceUnit: "day",
        driverName: "",
        driverLicenseNumber: "",
        driverPhoneNumber: "",
        image: null,
      });
      setEditId("");
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save machine";
      setFormError(msg);
      console.error("submitMachine error:", msg);
    } finally {
      setFormLoading(false);
    }
  };

  const onEdit = (machine) => {
    setEditId(machine._id);
    setForm({
      name: machine.name,
      type: machine.type,
      description: machine.description,
      registrationNumber: machine.registrationNumber || "",
      location: machine.location,
      price: machine.price,
      priceUnit: machine.priceUnit || "day",
      driverName: machine.driverName || "",
      driverLicenseNumber: machine.driverLicenseNumber || "",
      driverPhoneNumber: machine.driverPhoneNumber || "",
      image: null,
    });
  };

  const deleteMachine = async (id) => {
    await api.delete(`/machines/${id}`);
    loadData();
  };

  const approveBooking = async (id) => {
    await api.put(`/bookings/${id}/approve`);
    loadData();
  };

  const rejectBooking = async (id) => {
    await api.put(`/bookings/${id}/reject`);
    loadData();
  };

  const approveCancellation = async (id) => {
    await api.put(`/bookings/${id}/approve-cancel`);
    loadData();
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
      setFeedbackMessage("Feedback submitted successfully!");
      setFeedback({ bookingId: "", rating: 5, description: "" });
    } catch (error) {
      setFeedbackMessage(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
      <div className="mx-auto max-w-6xl space-y-8 p-4 sm:py-6">
        <p className="text-slate-600">Owner ID: {user?.ownerId || "N/A"}</p>
        <section className="card">
          <h2 className="text-xl font-bold mb-3">{t("addMachinery")}</h2>
          <form onSubmit={submitMachine} className="grid gap-3 md:grid-cols-2">
            {formError && (
              <div className="md:col-span-2 rounded bg-red-50 border border-red-300 text-red-700 px-4 py-2 text-sm">
                {formError}
              </div>
            )}
            <input className="input" placeholder={t("machineName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {machineTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
            <textarea className="input md:col-span-2" placeholder={t("description")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="input" placeholder={t("machineRegistrationNumber")} value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} required />
            <select className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
              {locations.map((location) => <option key={location}>{location}</option>)}
            </select>
            <input className="input" placeholder={t("price")} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <select className="input" value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}>
              <option value="hour">{t("perHour")}</option>
              <option value="day">{t("perDay")}</option>
            </select>
            <input className="input" placeholder={t("driverName")} value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} required />
            <input className="input" placeholder={t("driverLicenseNumber")} value={form.driverLicenseNumber} onChange={(e) => setForm({ ...form, driverLicenseNumber: e.target.value })} required />
            <input className="input" placeholder={t("driverPhoneNumber")} value={form.driverPhoneNumber} onChange={(e) => setForm({ ...form, driverPhoneNumber: e.target.value })} required />
            <input className="input" type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size > 2 * 1024 * 1024) {
                setFormError("Image file is too large. Maximum size is 2 MB.");
                e.target.value = null;
                setForm({ ...form, image: null });
              } else {
                setFormError("");
                setForm({ ...form, image: file });
              }
            }} />
            <button className="btn-primary w-full md:col-span-2" disabled={formLoading}>{formLoading ? "Uploading..." : editId ? t("updateMachinery") : t("addMachinery")}</button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{t("myMachinery")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {machines.map((machine) => (
              <div className="card" key={machine._id}>
                <p className="text-xs text-slate-500">Machine ID: {machine.machineCode || machine._id}</p>
                <img src={getMachineImageUrl(machine.image)} alt={machine.name} className="h-40 w-full rounded object-cover sm:h-44" />
                <h3 className="font-semibold mt-2">{machine.name}</h3>
                <p>{machine.type}</p>
                <p>{machine.location}</p>
                <p>{t("machineRegistrationNumber")}: {machine.registrationNumber}</p>
                <p>{t("driverId")}: {machine.driverId}</p>
                <p>{t("driverName")}: {machine.driverName}</p>
                <p>INR {machine.price} / {machine.priceUnit}</p>
                <p className={machine.verified ? "text-green-600" : "text-amber-600"}>{machine.verified ? t("verified") : t("pendingVerification")}</p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <button className="btn-outline w-full sm:w-auto" onClick={() => onEdit(machine)}>{t("edit")}</button>
                  <button className="btn-primary w-full sm:w-auto" onClick={() => deleteMachine(machine._id)}>{t("delete")}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{t("bookingRequests")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <p className="text-xs text-slate-500">Booking ID: {booking.bookingCode || booking._id}</p>
                <p className="font-semibold">Farmer: {booking.farmerId?.name}</p>
                <p>Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                <p>{t("fromTime")}: {booking.fromTime}</p>
                <p>{t("toTime")}: {booking.toTime}</p>
                <p>{t("duration")}: {booking.durationHours} hr</p>
                <p>Farmer Location: {booking.farmerId?.location}</p>
                <p>{t("status")}: {booking.status}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {["Pending", "Waiting"].includes(booking.status) && <button className="btn-primary w-full sm:w-auto" onClick={() => approveBooking(booking._id)}>{t("approveBooking")}</button>}
                  {["Pending", "Waiting", "CancellationRequested"].includes(booking.status) && <button className="btn-outline w-full sm:w-auto" onClick={() => rejectBooking(booking._id)}>{t("rejectBooking")}</button>}
                  {booking.status === "CancellationRequested" && <button className="btn-primary w-full sm:w-auto" onClick={() => approveCancellation(booking._id)}>{t("approveCancel")}</button>}
                  {booking.paymentCompletedAt && (
                    <button className="btn-outline w-full sm:w-auto" onClick={() => downloadInvoice(booking._id)}>{t("downloadInvoice")}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card mt-8 w-full max-w-xl mx-auto md:mx-0">
          <h3 className="text-lg font-semibold mb-2">{t("submitFeedback")}</h3>
          <form onSubmit={submitFeedback} className="space-y-4">
            <input
              className="input"
              placeholder={t("bookingId")}
              value={feedback.bookingId}
              onChange={(e) => setFeedback({ ...feedback, bookingId: e.target.value })}
              required
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Rating</label>
              <StarRating 
                rating={feedback.rating} 
                onRatingChange={(newRating) => setFeedback({ ...feedback, rating: newRating })} 
              />
            </div>

            <textarea
              className="input"
              placeholder={t("feedbackDescription")}
              value={feedback.description}
              onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
              required
            />
            <button className="btn-primary w-full sm:w-auto">{t("submit")}</button>
          </form>
          {feedbackMessage && <p className="mt-2 text-sm text-brand-700">{feedbackMessage}</p>}
        </section>
      </div>
  );
};

export default OwnerDashboard;
