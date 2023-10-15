import request from "supertest";
import { Ticket } from "../ticket";

it("Implement optimistic concurrency control", async () => {
  // Create an instance of ticket
  const ticket = Ticket.build({
    title: "Sports",
    price: 599,
    userId: "123",
  });

  //Save the ticket to the database
  await ticket.save();


  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);


  //Make two seperate changes the ticket we fetched
  firstInstance!.set({
    title: "Concert",
    price: 500,
  });

  secondInstance!.set({
    price: 50,
  });


  // Save the first fetched ticket
  await firstInstance!.save();


  //save the second fetched ticket
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not reach this point')
});


it('Increment the version number on multiple saves',async()=>{
        // Create an instance of ticket
  const ticket = Ticket.build({
    title: "Sports",
    price: 599,
    userId: "123",
  });

  //Save the ticket to the database
  await ticket.save();
  expect(ticket.version).toEqual(0)
  await ticket.save();
  expect(ticket.version).toEqual(1)
  await ticket.save();
  expect(ticket.version).toEqual(2)
})