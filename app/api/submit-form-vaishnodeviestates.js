import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message, subject, additionalRecipients, client } = req.body;

  if (!subject || subject.trim() === '') {
    return res.status(400).json({ message: 'Subject cannot be empty' });
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
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
