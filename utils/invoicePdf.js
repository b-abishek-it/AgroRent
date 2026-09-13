const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const INVOICE_LABELS = {
  en: {
    agrorent: "AgroRent",
    bookingInvoice: "Booking Invoice",
    system: "Agriculture Machinery Rental System",
    bookingId: "Booking ID",
    invoiceDate: "Invoice Date",
    farmerDetails: "Farmer Details",
    farmerName: "Farmer Name",
    farmerPhone: "Farmer Phone Number",
    machineryDetails: "Machinery Details",
    ownerName: "Machinery Owner Name",
    machineName: "Machine Name",
    machineType: "Machine Type",
    machineReg: "Registration Number",
    driverName: "Driver Name",
    driverPhone: "Driver Phone Number",
    locationDetails: "Location Details",
    location: "Location",
    startDate: "Start Date",
    time: "From Time - To Time",
    duration: "Duration",
    paymentDetails: "Payment Details",
    amountInr: "Amount (INR)",
    totalAmount: "Total Amount",
    platformFees: "Platform fees (5%)",
    cashOnDelivery: "Cash on Delivery (95%)",
    grandTotal: "Grand Total",
    thankYou: "Thank you for choosing AgroRent.",
    queries: "For any queries, please contact the respective machinery owner or our support team.",
    slogan: "Safe Farms   |   Better Tomorrow"
  },
  ta: {
    agrorent: "AgroRent",
    bookingInvoice: "\u0BAE\u0BC1\u0BA9\u0BCD\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0BB0\u0B9A\u0BC0\u0BA4\u0BC1",
    system: "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF \u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BB5\u0BBE\u0B9F\u0B95\u0BC8 \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1",
    bookingId: "\u0BAE\u0BC1\u0BA9\u0BCD\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B90\u0B9F\u0BBF",
    invoiceDate: "\u0BA4\u0BC7\u0BA4\u0BBF",
    farmerDetails: "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    farmerName: "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    farmerPhone: "\u0B95\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF \u0B8E\u0BA3\u0BCD",
    machineryDetails: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    ownerName: "\u0B89\u0BB0\u0BBF\u0BAE\u0BC8\u0BAF\u0BBE\u0BB3\u0BB0\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    machineName: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    machineType: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BB5\u0B95\u0BC8",
    machineReg: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B8E\u0BA3\u0BCD",
    driverName: "\u0B93\u0B9F\u0BCD\u0B9F\u0BC1\u0BA8\u0BB0\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    driverPhone: "\u0B93\u0B9F\u0BCD\u0B9F\u0BC1\u0BA8\u0BB0\u0BCD \u0B95\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF \u0B8E\u0BA3\u0BCD",
    locationDetails: "\u0B87\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    location: "\u0B87\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAE\u0BCD",
    startDate: "\u0BA4\u0BCA\u0B9F\u0B95\u0BCD\u0B95 \u0BA4\u0BC7\u0BA4\u0BBF",
    time: "\u0BA4\u0BCA\u0B9F\u0B95\u0BCD\u0B95\u0BAE\u0BCD - \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BC1",
    duration: "\u0BA8\u0BC7\u0BB0 \u0B85\u0BB3\u0BB5\u0BC1",
    paymentDetails: "\u0B95\u0B9F\u0BCD\u0B9F\u0BA3 \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    amountInr: "\u0BA4\u0BCA\u0B95\u0BC8",
    totalAmount: "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BA4\u0BCA\u0B95\u0BC8",
    platformFees: "\u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BA4\u0BB3 \u0B95\u0B9F\u0BCD\u0B9F\u0BA3\u0BAE\u0BCD (5%)",
    cashOnDelivery: "COD \u0BA4\u0BCA\u0B95\u0BC8 (95%)",
    grandTotal: "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD",
    thankYou: "\u0B85\u0B95\u0BCD\u0BB0\u0BCB\u0BB0\u0BC6\u0BA8\u0BCD\u0B9F\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BA4\u0BB1\u0BCD\u0B95\u0BC1 \u0BA8\u0BA9\u0BCD\u0BB1\u0BBF.",
    queries: "\u0B89\u0BA4\u0BB5\u0BBF\u0B95\u0BCD\u0B95\u0BC1, support@agrorent.com \u0B90 \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BC1 \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BB5\u0BC1\u0BAE\u0BCD.",
    slogan: "Safe Farms   |   Better Tomorrow"
  }
};

