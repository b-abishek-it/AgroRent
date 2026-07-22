import { Link } from "react-router-dom";
import { FILE_BASE } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const MachineCard = ({ machine }) => {
  const { t } = useLanguage();

  return (
    <div className="card flex h-full flex-col">
      <img
        src={machine.image ? `${FILE_BASE}${machine.image}` : "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600"}
        alt={machine.name}
        className="h-44 w-full rounded-lg object-cover sm:h-48"
      />
      <div className="mt-3 space-y-1">
        <p className="text-xs text-slate-500">Machine ID: {machine.machineCode || machine._id}</p>
        <h3 className="text-lg font-semibold">{machine.name}</h3>
        <p className="text-sm text-slate-600">{machine.location}</p>
        <p className="font-medium">INR {machine.price} / {machine.priceUnit}</p>
        <p className={`font-semibold ${machine.availability ? "text-green-600" : "text-red-600"}`}>
          {machine.availability ? t("available") : t("notAvailable")}
        </p>
      </div>
      <Link to={`/machines/${machine._id}`} className="btn-primary mt-3 w-full sm:w-auto sm:self-start">{t("viewDetails")}</Link>
    </div>
  );
};

export default MachineCard;
