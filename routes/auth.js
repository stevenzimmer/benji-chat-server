const express = require("express");

const { register, login, verify, reset } = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/reset", reset);

module.exports = router;
