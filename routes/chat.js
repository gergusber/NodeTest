const express = require("express");
const { postMessage, postAddMensage } = require("../controllers/chat");
const router = express.Router();
const { body } = require("express-validator");


// /=> POST
router.post("/", [
    body("bot_identifier")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter a valid identifier"),
    body("message")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter a valid message"),
], postMessage);


// /=> POST
router.post("/addReply", [
    body("intent")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter a valid intent identifier"),
    body("message")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter a valid message"),
], postAddMensage);

module.exports = router;


