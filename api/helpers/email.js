const nodemailer = require('nodemailer');
const { smtpUserName, smtpPassword } = require('../../secrete');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 with SSL
    auth: {
        user: smtpUserName,
        pass: smtpPassword,
    },
});

const sendEmail = async (emailData) => {
    try {
        const mailOptions = {
            from: smtpUserName,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
        };

        const msgInfo = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', msgInfo.response);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = sendEmail;
