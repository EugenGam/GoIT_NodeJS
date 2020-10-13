require("dotenv").config();
const config = require("./api/helpers/config");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function verifyEmail(email, token) {
  const msg = {
    to: email,
    from: config.email,
    subject: "Authorization email",
    html: `<p>Lets verify your email so you can start using your profile</p><a href="${config.host}${config.port}/api/users/auth/verify/${token}">Click here to verify</a>`,
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }
}

module.exports = verifyEmail;
