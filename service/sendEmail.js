import env from './env';
import emailVerificationTemplate from '../utils/email/emailVerificationTemplate.js'
import transporter from './emailTransporter.js'


const sendEmail = async (to, subject, username, email) => {
    try {
        const verificationLink = `${env.app_url}/verify-email?token=${emailVerificationToken}&email=${email}`;
        const info = await transporter.sendMail({
            from: `'"SetBook - Admin" <${env.EMAIL_USER}>`, // sender address
            to: to, // list of recipients
            subject: subject, // subject line
            text: "Hello world?", // plain text body
            html: emailVerificationTemplate(username, email, verificationLink), // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return { success: true, message: 'Email sent successfully' };
    } catch (err) {
        console.error("Error while sending mail:", err);
        return { success: false, message: 'Error sending email' };
    }
}

export default sendEmail