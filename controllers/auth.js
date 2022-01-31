const { connect } = require("getstream");
const bcrypt = require("bcrypt");

const crypto = require("crypto");

const StreamChat = require("stream-chat").StreamChat;

require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

const stream_app_id = process.env.STREAM_APP_ID;

const register = async (req, res) => {
    try {
        const { fullName, username, password, phoneNumber } = req.body;

        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });

        if (!users.length) {
            const userId = crypto.randomBytes(16).toString("hex");

            const serverClient = await connect(
                api_key,
                api_secret,
                stream_app_id
            );

            const hashedPassword = await bcrypt.hash(password, 10);

            const token = await serverClient.createUserToken(userId);

            // console.log({ fullName });
            // console.log({ username });
            // console.log({ password });
            // console.log({ phoneNumber });
            // console.log({ hashedPassword });
            // console.log({ userId });
            // console.log({ token });

            res.status(200).json({
                token,
                fullName,
                username,
                userId,
                hashedPassword,
                phoneNumber,
            });
        } else {
            res.status(500).json({ message: "That username is taken" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const serverClient = connect(api_key, api_secret, stream_app_id);

        console.log({ serverClient });
        const client = StreamChat.getInstance(api_key, api_secret);

        console.log({ client });

        const { users } = await client.queryUsers({ name: username });

        console.log({ users });

        if (!users.length) {
            return res.status(400).json({ message: "User not found" });
        }

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if (success) {
            res.status(200).json({
                token,
                fullName: users[0].fullName,
                username,
                userId: users[0].id,
                hashedPassword: users[0].hashedPassword,
            });
        } else {
            res.status(500).json({
                message: "Incorrect username and/or password",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: error });
    }
};

const verify = async (req, res) => {
    const { username, phoneNumber } = req.body;

    console.log({ username });
    console.log({ phoneNumber });

    const client = StreamChat.getInstance(api_key, api_secret);

    const { users } = await client.queryUsers({
        name: username,
        phoneNumber: phoneNumber.toString(),
    });

    console.log({ users });

    if (!users.length) {
        return res.status(500).json({
            message: "No user found with that username or Phone number",
        });
    } else {
        return res.status(200).json({
            username: users[0].name,
            fullName: users[0].fullName,
            userId: users[0].id,
            resetPassword: true,
        });
    }
};

const reset = async (req, res) => {
    const { newPassword, userId } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log({ hashedPassword });
    console.log({ userId });

    const client = StreamChat.getInstance(api_key, api_secret);

    const updateResponse = await client.partialUpdateUser({
        id: userId,
        set: {
            hashedPassword,
        },
    });

    console.log({ updateResponse });

    // const client = StreamChat.getInstance(api_key, api_secret);

    // const { users } = await client.queryUsers({
    //     name: username,
    //     phoneNumber: phoneNumber.toString(),
    // });

    // console.log({ users });

    // if (!users.length) {
    //     return res.status(500).json({
    //         message: "No user found with that username or Phone number",
    //     });
    // } else {
    //     return res.status(200).json({
    //         username: users[0].name,
    //         fullName: users[0].fullName,
    //         userId: users[0].id,
    //         resetPassword: true,
    //     });
    // }

    return res.status(200).json({ updateResponse });
};

module.exports = { register, login, verify, reset };
