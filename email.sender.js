require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function verifyEmail(email, token) {
  const msg = {
    to: email,
    from: "it-starter-ukraine@i.ua",
    subject: "Authorization email",
    html: `<p>Lets verify your email so you can start using your profile</p><a href="http://localhost:3000/api/users/auth/verify/${token}">Click here to verify</a>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = verifyEmail;
