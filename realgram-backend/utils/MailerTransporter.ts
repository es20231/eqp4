const nodemailer = require("nodemailer");

const MAILER_SENDER_HOST = process.env.MAILER_SENDER_HOST;
const MAILER_SENDER_PORT = process.env.MAILER_SENDER_PORT;
const MAILER_SENDER_USER = process.env.MAILER_SENDER_USER;
const MAILER_SENDER_PASS = process.env.MAILER_SENDER_PASS;

module.exports = nodemailer.createTransport({
  host: MAILER_SENDER_HOST,
  port: MAILER_SENDER_PORT,
  auth: {
    user: MAILER_SENDER_USER,
    pass: MAILER_SENDER_PASS,
  },
});
