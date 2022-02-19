// const mongoose = require("mongoose");
// import Mongoose  from "mongoose";
// import Schema from "mongoose";
import mongoose from 'mongoose'

const Message = new mongoose.Schema(
  {
    bot_identifier: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", Message);