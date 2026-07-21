import { useLanguage } from "../i18n/LanguageContext";

const BookingCard = ({ booking, children }) => {
  const { t } = useLanguage();

  return (
    <div className="card">
      <p className="text-xs text-slate-500">{t("bookingId")}: {booking.bookingCode || booking._id}</p>
      <h4 className="font-semibold text-lg">{booking.machineId?.name || "Machine"}</h4>
      <p className="text-sm text-slate-600">{t("fromTime")}: {booking.fromTime}</p>
      <p className="text-sm text-slate-600">{t("toTime")}: {booking.toTime}</p>
      <p className="text-sm text-slate-600">{t("duration")}: {booking.durationHours} hr</p>
      <p className="font-medium">{t("totalPrice")}: INR {booking.totalAmount}</p>
      <p className="font-semibold">{t("status")}: {booking.status}</p>
      {children}
    </div>
  );
};

export default BookingCard;
