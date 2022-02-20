


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const intentSchema = new Schema(
    {
        name: {
            type: String,
            default: "I am New Reply Scheme name",
        },
        description: {
            type: String,
            default: "I am New Reply Scheme Desc",
        },
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                required: true
            }
        ],
        reply: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    }
);

module.exports = mongoose.model("Intent", intentSchema);
