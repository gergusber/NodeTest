import { postMessage } from "../controllers/chat.js";
import express from "express";
const router = express.Router();
import { body } from "express-validator";


// /=> POST
// router.post("/",  [
//     body("bot_identifier")
//         .trim()
//         .not()
//         .isEmpty()
//         .withMessage("Please enter a valid identifier"),
//     body("message")
//         .trim()
//         .not()
//         .isEmpty()
//         .withMessage("Please enter a valid message"),
//   ], postMessage);

router.post("/",postMessage);

export default router;


