import nodemailer from 'nodemailer';

const allowedOrigins = [
  'https://www.vaishnodeviestates.com',
  'https://vaishnodeviestates.vercel.app',
];

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'marketing@vaishnodeviestates.com',
    pass: 'ylxzkyyfbabjkgcl', // Use environment variables in production
  },
});

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight
  }

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

  if (!subject || subject.trim() === '') {
    return res.status(400).json({ message: 'Subject cannot be empty' });
  }

  const source = form_source?.trim() || '';

  const emailContent = `
    <p><strong>Form Source:</strong> ${source}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong><br>${message}</p>
  `;

  const allRecipients = Array.isArray(additionalRecipients)
    ? additionalRecipients
    : [];

  const mailOptions = {
    from: `"Vaishnodevi Estates" <marketing@vaishnodeviestates.com>`,
    to: allRecipients,
    subject,
    html: emailContent,
  };

  try {
    if (client) {
      await transporter.sendMail(mailOptions);
    }
    return res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
