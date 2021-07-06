const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const SENDER_USER = process.env.SENDER_USER;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;
const EMAIL_TO = process.env.EMAIL_TO;

// @route POST api/posts
// @desc Receives an email payload
// @access Public
router.post("/", async (req, res) => {
  const { email, name, body } = req.body;

  if (!email || !name)
    return res.status(400).json({ message: "Email and name are missing" });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com", // hostname
      secureConnection: false, // TLS requires secureConnection
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: SENDER_USER,
        pass: SENDER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Email Submission" <${SENDER_USER}>`,
      to: `${EMAIL_TO}`,
      subject: "Contact Form Submission",
      text: `Name: ${name}, Email: ${email}, Subject: ${body}`,
    });

    return res.status(200).json({ message: "Email successfully sent!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Email transporter failed.", error: error });
  }
});

module.exports = router;
