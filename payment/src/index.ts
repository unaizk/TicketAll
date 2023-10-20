import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import {  OrderCancelledListenerPayment } from "./events/listeners/order-cancelled-listener";
import {  OrderCreatedListenerPayment } from "./events/listeners/order-created-listener";


const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is invalid");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    console.log(process.env.NATS_CLUSTER,'process.env.NATS_CLUSTER');
    console.log(process.env.NATS_CLIENT,'process.env.NATS_CLIENT');
    console.log(process.env.NATS_URL,'process.env.NATS_URL');
    console.log(process.env.MONGO_URI,'process.env.MONGO_URI');
    
    
    
    await natsWrapper.connect(process.env.NATS_CLUSTER, process.env.NATS_CLIENT, process.env.NATS_URL);
  

    // Event handler for when the NATS connection is closed
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(); // Exit the process when connection is closed
    });

    // Event handlers for process termination signals (SIGINT and SIGTERM)
    process.on("SIGINT", () => natsWrapper.client.close()); // Close NATS connection on SIGINT
    process.on("SIGTERM", () => natsWrapper.client.close()); // Close NATS connection on SIGTERM
     console.log('hiiiiiiiiiiiiiiiiii');
  
      // Listening the Events when Order is created or cancelled
      console.log('Creating OrderCreatedListenerPayment');
      new OrderCreatedListenerPayment(natsWrapper.client).listen();
      
      console.log('Creating OrderCancelledListenerPayment');
      new OrderCancelledListenerPayment(natsWrapper.client).listen();
     
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Payment listening on port 3000");
  });
};

start();
