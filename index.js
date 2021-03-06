const express = require("express");

const cors = require("cors");

const authRouter = require("./routes/auth.js");

const app = express();

const PORT = process.env.PORT || 5000;

require("dotenv").config();

const accounSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;
const twilioClient = require("twilio")(accounSID, authToken);
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.send("Hello world");
});

// app.post("/", (req, res) => {
//     const { message, user: sender, type, members } = req.body;

//     if (type === "message.new") {
//         members
//             .filter((member) => member.user_id !== sender.id)
//             .forEach(({ user }) => {
//                 if (!user.online) {
//                     twilioClient.messages
//                         .create({
//                             body: `You have a new message from ${message.user.fullName} - ${message.text}`,
//                             messagingServiceSid,
//                             to: user.phoneNumber,
//                         })
//                         .then((messageData) => console.log({ messageData }))
//                         .catch((err) => console.log({ err }));
//                 }
//             });

//         console.log({ messge });
//         console.log({ sender });
//         console.log({ type });
//         console.log({ memebers });

//         return res
//             .status(200)
//             .send({ data: { message, sender, type, members } });
//     }

//     return res.status(200).send("Not a new message request");
// });

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
