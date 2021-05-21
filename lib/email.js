`use strict`;

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'feedback.aggregator@gmail.com',
        pass: 'intelpentium+'
    }
});

const sendEmail = async (subject, body, to) => {
    try {
        let mailOptions = {
            from: 'feedback.aggregator@gmail.com',
            to: to,
            subject: subject,
            text: body
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(info.response);
                }
            });
        });
    } catch (err) { throw err }
}

module.exports = {
    sendEmail
}