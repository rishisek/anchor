import { Router } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import MessageModel, { IMessage } from "./models/message";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

const protoStringFromSpec = (spec: HydratedDocument<IMessage>) => {
  let message_str = "";
  message_str += `message ${spec.name} { `;
  for (const field of spec.fields) {
    message_str += `${field.type} ${field.name} = ${field.number}; `;
  }
  message_str += "}";
  return message_str;
};

routes.post("/proto/create", async (req, res, next) => {
  await mongoose.connect("mongodb://localhost:8080");
  let message = new MessageModel(req.body);

  MessageModel.findOne({ name: message.name }).exec((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error.");
    }
    if (result) {
      return res.status(400).send("Message exists. Try updating instead.");
    }
    message
      .save()
      .then(() => {
        let message_str = protoStringFromSpec(message);
        res.send(message_str);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
  });
});

export default routes;
