const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const INVOICE_LABELS = {
  en: {
    title: "AgroRent Booking Invoice",
    bookingId: "Booking ID",
    farmerName: "Farmer Name",
    farmerPhone: "Farmer Phone Number",
    ownerName: "Machinery Owner Name",
    machineName: "Machine Name",
    machineType: "Machine Type",
    machineReg: "Machine Registration Number",
    driverId: "Driver ID",
    driverName: "Driver Name",
    driverLicense: "Driver License Number",
    driverPhone: "Driver Phone Number",
    farmerLocation: "Farmer Location",
    startDate: "Start Date",
    time: "From Time - To Time",
    duration: "Duration",
    total: "Total Amount",
    commission: "Admin Commission (5%)",
    ownerPay: "Cash on Delivery (95%)",
  },
  ta: {
    title: "\u0B85\u0B95\u0BCD\u0BB0\u0BCB\u0BB0\u0BC6\u0BA8\u0BCD\u0B9F\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0BB0\u0B9A\u0BC0\u0BA4\u0BC1",
    bookingId: "\u0BAE\u0BC1\u0BA9\u0BCD\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B90\u0B9F\u0BBF",
    farmerName: "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    farmerPhone: "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF \u0B95\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF \u0B8E\u0BA3\u0BCD",
    ownerName: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0B89\u0BB0\u0BBF\u0BAE\u0BC8\u0BAF\u0BBE\u0BB3\u0BB0\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    machineName: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    machineType: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BB5\u0B95\u0BC8",
    machineReg: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B8E\u0BA3\u0BCD",
    driverId: "\u0B93\u0B9F\u0BCD\u0B9F\u0BC1\u0BA8\u0BB0\u0BCD \u0B90\u0B9F\u0BBF",
    driverName: "\u0B93\u0B9F\u0BCD\u0B9F\u0BC1\u0BA8\u0BB0\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    driverLicense: "\u0B93\u0B9F\u0BCD\u0B9F\u0BC1\u0BA8\u0BB0\u0BCD \u0B89\u0BB0\u0BBF\u0BAE \u0B8E\u0BA3\u0BCD",
    driverPhone: "\u0B93\u0B9F\u0BCD\u0B9F\u0BC1\u0BA8\u0BB0\u0BCD \u0B95\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF \u0B8E\u0BA3\u0BCD",
    farmerLocation: "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF \u0B87\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAE\u0BCD",
    startDate: "\u0BA4\u0BCA\u0B9F\u0B95\u0BCD\u0B95 \u0BA4\u0BC7\u0BA4\u0BBF",
    time: "\u0BA4\u0BCA\u0B9F\u0B95\u0BCD\u0B95\u0BAE\u0BCD - \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BC1 \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
    duration: "\u0BA8\u0BC7\u0BB0 \u0B85\u0BB3\u0BB5\u0BC1",
    total: "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BA4\u0BCA\u0B95\u0BC8",
    commission: "\u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0BBE\u0B95 \u0B95\u0BAE\u0BBF\u0BB7\u0BA9\u0BCD (5%)",
    ownerPay: "COD \u0BA4\u0BCA\u0B95\u0BC8 (95%)",
  },
};

const buildInvoiceLines = ({ booking, lang = "en" }) => {
  const labels = INVOICE_LABELS[lang] || INVOICE_LABELS.en;
  const adminCommission = booking.totalAmount * 0.05;
  const ownerPayment = booking.totalAmount * 0.95;

  return {
    labels,
    lines: [
      `${labels.bookingId}: ${booking.bookingCode || booking._id}`,
      `${labels.farmerName}: ${booking.farmerId?.name || "N/A"}`,
      `${labels.farmerPhone}: ${booking.farmerId?.phone || "N/A"}`,
      `${labels.ownerName}: ${booking.ownerId?.name || "N/A"}`,
      `${labels.machineName}: ${booking.machineId?.name || "N/A"}`,
      `${labels.machineType}: ${booking.machineId?.type || "N/A"}`,
      `${labels.machineReg}: ${booking.machineId?.registrationNumber || "N/A"}`,
      `${labels.driverId}: ${booking.machineId?.driverId || "N/A"}`,
      `${labels.driverName}: ${booking.machineId?.driverName || "N/A"}`,
      `${labels.driverLicense}: ${booking.machineId?.driverLicenseNumber || "N/A"}`,
      `${labels.driverPhone}: ${booking.machineId?.driverPhoneNumber || "N/A"}`,
      `${labels.farmerLocation}: ${booking.farmerId?.location || "N/A"}`,
      `${labels.startDate}: ${new Date(booking.startDate).toLocaleDateString()}`,
      `${labels.time}: ${booking.fromTime} - ${booking.toTime}`,
      `${labels.duration}: ${booking.durationHours} hour(s)`,
      `${labels.total}: INR ${booking.totalAmount.toFixed(2)}`,
      `${labels.commission}: INR ${adminCommission.toFixed(2)}`,
      `${labels.ownerPay}: INR ${ownerPayment.toFixed(2)}`,
    ],
  };
};

const createInvoiceBuffer = ({ booking, lang = "en" }) =>
  new Promise((resolve, reject) => {
    try {
      const { labels, lines } = buildInvoiceLines({ booking, lang });
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(18).text(labels.title, { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      lines.forEach((line) => doc.text(line));
      doc.end();
    } catch (error) {
      reject(error);
    }
  });

const saveInvoiceFile = async ({ booking, lang = "en" }) => {
  const invoicesDir = path.join(__dirname, "..", "invoices");
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const pdfBuffer = await createInvoiceBuffer({ booking, lang });
  const fileName = `invoice-${booking._id}-${lang}.pdf`;
  const absolutePath = path.join(invoicesDir, fileName);
  fs.writeFileSync(absolutePath, pdfBuffer);
  return absolutePath;
};

module.exports = {
  createInvoiceBuffer,
  saveInvoiceFile,
};
