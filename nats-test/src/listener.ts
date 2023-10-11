// Importing necessary modules from node-nats-streaming and crypto
import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { json } from 'stream/consumers';

// Clearing the console for a clean output
console.clear();

// Connecting to the NATS Streaming server
const stan = nats.connect('ticketall', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// Event handler for when the connection is established
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // Event handler for when the NATS connection is closed
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit(); // Exit the process when connection is closed
  });

     new TicketCreatedListener(stan).listen()
});

// Event handlers for process termination signals (SIGINT and SIGTERM)
process.on('SIGINT', () => stan.close()); // Close NATS connection on SIGINT
process.on('SIGTERM', () => stan.close()); // Close NATS connection on SIGTERM


abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000;
  
    constructor(client: Stan) {
      this.client = client;
    }
  
    subscriptionOptions() {
      return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }
  
    listen() {
      const subscription = this.client.subscribe(
        this.subject,
        this.queueGroupName,
        this.subscriptionOptions()
      );
  
      subscription.on('message', (msg: Message) => {
        console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
  
        const parsedData = this.parseMessage(msg);
        this.onMessage(parsedData, msg);
      });
    }
  
    parseMessage(msg: Message) {
      const data = msg.getData();
      return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf8'));
    }
  }


  class TicketCreatedListener extends Listener{
    subject = 'ticket:created';
    queueGroupName = 'payment-services';

    onMessage(data:any, msg:Message){
        console.log('Event data', data);
        
        msg.ack()
    }   
  }