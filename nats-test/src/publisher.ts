import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-create-publisher";

console.clear();

const stan = nats.connect("ticketall", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123456789",
      title: "Concert",
      price: 600,  
      userId : '123456789'
    });
  } catch (error) {
    console.log(error);
  }
});
