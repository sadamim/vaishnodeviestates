import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'marketing@vaishnodeviestates.com',
    pass: 'ylxzkyyfbabjkgcl', // Consider using an App Password, not your real Gmail password
  },
});

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific domain in production
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    message,
    subject,
    additionalRecipients,
    client,
    form_source,
  } = req.body;

  // Validate required fields
  if (!subject || subject.trim() === '') {
    return res.status(400).json({ message: 'Subject cannot be empty' });
  }

  const source = form_source && form_source.trim() !== '' ? form_source : '';

  const emailContent = `
    <p><strong>Form Source:</strong> ${source}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong><br>${message}</p>
  `;

  const recipients = Array.isArray(additionalRecipients)
    ? additionalRecipients.join(',') // comma-separated list
    : 'info@vaishnodeviestates.com'; // fallback email

  const mailOptions = {
    from: `"Vaishnodevi Estates" <marketing@vaishnodeviestates.com>`,
    to: recipients,
    subject,
    html: emailContent,
  };

  try {
    if (client) {
      await transporter.sendMail(mailOptions);
    }
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Failed to send email', error });
  }
}
