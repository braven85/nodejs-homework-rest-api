const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailConfig = (email, verificationToken) => {
  return {
    to: `${email}`,
    from: "radekie@wp.pl",
    subject: "SG Verification Email",
    text: `To verify your account please click the following link: http://localhost:3000/api/users/verify/${verificationToken}`,
    html: `<body>
    <p>To verify your account please click the following link: http://localhost:3000/api/users/verify/${verificationToken}</p>
    </body>`,
  };
};

const sendMail = (email, verificationToken) => {
  sgMail
    .send(emailConfig(email, verificationToken))
    .then(() => {
      console.log("Verification email sent");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { sendMail };
