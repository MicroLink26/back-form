require("dotenv").config();

const express = require("express");
const cors = require("cors");
// import des package nécessaire à l'utilisation de Mailgun
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("route welcome");

  res.status(200).json({ message: "welcome" });
});

app.post("/form", async (req, res) => {
  console.log("route form");

  try {
    const { firstname, lastname, email, message } = req.body;

    // ==+> utilisation de Mailgun
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "Michael Roche",

      key: process.env.MAILGUN_API_KEY,
    });

    // ==+> création  de l'objet mail
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "mic.roche@gmail.com",
      subject: "Hello",
      text: message,
    };

    // Utilisation de la méthode de Mailgun pour l'envoi du mail
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    // console.log("response>>", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("catch>>", error);
  }
});

app.listen(3000, () => {
  //console.log(process.env.MAILGUN_API_KEY, process.env.MAILGUN_DOMAIN);
  console.log("Server has started 🤓");
});
