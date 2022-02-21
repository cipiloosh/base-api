import * as nodemailer from 'nodemailer';

const {
  SENDGRID_HOST,
  SENDGRID_PORT,
  SEND_MAIL_SECURE,
  SENDGRID_USER,
  SENDGRID_API_KEY,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const sendMail = async (email: string, subject: string, message: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SENDGRID_HOST,
      port: SENDGRID_PORT,
      secure: SEND_MAIL_SECURE,
      auth: {
        user: SENDGRID_USER,
        pass: SENDGRID_API_KEY,
      },
    });

    await transporter.sendMail({
      from: SENDER_EMAIL_ADDRESS,
      to: email,
      subject,
      html: message,
    });
    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};

export default sendMail;
