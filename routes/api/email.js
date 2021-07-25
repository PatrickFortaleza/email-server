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
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is a required field" });

  const regex = /^([a-zA-z0-9\.-_]+)@([a-zA-z0-9\-_]+).([a-z]{2,20})$/;
  const matches = email.match(regex) || [];

  if (matches.length < 1)
    return res
      .status(400)
      .json({ message: `you have not entered a valid email address` });

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
      from: `"tropic bounce" <${SENDER_USER}>`,
      to: `${EMAIL_TO}`,
      subject: "Subscription - Exclusive Content [tropicbounce.ca]",
      text: `Email: ${email}`,
      html: `<p><b>Email: ${email}</b></p>`,
    });

    return res.status(200).json({ message: "Email successfully sent!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Email transporter failed.", error: error });
  }
});

module.exports = router;
