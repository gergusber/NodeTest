import Message from '../models/message.js';
import { validationResult } from 'express-validator';
// import { chatApi } from '../services/ultimateAI/client';

const postMessage = async (req, res, next) => {
    const { bot_identifier, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation Failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    try {
        const messObj = new Message({
            bot_identifier, message
        });
        // const chatApiMessage = await chatApi(messObj);
        console.log('=====================================================');

        // console.log(chatApiMessage);
        const savedMessage = await messObj.save();
        res.status(200).json({
            message: "Message created successfully!",
            savedMessage,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getMessages = async (req, res, next) => {
    try {
        const totalMessages = await Message.find().countDocuments();
        const messages = await Message.find();
        res.status(200).json({
            message: "Fetched Messages succesfully",
            posts: messages,
            totalItems: totalMessages,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


export { postMessage, getMessages }