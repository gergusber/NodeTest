const express = require("express");
const app = express();
const mongoose = require("mongoose");
const chatRouter = require('./routes/chat');
const { get404 } = require("./controllers/error");
const Message = require('./models/message')

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ADD ALL OR WILDCARD "*" ALLOW ALL
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(async (req, res, next) => {
  let defaultMessage = await Message.findOne({ text: 'Could not give the correct answer' });
  if (!defaultMessage) {
    defaultMessage = new Message({ text: 'Could not give the correct answer' });
    console.log('creamos el couldNotGvieCorrectANsw')
    await defaultMessage.save();
  }
  
  next();
})

app.use("/chat", chatRouter);
app.use(get404);
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(
    "mongodb://localhost:27017/ultimateTest?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((res) => {
    app.listen(3004);
  })
  .catch((err) => {
    console.log(err);
  });
