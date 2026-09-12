import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getMachineImageUrl } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const Icons = {
  Overview: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Farmers: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Owners: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Machines: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  Bookings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  Feedbacks: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  PanelToggle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500 hover:text-slate-900 transition-colors">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V6zM9 3.75v16.5" />
    </svg>
  ),
  Activate: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Deactivate: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  Delete: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
};

const SidebarItem = ({ label, id, activeTab, setActiveTab, icon: Icon, isSidebarOpen }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
      activeTab === id 
        ? "bg-brand-50 text-brand-700" 
        : "text-slate-600 hover:bg-slate-100"
    } ${!isSidebarOpen ? 'justify-center !px-0' : ''}`}
    title={!isSidebarOpen ? label : ""}
  >
    <div className="shrink-0">{Icon && <Icon />}</div>
    {isSidebarOpen && <span className="truncate">{label}</span>}
  </button>
);

const PaginationControls = ({ currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, totalItems }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t bg-slate-50 rounded-b-xl mt-auto">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Rows per page:</span>
        <select 
          value={itemsPerPage} 
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border rounded p-1 text-sm bg-white outline-none focus:ring-1 focus:ring-brand-500"
        >
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1 px-3 border rounded bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Prev
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1 px-3 border rounded bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [stats, setStats] = useState({ totalUsers: 0, totalMachines: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedRowId(null);
  }, [activeTab, itemsPerPage]);

  const loadData = async () => {
    const [statsRes, usersRes, machineRes, bookingRes, feedbackRes] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/machines/all"),
      api.get("/bookings/admin/all"),
      api.get("/feedback/admin"),
    ]);

    setStats(statsRes.data);
    setUsers(usersRes.data);
    setMachines(machineRes.data);
    setBookings(bookingRes.data);
    setFeedbacks(feedbackRes.data);
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate, user]);

  const toggleBlockUser = async (id) => {
    await api.put(`/admin/users/${id}/toggle-block`);
    loadData();
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    await api.put(`/admin/users/${userToDelete}/delete`);
    setDeleteModalOpen(false);
    setUserToDelete(null);
    loadData();
  };

  const verifyMachine = async (id) => {
    await api.put(`/admin/machines/${id}/verify`);
    loadData();
  };

  const rejectMachine = async (id) => {
    await api.put(`/admin/machines/${id}/reject`);
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

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const farmers = users.filter((u) => u.role === "farmer");
  const owners = users.filter((u) => u.role === "owner");

  const getPaginatedData = (data) => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const renderOverview = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card border border-slate-100 shadow-sm"><p className="text-slate-500 font-medium">{t("totalUsers")}</p><p className="text-4xl font-bold text-slate-800 mt-2">{stats.totalUsers}</p></div>
      <div className="card border border-slate-100 shadow-sm"><p className="text-slate-500 font-medium">{t("totalMachines")}</p><p className="text-4xl font-bold text-brand-700 mt-2">{stats.totalMachines}</p></div>
      <div className="card border border-slate-100 shadow-sm"><p className="text-slate-500 font-medium">{t("totalRevenue")}</p><p className="text-4xl font-bold text-slate-800 mt-2">INR {stats.totalRevenue.toFixed(2)}</p></div>
    </div>
  );

  const renderFarmers = () => {
    const data = getPaginatedData(farmers);
    return (
      <div className="card flex flex-col h-full border border-slate-100 p-0 overflow-hidden">
        <div className="p-5 border-b"><h2 className="text-xl font-bold text-slate-800">{t("farmerTable")}</h2></div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-[700px] w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 font-semibold">Farmer ID</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Phone Number</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-600">{item.farmerId || "-"}</td>
                  <td className="p-3 font-medium text-slate-800">{item.name}</td>
                  <td className="p-3 text-slate-600">{item.email}</td>
                  <td className="p-3 text-slate-600">{item.phone}</td>
                  <td className="p-3 text-slate-600">{item.location}</td>
                  <td className="p-3">
                    {item.isDeleted ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Deleted</span>
                    ) : item.isBlocked ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Deactivated</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                    )}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {!item.isDeleted && (
                      <>
                        <button 
                          className={`${item.isBlocked ? 'text-green-600 hover:text-green-700' : 'text-amber-600 hover:text-amber-700'} p-1 rounded hover:bg-slate-100 transition-colors`} 
                          title={item.isBlocked ? "Activate Account" : "Deactivate Account"}
                          onClick={() => toggleBlockUser(item._id)}
                        >
                          {item.isBlocked ? <Icons.Activate /> : <Icons.Deactivate />}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" 
                          title="Permanently Delete"
                          onClick={() => { setUserToDelete(item._id); setDeleteModalOpen(true); }}
                        >
                          <Icons.Delete />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-slate-500">No farmers found.</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalItems={farmers.length} />
      </div>
    );
  };

  const renderOwners = () => {
    const data = getPaginatedData(owners);
    return (
      <div className="card flex flex-col h-full border border-slate-100 p-0 overflow-hidden">
        <div className="p-5 border-b"><h2 className="text-xl font-bold text-slate-800">{t("ownerTable")}</h2></div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-[700px] w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 font-semibold">Owner ID</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Phone Number</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-600">{item.ownerId || "-"}</td>
                  <td className="p-3 font-medium text-slate-800">{item.name}</td>
                  <td className="p-3 text-slate-600">{item.email}</td>
                  <td className="p-3 text-slate-600">{item.phone}</td>
                  <td className="p-3 text-slate-600">{item.location}</td>
                  <td className="p-3">
                    {item.isDeleted ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Deleted</span>
                    ) : item.isBlocked ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Deactivated</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                    )}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {!item.isDeleted && (
                      <>
                        <button 
                          className={`${item.isBlocked ? 'text-green-600 hover:text-green-700' : 'text-amber-600 hover:text-amber-700'} p-1 rounded hover:bg-slate-100 transition-colors`} 
                          title={item.isBlocked ? "Activate Account" : "Deactivate Account"}
                          onClick={() => toggleBlockUser(item._id)}
                        >
                          {item.isBlocked ? <Icons.Activate /> : <Icons.Deactivate />}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" 
                          title="Permanently Delete"
                          onClick={() => { setUserToDelete(item._id); setDeleteModalOpen(true); }}
                        >
                          <Icons.Delete />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-slate-500">No owners found.</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalItems={owners.length} />
      </div>
    );
  };

  const renderMachines = () => {
    const data = getPaginatedData(machines);
    return (
      <div className="card flex flex-col h-full border border-slate-100 p-0 overflow-hidden">
        <div className="p-5 border-b"><h2 className="text-xl font-bold text-slate-800">{t("machineTable")} (with Details)</h2></div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-[1000px] w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 font-semibold w-10"></th>
                <th className="p-3 font-semibold">Machine ID</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Owner</th>
                <th className="p-3 font-semibold">Driver</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((machine) => {
                const isExpanded = expandedRowId === machine._id;
                return (
                  <React.Fragment key={machine._id}>
                    <tr 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${isExpanded ? 'bg-brand-50/30' : ''}`}
                      onClick={() => setExpandedRowId(isExpanded ? null : machine._id)}
                    >
                      <td className="p-3 text-slate-400">
                        <span className="inline-block transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                      </td>
                      <td className="p-3 font-medium text-brand-700">{machine.machineCode || machine._id}</td>
                      <td className="p-3 font-medium text-slate-800">{machine.name}</td>
                      <td className="p-3 text-slate-600">{machine.type}</td>
                      <td className="p-3 text-slate-600">{machine.ownerId?.name || "-"}</td>
                      <td className="p-3 text-slate-600">{machine.driverName || "-"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          machine.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {machine.verificationStatus || (machine.verified ? "Approved" : "Pending")}
                        </span>
                      </td>
                      <td className="p-3" onClick={e => e.stopPropagation()}>
                        {!machine.verified && (
                          <div className="flex gap-2">
                            <button className="text-brand-600 font-medium hover:underline" onClick={() => verifyMachine(machine._id)}>{t("verifyMachine")}</button>
                            {machine.verificationStatus !== "Rejected" && <button className="text-red-600 font-medium hover:underline" onClick={() => rejectMachine(machine._id)}>Reject</button>}
                          </div>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50 border-b border-slate-200">
                        <td colSpan="8" className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 animate-in slide-in-from-top-2 duration-200">
                            {/* Machine Details */}
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                              <h4 className="font-bold text-brand-700 mb-3 flex items-center gap-2">🚜 Machine Details</h4>
                              <div className="flex gap-4">
                                <img src={getMachineImageUrl(machine.image)} alt={machine.name} className="h-24 w-24 rounded-lg object-cover border" />
                                <div className="space-y-1 text-sm">
                                  <p><span className="text-slate-500">Reg No:</span> <span className="font-medium">{machine.registrationNumber || "-"}</span></p>
                                  <p><span className="text-slate-500">Price:</span> <span className="font-medium">INR {machine.price} / {machine.priceUnit}</span></p>
                                  <p><span className="text-slate-500">Location:</span> <span className="font-medium">{machine.location}</span></p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Owner Details */}
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                              <h4 className="font-bold text-indigo-700 mb-3 flex items-center gap-2">👤 Owner Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-slate-500">ID:</span> <span className="font-medium">{machine.ownerId?.ownerId || "-"}</span></p>
                                <p><span className="text-slate-500">Name:</span> <span className="font-medium">{machine.ownerId?.name || "-"}</span></p>
                                <p><span className="text-slate-500">Phone:</span> <span className="font-medium">{machine.ownerId?.phone || "-"}</span></p>
                                <p><span className="text-slate-500">Email:</span> <span className="font-medium">{machine.ownerId?.email || "-"}</span></p>
                              </div>
                            </div>

                            {/* Driver Details */}
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                              <h4 className="font-bold text-amber-600 mb-3 flex items-center gap-2">👷 Driver Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-slate-500">ID:</span> <span className="font-medium">{machine.driverId || "-"}</span></p>
                                <p><span className="text-slate-500">Name:</span> <span className="font-medium">{machine.driverName || "-"}</span></p>
                                <p><span className="text-slate-500">Phone:</span> <span className="font-medium">{machine.driverPhoneNumber || "-"}</span></p>
                                <p><span className="text-slate-500">License:</span> <span className="font-medium">{machine.driverLicenseNumber || "-"}</span></p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {data.length === 0 && <tr><td colSpan="8" className="p-4 text-center text-slate-500">No machines found.</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalItems={machines.length} />
      </div>
    );
  };

  const renderBookings = () => {
    const data = getPaginatedData(bookings);
    return (
      <div className="card flex flex-col h-full border border-slate-100 p-0 overflow-hidden">
        <div className="p-5 border-b"><h2 className="text-xl font-bold text-slate-800">{t("bookingTable")}</h2></div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-[1200px] w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 font-semibold">Booking ID</th>
                <th className="p-3 font-semibold">Farmer Name</th>
                <th className="p-3 font-semibold">Owner Name</th>
                <th className="p-3 font-semibold">Machine Name</th>
                <th className="p-3 font-semibold">From Time</th>
                <th className="p-3 font-semibold">To Time</th>
                <th className="p-3 font-semibold">Duration</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-600 font-medium">{booking.bookingCode || booking._id}</td>
                  <td className="p-3 text-slate-800">{booking.farmerId?.name}</td>
                  <td className="p-3 text-slate-800">{booking.ownerId?.name}</td>
                  <td className="p-3 text-slate-800">{booking.machineId?.name}</td>
                  <td className="p-3 text-slate-600">{booking.fromTime || "-"}</td>
                  <td className="p-3 text-slate-600">{booking.toTime || "-"}</td>
                  <td className="p-3 text-slate-600">{booking.durationHours ? `${booking.durationHours} hr` : "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-brand-600 hover:underline font-medium text-sm" onClick={() => downloadInvoice(booking._id)}>{t("downloadPdf")}</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="9" className="p-4 text-center text-slate-500">No bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalItems={bookings.length} />
      </div>
    );
  };

  const renderFeedbacks = () => {
    const data = getPaginatedData(feedbacks);
    return (
      <div className="card flex flex-col h-full border border-slate-100 p-0 overflow-hidden">
        <div className="p-5 border-b"><h2 className="text-xl font-bold text-slate-800">{t("feedbackTable")}</h2></div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-[650px] w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 font-semibold">Feedback ID</th>
                <th className="p-3 font-semibold">Booking ID</th>
                <th className="p-3 font-semibold">Farmer ID</th>
                <th className="p-3 font-semibold">Farmer Name</th>
                <th className="p-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((feedback) => (
                <tr key={feedback._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-600 font-medium">{feedback.feedbackCode || feedback._id}</td>
                  <td className="p-3 text-slate-600">{feedback.bookingId?.bookingCode || feedback.bookingId || "-"}</td>
                  <td className="p-3 text-slate-600">{feedback.farmerId?.farmerId || "-"}</td>
                  <td className="p-3 text-slate-800 font-medium">{feedback.farmerId?.name || "-"}</td>
                  <td className="p-3 text-slate-600 max-w-sm truncate" title={feedback.description}>{feedback.description}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-slate-500">No feedbacks found.</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalItems={feedbacks.length} />
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Mobile Tab Selector */}
      <div className="md:hidden bg-white border-b p-4">
        <select 
          value={activeTab} 
          onChange={e => setActiveTab(e.target.value)}
          className="w-full border-slate-200 rounded-lg p-2 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="overview">Overview</option>
          <option value="farmers">Farmers</option>
          <option value="owners">Machinery Owner</option>
          <option value="machines">Machines & Drivers</option>
          <option value="bookings">Bookings</option>
          <option value="feedbacks">Feedbacks</option>
        </select>
      </div>

      {/* Desktop Sidebar (Collapsible) */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-[72px]'} hidden md:flex flex-col bg-white border-r shadow-sm transition-all duration-300 ease-in-out shrink-0`}
      >
        <div className={`p-4 border-b flex items-center min-h-[64px] ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && <span className="font-bold text-brand-700 text-xl truncate tracking-tight">Admin Panel</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors`}
            title="Toggle Sidebar"
          >
            <Icons.PanelToggle />
          </button>
        </div>

        <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          <SidebarItem icon={Icons.Overview} label="Overview" id="overview" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Icons.Farmers} label="Farmers" id="farmers" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Icons.Owners} label="Machinery Owner" id="owners" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Icons.Machines} label="Machines & Drivers" id="machines" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Icons.Bookings} label="Bookings" id="bookings" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Icons.Feedbacks} label="Feedbacks" id="feedbacks" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t mt-auto">
          {isSidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <span className="font-bold text-lg">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 text-sm truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "admin@example.com"}</p>
                </div>
              </div>
              <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-red-600 transition-colors shrink-0 ml-2">
                <Icons.Logout />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mx-auto" title={user?.name}>
                <span className="font-bold text-lg">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
              </div>
              <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
                <Icons.Logout />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden flex flex-col max-w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
            {activeTab.replace(/([A-Z])/g, ' $1').trim()} Dashboard
          </h1>
        </div>
        
        <div className="flex-1 min-h-0">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "farmers" && renderFarmers()}
          {activeTab === "owners" && renderOwners()}
          {activeTab === "machines" && renderMachines()}
          {activeTab === "bookings" && renderBookings()}
          {activeTab === "feedbacks" && renderFeedbacks()}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete User</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to permanently delete this user? They will no longer be able to access the platform, but their existing data will remain in the admin records. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
                className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={deleteUser}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
