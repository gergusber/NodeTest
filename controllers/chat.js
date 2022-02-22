const Message = require('../models/message')
const Intent = require('../models/intent')

const { validationResult } = require('express-validator');
const { verify } = require('../services/ultimateAI/client');

exports.postMessage = async (req, res, next) => {
    const { bot_identifier, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation Failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    try {
        let messageSaved = await Message.findOne({ text: message });
        if (!messageSaved) {
            messageSaved = new Message({ text: message });
            await messageSaved.save();
        }

        const dataFromUltimateAIApi = await verify({
            botId: bot_identifier,
            message
        });
        if (!dataFromUltimateAIApi) {
            return res.status(200).json({
                message: "Could not give the correct answer",
            });
        }
        const { intents } = dataFromUltimateAIApi;
        const maxConfidenceIdentifier = intents.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current);
        if (!maxConfidenceIdentifier) {
            return res.status(200).json({
                message: "Could not give the correct answer!"
            });
        }
        let messageIndBwithIntent = await Intent.findOne({ name: maxConfidenceIdentifier.name })// necesito buscar dnetro de esta collection el dato intent> messages[]>ahi con un objId 
        if (messageIndBwithIntent) {
            for (const message in messageIndBwithIntent.message) {
                if (message.text === messageSaved.text) {
                    return res.status(200).json({
                        message: messageIndBwithIntent.reply,
                    });
                }
            }
            messageIndBwithIntent.messages.push(messageSaved._id);
            await messageIndBwithIntent.save();
            const mess = await Message.findById(messageIndBwithIntent.reply._id);
            return res.status(200).json({
                message: mess.text,
            });
        }
        else {
            const defaultMessage = await Message.findOne({ text: 'Could not give the correct answer' });
            const dataSaveIntent = {
                name: maxConfidenceIdentifier?.name,
                description: 'something',
                messages: [],
                reply: defaultMessage._id
            }
            const newIntent = new Intent(dataSaveIntent);
            await newIntent.save();

            newIntent.messages.push(messageSaved._id);
            await newIntent.save();
            const mess = await Message.findById(newIntent.reply._id);

            return res.status(200).json({
                message: mess.text,
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.postAddMensage = async (req, res, next) => {
    const { intent, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation Failed, entered data is incorrect");
        error.statusCode = 404;
        throw error;
    }

    try {
        let messageSaved = await Message.findOne({ text: message });
        if (!messageSaved) {
            messageSaved = new Message({ text: message });
            await messageSaved.save();
        }

        console.log(messageSaved)
        let intentToAddMessage = await Intent.findById(intent)
        if (!intentToAddMessage) {
            return res.status(404).json({
                message: 'Intent not found'
            });
        }

        intentToAddMessage.reply = messageSaved._id;
        await intentToAddMessage.save();
        return res.status(200).json({
            message: messageSaved.text,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}