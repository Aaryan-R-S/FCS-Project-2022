const nodemailer = require("nodemailer");
require("dotenv").config();

const mailId = process.env.MAIL_ID;
const mailPwd = process.env.MAIL_PASSWORD;

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: mailId,
        pass: mailPwd,
    },
});

module.exports.sendMail = (userMailId, otp, purpose) => {
    transport
        .sendMail({
            from: mailId,
            to: userMailId,
            subject: `eCare - OTP for ${purpose}`,
            html: `<h2>Dear user,</h2>
        <p>Your OTP for your current transaction is <b>${otp}</b> .</p>

        <p>Please ignore the mail if you think you are not the one doing this transaction!</p>

        <p>Best Regards,<br>
        Team eCare</p>`,
        })
        .catch((err) => console.log(err));
};