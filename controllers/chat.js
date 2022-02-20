const Message = require('../models/message')
const Intent = require('../models/intent')

const { validationResult } = require('express-validator');
const { verify } = require('../services/ultimateAI/client');
const { where } = require('../models/message');

exports.postMessage = async (req, res, next) => {
    const { bot_identifier, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation Failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    try {
        //1. buscamos el mensaje en los intents, 
        //2.a si tenemos un intents, devolvemos la info de ese response
        //2.b si no tenemos intent. buscamos la info en intents.
        //3 una vez que consegimos intent, pusheamos este nuevo mensaje al intent.mensages para poder dar mas info 
        //4 POPULATE FIRST MESSAGE

        let messageInDb = await Message.find();
        let messageSaved =  messageInDb?.filter(x => x.text === message) || null;
     
        if (messageSaved) {
            messageSaved = new Message({ text: message });
            await messageSaved.save();
        }
        else {
            let messageIndBwithIntent = await Intent.find({}).populate('messages');// necesito buscar dnetro de esta collection el dato intent> messages[]>ahi con un objId 
            if(!messageIndBwithIntent){
                return res.status(200).json({
                    message: 'Could not give the correct answer'
                });
            }
            return res.status(200).json({
                message: messageIndBwithIntent?.reply,
            });
        }
        const data = await verify({
            botId: bot_identifier,
            message
        });
        if (!data) {
            return res.status(200).json({
                message: "Could not give the correct answer",
            });
        }
        const { intents } = data;
        const maxConfidenceIdentifier = intents.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current);
        // console.log(maxConfidenceIdentifier)
        if (!maxConfidenceIdentifier) {
            return res.status(200).json({
                message: "Could not give the correct answer!"
            });
        }

        const dataSaveIntent = {
            name: maxConfidenceIdentifier?.name,
            description: 'something',
            messages: [],
        }

        const newIntent = new Intent(dataSaveIntent);
        await newIntent.save();

        newIntent.messages.push(messageSaved._id);
        await newIntent.save();

        return res.status(200).json({
            message: newIntent?.reply,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
