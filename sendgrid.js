const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const emailServerPath = process.env.EMAIL_SERVER_PATH;

const emailConfig = (email, verificationToken) => {
  return {
    to: `${email}`,
    from: "radekie@wp.pl",
    subject: "SG Verification Email",
    text: `To verify your account please click the following link: ${emailServerPath}${verificationToken}`,
    html: `<body>
    <p>To verify your account please click the following link: ${emailServerPath}${verificationToken}</p>
    </body>`,
  };
};

const sendMail = (email, verificationToken) => {
  return new Promise((resolve, reject) => {
    sgMail
      .send(emailConfig(email, verificationToken))
      .then(() => {
        resolve("Verification email successfully sent");
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports = { sendMail };
