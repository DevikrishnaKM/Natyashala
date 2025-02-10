import nodemailer from 'nodemailer';




const sendTutorLoginCredentials = async (email: string, passcode: string) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SERVER,
        port: parseInt(process.env.BREVO_PORT || '587'),
        secure:false,
        auth: {
          user: process.env.BREVO_EMAIL as string,
          pass: process.env.BREVO_PASS as string,
        },
    });

    console.log(email,"email")
    const mailOptions = {
      from: `"Natya Shala" <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: 'You Have Been Accepted as a Tutor ',
      html: `<!DOCTYPE html>
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
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #1DB954;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            margin: 20px 0;
            text-align: center;
          }
          .credentials {
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            margin: 20px 0;
            text-align: center;
            color: #777;
            font-size: 14px;
          }
          .footer a {
            color: #1DB954;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Congratulations! You Are Now a Tutor</h1>
          </div>
          <div class="content">
            <p>We are pleased to inform you that you have been accepted as a tutor with Natyashala.</p>
            
          </div>
          <div class="footer">
            <p>If you did not apply for this position, please ignore this email.</p>
            <p>© 2024 Natyashala. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Login credentials sent to:', info.response,"info:",info);
  } catch (error) {
    console.error('Failed to send the mail', error);
  }
};
export const sendTutorRejectionMail = async (email: string,name:string) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SERVER,
        port: parseInt(process.env.BREVO_PORT || '587'),
        secure:false,
        auth: {
          user: process.env.BREVO_EMAIL as string,
          pass: process.env.BREVO_PASS as string,
        },
    });

    console.log(email,"email")
    const mailOptions = {
      from: `"Natya Shala" <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: 'Tutor Application - Rejection Notification',
      html: `<!DOCTYPE html>
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
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #E63946;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            margin: 20px 0;
            text-align: center;
            color: #777;
            font-size: 14px;
          }
          .footer a {
            color: #1DB954;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Application</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>We appreciate your interest in joining Natyashala as a tutor.</p>
            <p>After careful review, we regret to inform you that your application was not successful at this time.</p>
            <p>This decision was not an easy one, as we received many qualified applications. We encourage you to apply again in the future if you believe Natyashala remains a good fit for your goals.</p>
          </div>
          <div class="footer">
            <p>Thank you for considering Natyashala.</p>
            <p>© 2024 Natyashala. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>`
    };
    

    const info = await transporter.sendMail(mailOptions);

    console.log("rejected mail send",info)
   
  } catch (error) {
    console.error('Failed to send the mail', error);
  }
};

export default sendTutorLoginCredentials;