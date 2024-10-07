import dotenv from "dotenv";

dotenv.config();
import nodemailer from "nodemailer";
import httpStatus from "http-status";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const contactController = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please fill in all the fields." });
  }

  if (!emailRegex.test(email)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not a valid email!' });
  }

  const mailOptions = {
    from: email,
    to: "apnavideo6633@gmail.com",
    subject: `Contact from ${name}`,
    text: message,
    replyTo: email,
  };

  const userReplyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thank you for contacting us, ${name}`,
    text: `Dear ${name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\n\nBest regards,\nApna Video Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userReplyOptions);
    return res
      .status(httpStatus.OK)
      .json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Error sending message. Please try again." });
  }

  // try {
  //   await transporter.sendMail(userReplyOptions);
    
  //   return res
  //     .status(httpStatus.OK)
  //     .json({ message: "Message sent successfully!" });
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   res
  //     .status(httpStatus.NOT_FOUND)
  //     .json({ message: "Error sending message. Please try again." });
  // }

};

export default contactController;
