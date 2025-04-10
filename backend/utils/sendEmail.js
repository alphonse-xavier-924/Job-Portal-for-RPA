const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", options.to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
