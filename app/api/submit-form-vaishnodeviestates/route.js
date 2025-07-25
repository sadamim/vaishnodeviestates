// app/api/submit-form-vaishnodeviestates/route.js

import nodemailer from 'nodemailer';

export const POST = async (request) => {
  const body = await request.json();

  const {
    name,
    email,
    phone,
    message,
    subject,
    additionalRecipients,
    client,
  } = body;

  if (!subject || subject.trim() === '') {
    return Response.json({ message: 'Subject cannot be empty' }, { status: 400 });
  }

  const emailContent = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong><br>${message}</p>
  `;

  const allRecipients = Array.isArray(additionalRecipients)
    ? additionalRecipients
    : [];

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Vaishnodevi Estates" <${process.env.SMTP_USER}>`,
    to: allRecipients,
    subject: `Contact Form Submission: ${subject}`,
    html: emailContent,
  };

  try {
    if (client) {
      await transporter.sendMail(mailOptions);
    }
    return Response.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ message: 'Failed to send email' }, { status: 500 });
  }
};
