import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message?: string; // Optional if HTML content is preferred
  html?: string;    // Optional if plain text is provided
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    // 1) Create a transporter
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.BREVO_SERVER,
      port: parseInt(process.env.BREVO_PORT || '587'),
      secure:false,
      auth: {
        user: process.env.BREVO_EMAIL as string,
        pass: process.env.BREVO_PASS as string,
      },
      
    });
    // console.log('BREVO_EMAIL:', process.env.BREVO_EMAIL);
    // console.log('EMAIL_PASS:', process.env.BREVO_PASS);
  
    // 2) Define the email options
    const mailOptions = {
      from: `"Natya Shala" <${process.env.BREVO_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };
  
    // 3) Actually send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  };
  
export default sendEmail;
