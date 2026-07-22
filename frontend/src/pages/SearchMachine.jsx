import { useEffect, useState } from "react";
import MachineCard from "../components/MachineCard";
import { api, locations, machineTypes } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const SearchMachine = () => {
  const [machines, setMachines] = useState([]);
  const [filters, setFilters] = useState({ type: "", location: "" });
  const { t } = useLanguage();

  const loadMachines = async () => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.location) params.location = filters.location;
    const { data } = await api.get("/machines", { params });
    setMachines(data);
  };

  useEffect(() => {
    loadMachines();
  }, []);

  return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <h2 className="text-2xl font-bold mb-4">{t("searchMachinery")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 mb-6">
          <select className="input" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">{t("allTypes")}</option>
            {machineTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select className="input" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
            <option value="">{t("allLocations")}</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <button className="btn-primary w-full" onClick={loadMachines}>{t("applyFilters")}</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine) => (
            <MachineCard key={machine._id} machine={machine} />
          ))}
        </div>
      </div>
  );
};

export default SearchMachine;
