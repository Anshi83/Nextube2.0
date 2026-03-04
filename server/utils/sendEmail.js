import nodemailer from "nodemailer";

export const sendInvoiceEmail = async (userEmail, plan, amount) => {
  // 1. Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail (add to .env)
      pass: process.env.EMAIL_PASS, // Your Gmail App Password (add to .env)
    },
  });

  // 2. Define the email content
  const mailOptions = {
    from: '"NexTube Support" <no-reply@nextube.com>',
    to: userEmail,
    subject: `Your NexTube Invoice - ${plan} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2563eb;">Payment Successful!</h2>
        <p>Hello, thank you for upgrading your plan on NexTube.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Plan:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${plan}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Amount Paid:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${amount}</td>
          </tr>
        </table>
        <p>You now have access to <strong>${plan === 'Gold' ? 'Unlimited' : plan === 'Silver' ? '10 mins' : '7 mins'}</strong> of watch time per video.</p>
      </div>
    `,
  };

  // 3. Send the email
  return transporter.sendMail(mailOptions);
};