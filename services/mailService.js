const nodemailer = require("nodemailer");

const sendActivationMail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: "Hi, activate your account on Walter messenger!",
    text: "",
    html: `
        <div>
            <h1>Activate your email!</h1>
            <a href="${link}">Click Here!</a>
        </div>
    `
  })
}

module.exports = {
  sendActivationMail
}
