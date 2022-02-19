import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
import chatRouter from './routes/chat.js';
// import { get404 Message} from "./controllers/error";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // ADD ALL OR WILDCARD "*" ALLOW ALL
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use("/chat", chatRouter);


// app.use(get404);

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

connect(
    "mongodb://localhost:27017/ultimateTest?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
