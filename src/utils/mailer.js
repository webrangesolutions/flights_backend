import nodemailer from "nodemailer";

// Using Singleton Principle to only call create Transporter only once and then reuse it//
let transporter = null;

export const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID, // Your email id
        pass: process.env.EMAIL_PASSWORD, // Your password
      },
      logger: true, // Enable logging
      debug: true, // Enable debug output
    });
  }
  return transporter;
};
