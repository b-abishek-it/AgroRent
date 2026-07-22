import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getMachineImageUrl } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const MachineDetails = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [message, setMessage] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [durationOption, setDurationOption] = useState("custom");
  const [availability, setAvailability] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const { data } = await api.get(`/machines/${id}`);
        setMachine(data);
      } catch (error) {
        setMessage("Failed to load machine details");
      }
    };
    fetchMachine();
  }, [id]);

  const duration = useMemo(() => {
    if (!fromTime || !toTime) return 0;
    const start = new Date(`2000-01-01T${fromTime}:00`);
    const end = new Date(`2000-01-01T${toTime}:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
    return Number(((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2));
  }, [fromTime, toTime]);

  const total = useMemo(() => {
    if (!machine || !duration) return 0;
    if (machine.priceUnit === "hour") return machine.price * duration;
    return machine.price * Math.max(1, Math.ceil(duration / 24));
  }, [machine, duration]);

  useEffect(() => {
    if (durationOption === "custom") return;
    const hours = Number(durationOption);
    if (!fromTime || Number.isNaN(hours)) return;
    const start = new Date(`2000-01-01T${fromTime}:00`);
    start.setHours(start.getHours() + hours);
    const hh = String(start.getHours()).padStart(2, "0");
    const mm = String(start.getMinutes()).padStart(2, "0");
    setToTime(`${hh}:${mm}`);
  }, [durationOption, fromTime]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!machine?._id || !bookingDate || !fromTime || !toTime) {
        setAvailability("");
        return;
      }

      try {
        const { data } = await api.get("/bookings/availability", {
          params: { machineId: machine._id, date: bookingDate, fromTime, toTime },
        });
        setAvailability(data.available ? t("available") : t("notAvailable"));
      } catch {
        setAvailability(t("notAvailable"));
      }
    };

    checkAvailability();
  }, [machine?._id, bookingDate, fromTime, toTime, t]);

  const bookMachine = async () => {
    if (!user || user.role !== "farmer") {
      setMessage("Only farmer can book machine");
      return;
    }

    try {
      if (!bookingDate || !fromTime || !toTime || !duration) {
        setMessage("Please select a booking date");
        return;
      }

      if (availability === t("notAvailable")) {
        setMessage(t("notAvailable"));
        return;
      }

      await api.post("/bookings", {
        machineId: machine._id,
        date: bookingDate,
        fromTime,
        toTime,
      });
      setMessage("Booking request sent successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
    }
  };

  if (!machine) {
    return (
      <p className="mx-auto max-w-6xl p-4">Loading...</p>
    );
  }

  return (
      <div className="mx-auto mt-4 grid max-w-5xl gap-6 p-4 sm:mt-6 md:grid-cols-2">
        <img
          src={getMachineImageUrl(machine.image)}
          alt={machine.name}
          className="h-56 w-full rounded-xl object-cover sm:h-72 md:h-80"
        />
        <div className="card">
          <h2 className="text-2xl font-bold">{machine.name}</h2>
          <p className="text-slate-600">{machine.type}</p>
          <p className="mt-2">{machine.description}</p>
          <p className="mt-2">{t("location")}: {machine.location}</p>
          <p className="font-semibold mt-1">{t("price")}: INR {machine.price} / {machine.priceUnit}</p>
          <p className="mt-1">{t("machineRegistrationNumber")}: {machine.registrationNumber}</p>
          <p className="mt-1">{t("driverId")}: {machine.driverId}</p>
          <p className="mt-1">{t("driverName")}: {machine.driverName}</p>
          <p className="mt-1">{t("driverLicenseNumber")}: {machine.driverLicenseNumber}</p>
          <p className="mt-1">{t("driverPhoneNumber")}: {machine.driverPhoneNumber}</p>

          <div className="mt-4 space-y-2">
            <input
              className="input"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
            <input className="input" type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
            <select className="input" value={durationOption} onChange={(e) => setDurationOption(e.target.value)}>
              <option value="custom">Custom</option>
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="3">3 Hours</option>
              <option value="4">4 Hours</option>
            </select>
            <input className="input" type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
            <p>{t("duration")}: {duration} hour(s)</p>
            <p className="font-semibold">{t("totalPrice")}: INR {total}</p>
            {availability && (
              <p className={`font-semibold ${availability === t("available") ? "text-green-600" : "text-red-600"}`}>
                {availability}
              </p>
            )}
            <button className="btn-primary w-full" onClick={bookMachine} disabled={!bookingDate || !fromTime || !toTime || !duration || availability === t("notAvailable")}>
              {t("bookMachine")}
            </button>
          </div>
          {message && <p className="mt-3 text-sm">{message}</p>}
        </div>
      </div>
  );
};

export default MachineDetails;