const THEME = {
  primary: '#15803d', // Tailwind green-700
  secondary: '#dcfce7', // Light green
  textDark: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
  white: '#ffffff'
};

function drawFullHeader(doc, labels, booking) {
  // Green background block
  doc.rect(0, 0, 612, 140).fill(THEME.primary);

  // Left text
  doc.fillColor(THEME.white).font('Helvetica-Bold').fontSize(36).text(labels.agrorent, 40, 40);
  doc.fontSize(22).text(labels.bookingInvoice, 40, 80);
  doc.font('Helvetica').fontSize(12).text(labels.system, 40, 110);

  // Vertical separator
  doc.moveTo(430, 40).lineTo(430, 100).lineWidth(1).strokeColor(THEME.white).stroke();

  // Right text
  doc.font('Helvetica').fontSize(11).text(labels.bookingId, 450, 40);
  doc.font('Helvetica-Bold').fontSize(24).text(booking.bookingCode || booking._id, 450, 55);

  doc.font('Helvetica').fontSize(11).text(labels.invoiceDate, 450, 90);
  doc.font('Helvetica').fontSize(12).text(new Date(booking.startDate).toLocaleDateString(), 450, 105);
}

function drawSectionTitle(doc, title, x, y) {
  doc.fillColor(THEME.primary).font('Helvetica-Bold').fontSize(14).text(title, x, y);
  const width = doc.widthOfString(title);
  doc.moveTo(x, y + 16).lineTo(x + width, y + 16).lineWidth(2).strokeColor(THEME.primary).stroke();
}

function drawKeyValue(doc, label, value, xLabel, xValue, y) {
  doc.fillColor(THEME.textLight).font('Helvetica').fontSize(10).text(label, xLabel, y);
  doc.fillColor(THEME.textDark).font('Helvetica-Bold').fontSize(10).text(value, xValue, y);
}

function generateDetails(doc, labels, booking) {
  // --- Row 1: Farmer Details & Machinery Details ---
  const row1Y = 170;

  // Left: Farmer Details
  drawSectionTitle(doc, labels.farmerDetails, 40, row1Y);
  drawKeyValue(doc, labels.farmerName, booking.farmerId?.name || "N/A", 40, 180, row1Y + 35);
  drawKeyValue(doc, labels.farmerPhone, booking.farmerId?.phone || "N/A", 40, 180, row1Y + 55);

  // Right: Machinery Details
  drawSectionTitle(doc, labels.machineryDetails, 320, row1Y);
  drawKeyValue(doc, labels.ownerName, booking.ownerId?.name || "N/A", 320, 450, row1Y + 35);
  drawKeyValue(doc, labels.machineName, booking.machineId?.name || "N/A", 320, 450, row1Y + 55);
  drawKeyValue(doc, labels.machineType, booking.machineId?.type || "N/A", 320, 450, row1Y + 75);
  drawKeyValue(doc, labels.machineReg, booking.machineId?.registrationNumber || "N/A", 320, 450, row1Y + 95);
  drawKeyValue(doc, labels.driverName, booking.machineId?.driverName || "N/A", 320, 450, row1Y + 115);
  drawKeyValue(doc, labels.driverPhone, booking.machineId?.driverPhoneNumber || "N/A", 320, 450, row1Y + 135);

  // --- Row 2: Location Details ---
  const row2Y = 320;
  drawSectionTitle(doc, labels.locationDetails, 40, row2Y);
  drawKeyValue(doc, labels.location, booking.farmerId?.location || "N/A", 40, 180, row2Y + 35);
  drawKeyValue(doc, labels.startDate, new Date(booking.startDate).toLocaleDateString(), 40, 180, row2Y + 55);
  drawKeyValue(doc, labels.time, `${booking.fromTime} - ${booking.toTime}`, 40, 180, row2Y + 75);
  drawKeyValue(doc, labels.duration, `${booking.durationHours} hour(s)`, 40, 180, row2Y + 95);
}

