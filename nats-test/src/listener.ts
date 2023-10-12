// Importing necessary modules from node-nats-streaming and crypto
import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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




