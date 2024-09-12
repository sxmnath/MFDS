const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const app = express();

// Enable CORS for all origins
app.use(cors());
// Parse JSON bodies
app.use(express.json());

// Configure SendGrid with your API key
sgMail.setApiKey('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');

app.post('/send-email', (req, res) => {
  const { subject, body, to } = req.body;

  const msg = {
    to: 'somnathchak315@gmail.com', // Single recipient or an array of recipients
    from: 'mfds1@proton.me', // Use a verified sender email address
    subject: 'FAULT DETECTED',
    text: 'issue',
  };

  sgMail.send(msg)
    .then(() => {
      res.status(200).send('Email sent');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error sending email');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
