async function sendContact(req, res) {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "Missing fields" });

  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch (err) {
    console.warn("nodemailer not installed — contact feature disabled");
    return res
      .status(501)
      .json({ message: "Mail service not available on this environment" });
  }

  // Minimal nodemailer setup using SMTP credentials from env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    subject: `Contact form: ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Message sent" });
  } catch (err) {
    console.error("Mail error", err);
    res.status(500).json({ message: "Unable to send message" });
  }
}

module.exports = { sendContact };
