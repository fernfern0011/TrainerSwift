require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'trainerswift2024@gmail.com',
    pass: 'jahu ziez plgh vddq',
  },
});

app.post('/send-email', async (req, res) => {

  const { data } = req.body;
  console.log(req.body);
  const mailOptionsClient = {
    from: 'trainerswift2024@gmail.com',
    to: `${data.traineeEmail}`,
    subject: 'Payment Successful',
    html:
    `
    <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #C53030;
      color: #fff;
      padding: 20px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #C53030;
      color: #fff;
      text-align: center;
      padding: 20px;
      border-radius: 0 0 10px 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear ${data.clientName}</p>
      <p>We're excited to inform you that your booking with ${data.trainerName} is confirmed!</p>
      <p>Here are the details of your booking:</p>
      <ul>
        <li><strong>Date:</strong> ${data.date}</li>
        <li><strong>Time:</strong> ${data.time}</li>
        <li><strong>Transaction Number:</strong> ${data.transactionNumber}</li>
        <li><strong>Amount Paid:</strong> ${data.amount}</li>
      </ul>
      <p>We're looking forward to having you at the class. If you have any questions or need to reschedule, feel free to reach out to us.</p>
      <p>Best regards,<br/>Trainer Swift</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Trainer Swift. All rights reserved.</p>
    </div>
  </div>
</body>
</html>


  `
  };



  const mailOptionsTrainer = {
    from: 'trainerswift2024@gmail.com',
    to: `${data.trainerEmail}`,
    subject: 'Booking Confirmation',
    html:
    `
    <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #C53030;
      color: #fff;
      padding: 20px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #C53030;
      color: #fff;
      text-align: center;
      padding: 20px;
      border-radius: 0 0 10px 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Session Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear ${data.trainerName}</p>
      <p>We're excited to inform you that your training session with ${data.clientName} is confirmed!</p>
      <p>Here are the details of your session:</p>
      <ul>
        <li><strong>Date:</strong> ${data.date}</li>
        <li><strong>Time:</strong> ${data.time}</li>
        <li><strong>Transaction Number:</strong> ${data.transactionNumber}</li>
        <li><strong>Amount Paid:</strong> ${data.amount} (Payouts every week!)</li>
      </ul>
      <p>Best regards,<br/>Trainer Swift</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Trainer Swift. All rights reserved.</p>
    </div>
  </div>
</body>
</html>


  `
  };

  try {
    await transporter.sendMail(mailOptionsClient);
    console.log('Client Email notification sent');
    await transporter.sendMail(mailOptionsTrainer);
    console.log('Trainer Email notification sent');
    res.status(200).send('Emails sent successfully');
  } catch (error) {
    console.error('Error sending email notifications:', error);
    res.status(500).send('Internal server error');
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});