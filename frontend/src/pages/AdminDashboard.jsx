import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getMachineImageUrl } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { t, lang } = useLanguage();

  const [stats, setStats] = useState({ totalUsers: 0, totalMachines: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

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

  const blockUser = async (id) => {
    await api.put(`/admin/users/${id}/block`);
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

  const farmers = users.filter((userItem) => userItem.role === "farmer");
  const owners = users.filter((userItem) => userItem.role === "owner");

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

  return (
      <div className="mx-auto max-w-6xl space-y-8 p-4 sm:py-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card"><p className="text-slate-600">{t("totalUsers")}</p><p className="text-3xl font-bold">{stats.totalUsers}</p></div>
          <div className="card"><p className="text-slate-600">{t("totalMachines")}</p><p className="text-3xl font-bold">{stats.totalMachines}</p></div>
          <div className="card"><p className="text-slate-600">{t("totalRevenue")}</p><p className="text-3xl font-bold">INR {stats.totalRevenue.toFixed(2)}</p></div>
        </section>

        <section className="card overflow-hidden">
          <h2 className="text-xl font-bold mb-3">{t("farmerTable")}</h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5"><table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Farmer ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Phone Number</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{item.farmerId || "-"}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.email}</td>
                  <td className="p-2">{item.phone}</td>
                  <td className="p-2">{item.location}</td>
                  <td className="p-2">
                    <button className="btn-primary" onClick={() => blockUser(item._id)}>Block User</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        <section className="card overflow-hidden">
          <h2 className="text-xl font-bold mb-3">{t("ownerTable")}</h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5"><table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Owner ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Phone Number</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{item.ownerId || "-"}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.email}</td>
                  <td className="p-2">{item.phone}</td>
                  <td className="p-2">{item.location}</td>
                  <td className="p-2">
                    <button className="btn-primary" onClick={() => blockUser(item._id)}>Block User</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        <section className="card overflow-hidden">
          <h2 className="text-xl font-bold mb-3">{t("machineTable")}</h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5"><table className="min-w-[1300px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Machine ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Image</th>
                <th className="text-left p-2">Reg. No</th>
                <th className="text-left p-2">Driver ID</th>
                <th className="text-left p-2">Driver Name</th>
                <th className="text-left p-2">License No</th>
                <th className="text-left p-2">Driver Phone</th>
                <th className="text-left p-2">Owner ID</th>
                <th className="text-left p-2">Owner</th>
                <th className="text-left p-2">Verification</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((machine) => (
                <tr key={machine._id} className="border-b">
                  <td className="p-2">{machine.machineCode || machine._id}</td>
                  <td className="p-2">{machine.name}</td>
                  <td className="p-2">{machine.type}</td>
                  <td className="p-2"><img src={getMachineImageUrl(machine.image)} alt={machine.name} className="h-12 w-16 rounded object-cover" /></td>
                  <td className="p-2">{machine.registrationNumber || "-"}</td>
                  <td className="p-2">{machine.driverId || "-"}</td>
                  <td className="p-2">{machine.driverName || "-"}</td>
                  <td className="p-2">{machine.driverLicenseNumber || "-"}</td>
                  <td className="p-2">{machine.driverPhoneNumber || "-"}</td>
                  <td className="p-2">{machine.ownerId?.ownerId || "-"}</td>
                  <td className="p-2">{machine.ownerId?.name || "-"}</td>
                  <td className="p-2">{machine.verificationStatus || (machine.verified ? "Approved" : "Pending")}</td>
                  <td className="p-2">
                    {!machine.verified && (
                      <div className="flex gap-2">
                        <button className="btn-primary" onClick={() => verifyMachine(machine._id)}>{t("verifyMachine")}</button>
                        {machine.verificationStatus !== "Rejected" && <button className="btn-outline" onClick={() => rejectMachine(machine._id)}>Reject</button>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        <section className="card overflow-hidden">
          <h2 className="text-xl font-bold mb-3">{t("bookingTable")}</h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5"><table className="min-w-[1200px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Booking ID</th>
                <th className="text-left p-2">Farmer ID</th>
                <th className="text-left p-2">Farmer Name</th>
                <th className="text-left p-2">Owner ID</th>
                <th className="text-left p-2">Owner Name</th>
                <th className="text-left p-2">Machine ID</th>
                <th className="text-left p-2">Machine Name</th>
                <th className="text-left p-2">Machine Type</th>
                <th className="text-left p-2">From Time</th>
                <th className="text-left p-2">To Time</th>
                <th className="text-left p-2">Duration</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="p-2">{booking.bookingCode || booking._id}</td>
                  <td className="p-2">{booking.farmerId?.farmerId || "-"}</td>
                  <td className="p-2">{booking.farmerId?.name}</td>
                  <td className="p-2">{booking.ownerId?.ownerId || "-"}</td>
                  <td className="p-2">{booking.ownerId?.name}</td>
                  <td className="p-2">{booking.machineId?.machineCode || "-"}</td>
                  <td className="p-2">{booking.machineId?.name}</td>
                  <td className="p-2">{booking.machineId?.type}</td>
                  <td className="p-2">{booking.fromTime || "-"}</td>
                  <td className="p-2">{booking.toTime || "-"}</td>
                  <td className="p-2">{booking.durationHours ? `${booking.durationHours} hr` : "-"}</td>
                  <td className="p-2">{booking.status}</td>
                  <td className="p-2"><button className="btn-outline" onClick={() => downloadInvoice(booking._id)}>{t("downloadPdf")}</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        <section className="card overflow-hidden">
          <h2 className="text-xl font-bold mb-3">{t("feedbackTable")}</h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5"><table className="min-w-[650px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Feedback ID</th>
                <th className="text-left p-2">Booking ID</th>
                <th className="text-left p-2">Farmer ID</th>
                <th className="text-left p-2">Farmer Name</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id} className="border-b">
                  <td className="p-2">{feedback.feedbackCode || feedback._id}</td>
                  <td className="p-2">{feedback.bookingId?.bookingCode || feedback.bookingId || "-"}</td>
                  <td className="p-2">{feedback.farmerId?.farmerId || "-"}</td>
                  <td className="p-2">{feedback.farmerId?.name || "-"}</td>
                  <td className="p-2">{feedback.description}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>
      </div>
  );
};

export default AdminDashboard;
