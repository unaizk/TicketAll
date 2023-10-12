import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";


const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is invalid");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await natsWrapper.connect("ticketall", "abcdef", "http://nats-srv:4222");
    // Event handler for when the NATS connection is closed
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(); // Exit the process when connection is closed
    });

    // Event handlers for process termination signals (SIGINT and SIGTERM)
    process.on("SIGINT", () => natsWrapper.client.close()); // Close NATS connection on SIGINT
    process.on("SIGTERM", () => natsWrapper.client.close()); // Close NATS connection on SIGTERM

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("auth listening on port 3000");
  });
};

start();
