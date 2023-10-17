import { orderCreatedListeners } from "./events/listeners/order-created-listeners";
import { natsWrapper } from "./nats-wrapper";


const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    // Event handler for when the NATS connection is closed
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(); // Exit the process when connection is closed
    });

    // Event handlers for process termination signals (SIGINT and SIGTERM)
    process.on("SIGINT", () => natsWrapper.client.close()); // Close NATS connection on SIGINT
    process.on("SIGTERM", () => natsWrapper.client.close()); // Close NATS connection on SIGTERM

    new orderCreatedListeners(natsWrapper.client).listen()

  } catch (error) {
    console.error(error);
  }
};

start();
