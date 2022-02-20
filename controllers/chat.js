const Message = require('../models/message')
const { validationResult } = require('express-validator');
const { verify } = require('../services/ultimateAI/client')

exports.postMessage = async (req, res, next) => {
    const { bot_identifier, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation Failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    try {
        const data = await verify({
            botId: bot_identifier,
            message
        });
        if (!data) {
            return res.status(400).json({
                message: "Message error!",
                data,
            });
        }
        const defaultIntent =    {
            "confidence": 0.99999999,
            "name": "AI could not give the correct answer"
        }
        const { intents, entities } = data
        const max = intents.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current) || defaultIntent
    
        console.log(intents)
        console.log(max)


        res.status(200).json({
            message: "Message created successfully!",
            max,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
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
};