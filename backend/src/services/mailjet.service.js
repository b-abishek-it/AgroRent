const Mailjet = require("node-mailjet");

let mailjetClient = null;

const getMailjetClient = () => {
  if (!mailjetClient) {
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
      console.warn("Mailjet API Key or Secret is missing. Emails may fail.");
    }
    mailjetClient = Mailjet.apiConnect(
      process.env.MAILJET_API_KEY || "",
      process.env.MAILJET_API_SECRET || ""
    );
  }
  return mailjetClient;
};

const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  try {
    const mailjet = getMailjetClient();
    const fromEmail = process.env.MAILJET_FROM_EMAIL || "itabishek7@gmail.com";
    const fromName = process.env.MAILJET_FROM_NAME || "AgroRent";
    const templateId = process.env.MAILJET_WELCOME_TEMPLATE_ID;

    // Use Template API if Template ID is provided in .env
    const messageConfig = {
      From: {
        Email: fromEmail,
        Name: fromName,
      },
      To: [
        {
          Email: userEmail,
          Name: userName,
        },
      ],
      Subject: "Welcome to AgroRent 🌱",
    };

    const displayRole = userRole === "owner" ? "Machinery Owner" : (userRole === "farmer" ? "Farmer" : userRole);

    if (templateId && templateId !== "your_welcome_template_id_here") {
      messageConfig.TemplateID = parseInt(templateId, 10);
      messageConfig.TemplateLanguage = true;
      messageConfig.Variables = {
        userName: userName,
        userRole: displayRole,
      };
    } else {
      // Fallback to HTMLPart if no template ID is configured
      messageConfig.HTMLPart = `
        <h3>Hello ${userName},</h3>
        <p>Welcome to AgroRent!</p>
        <p>Your account has been successfully created.</p>
        <p><strong>Role:</strong> ${displayRole}</p>
        <p>You can now log in to AgroRent and start using the platform.</p>
        <br />
        <p>Thank you,</p>
        <p>AgroRent Team</p>
      `;
    }

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [messageConfig],
    });

    const result = await request;
    console.log(`Welcome email sent to ${userEmail}. Status: ${result.response.status}`);
    return result;
  } catch (error) {
    console.error(`Mailjet Welcome Email Error for ${userEmail}:`, error.statusCode, error.message);
    // Don't throw to prevent crashing the registration flow
  }
};

const sendPasswordResetOtpEmail = async (userEmail, userName, otp, expiryMinutes) => {
  try {
    const mailjet = getMailjetClient();
    const fromEmail = process.env.MAILJET_FROM_EMAIL || "itabishek7@gmail.com";
    const fromName = process.env.MAILJET_FROM_NAME || "AgroRent";
    const templateId = process.env.MAILJET_OTP_TEMPLATE_ID;

    const messageConfig = {
      From: {
        Email: fromEmail,
        Name: fromName,
      },
      To: [
        {
          Email: userEmail,
          Name: userName || "User",
        },
      ],
      Subject: "AgroRent Password Reset OTP",
    };

    if (templateId && templateId !== "your_otp_template_id_here") {
      messageConfig.TemplateID = parseInt(templateId, 10);
      messageConfig.TemplateLanguage = true;
      messageConfig.Variables = {
        userName: userName || "User",
        otp: otp,
        expiryMinutes: expiryMinutes,
      };
    } else {
      // Fallback to HTMLPart if no template ID is configured
      messageConfig.HTMLPart = `
        <h3>Hello ${userName || "User"},</h3>
        <p>We received a request to reset your AgroRent password.</p>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in ${expiryMinutes} minutes.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Do not share this OTP with anyone.</p>
        <br />
        <p>Regards,</p>
        <p>AgroRent Security Team</p>
      `;
    }

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [messageConfig],
    });

    const result = await request;
    console.log(`OTP email sent to ${userEmail}. Status: ${result.response.status}`);
    return result;
  } catch (error) {
    console.error(`Mailjet OTP Email Error for ${userEmail}:`, error.statusCode, error.message);
    throw new Error("Failed to send OTP email");
  }
};

const sendRegistrationOtpEmail = async (userEmail, userName, otp, expiryMinutes) => {
  try {
    const mailjet = getMailjetClient();
    const fromEmail = process.env.MAILJET_FROM_EMAIL || "itabishek7@gmail.com";
    const fromName = process.env.MAILJET_FROM_NAME || "AgroRent";
    const templateId = process.env.MAILJET_REGISTRATION_OTP_TEMPLATE_ID;

    const messageConfig = {
      From: {
        Email: fromEmail,
        Name: fromName,
      },
      To: [
        {
          Email: userEmail,
          Name: userName || "User",
        },
      ],
      Subject: "Verify Your Email - AgroRent",
    };

    if (templateId && templateId !== "your_registration_otp_template_id_here") {
      messageConfig.TemplateID = parseInt(templateId, 10);
      messageConfig.TemplateLanguage = true;
      messageConfig.Variables = {
        userName: userName || "User",
        otp: otp,
        expiryMinutes: expiryMinutes,
      };
    } else {
      // Fallback to HTMLPart
      messageConfig.HTMLPart = `
        <h3>Hello ${userName || "User"},</h3>
        <p>Thank you for registering with AgroRent.</p>
        <p>Your email verification OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in ${expiryMinutes} minutes.</p>
        <p>Do not share this OTP with anyone.</p>
        <br />
        <p>Regards,</p>
        <p>AgroRent Team</p>
      `;
    }

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [messageConfig],
    });

    const result = await request;
    console.log(`Registration OTP email sent to ${userEmail}. Status: ${result.response.status}`);
    return result;
  } catch (error) {
    console.error(`Mailjet Registration OTP Email Error for ${userEmail}:`, error.statusCode, error.message);
    throw new Error("Failed to send Registration OTP email");
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
  sendRegistrationOtpEmail,
};