function generatePaymentTable(doc, labels, booking) {
  const startY = 460;

  // Header Row (Rounded Rect)
  doc.roundedRect(40, startY, 532, 35, 6).fill(THEME.primary);
  doc.fillColor(THEME.white).font('Helvetica-Bold').fontSize(12);
  doc.text(labels.paymentDetails, 55, startY + 12);
  doc.text(labels.amountInr, 450, startY + 12, { width: 105, align: 'right' });

  // Rows
  const adminCommission = booking.totalAmount * 0.05;
  const ownerPayment = booking.totalAmount * 0.95;
  const totalStr = booking.totalAmount.toFixed(2);
  const commStr = adminCommission.toFixed(2);
  const codStr = ownerPayment.toFixed(2);

  // Row 1: Total Amount
  drawTableRow(doc, startY + 35, labels.totalAmount, totalStr);

  // Row 2: Platform fees
  drawTableRow(doc, startY + 70, labels.platformFees, commStr);

  // Row 3: Cash on Delivery
  drawTableRow(doc, startY + 105, labels.cashOnDelivery, codStr, false); // No bottom border

  // Grand Total Box
  const grandY = startY + 155;
  doc.roundedRect(40, grandY, 532, 45, 6).fill('#eefbf2'); // Very light green
  doc.fillColor(THEME.primary).font('Helvetica-Bold').fontSize(16);
  doc.text(labels.grandTotal, 55, grandY + 14);
  doc.text(`INR ${totalStr}`, 400, grandY + 14, { width: 155, align: 'right' });
}

function drawTableRow(doc, y, label, amount, border = true) {
  doc.fillColor(THEME.textLight).font('Helvetica').fontSize(11).text(label, 55, y + 12);
  doc.fillColor(THEME.textDark).font('Helvetica-Bold').fontSize(12).text(amount, 450, y + 12, { width: 105, align: 'right' });

  if (border) {
    doc.moveTo(40, y + 35).lineTo(572, y + 35).lineWidth(1).strokeColor(THEME.border).stroke();
  }
}

function generateFooter(doc, labels) {
  const footerY = 670;

  // Top Line
  doc.moveTo(40, footerY).lineTo(572, footerY).lineWidth(1).strokeColor(THEME.primary).stroke();

  // Text
  doc.fillColor(THEME.primary).font('Helvetica-Bold').fontSize(11).text(labels.thankYou, 40, footerY + 15);
  doc.fillColor(THEME.textLight).font('Helvetica').fontSize(10).text(labels.queries, 40, footerY + 32, { width: 350 });

  doc.fillColor(THEME.primary).font('Helvetica').fontSize(10).text(labels.slogan, 400, footerY + 32, { width: 172, align: 'right' });

  // Bottom Bar (touching the very bottom edge of A4)
  const barHeight = 30;
  const barY = doc.page.height - barHeight;
  doc.rect(0, barY, doc.page.width, barHeight).fill(THEME.primary);
  
  // Industry standard text inside the footer bar
  doc.fillColor(THEME.white).font('Helvetica').fontSize(9)
     .text("This is a computer-generated document. No signature is required.", 0, barY + 10, { align: 'center', width: doc.page.width });
}

const createInvoiceBuffer = ({ booking, lang = "en" }) =>
  new Promise((resolve, reject) => {
    try {
      const labels = INVOICE_LABELS[lang] || INVOICE_LABELS.en;

      const doc = new PDFDocument({ margin: 0, size: 'A4' }); // Removing default margin so rects can touch edges
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      drawFullHeader(doc, labels, booking);
      generateDetails(doc, labels, booking);
      generatePaymentTable(doc, labels, booking);
      generateFooter(doc, labels);

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
