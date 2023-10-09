import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';


it('has a route handler listening to /api/tickets for post request',async()=>{
    const response = await request(app)
            .post('/api/tickets')
            .send({})
        expect(response.status).not.toEqual(404)
})

it('can only be accessed if user is signed in',async()=>{
    const response = await request(app)
                .post('/api/tickets')
                .send({})
                .expect(401)

})

it('Return a status other than 401 if the user is signed in',async()=>{
    const cookie = global.signin()//retrun a cookie string
    const response = await request(app)
                .post('/api/tickets')
                .set('Cookie',cookie)
                .send({})
                

            expect(response.status).not.toEqual(401)

})

it('Return an error if an invalid title is provided',async()=>{
    const cookie = global.signin()//retrun a cookie string
     await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title:'',
                price:10
            })
            .expect(400)

    await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                price:10
            })
            .expect(400)

})

it('Retun an error if an invalid price is provided ',async()=>{
    const cookie = global.signin()//retrun a cookie string
    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'Premier league',
            price:-500
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'Premier league',
        })
        .expect(400)
})

it('create a tickets with valid inputs',async()=>{
    const cookie = global.signin()//retrun a cookie string

    let tickets = await Ticket.find({})

    expect(tickets.length).toEqual(0)

    const title = 'Premier league';
    const price = 500

    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title,price
        })
        .expect(200);

      tickets = await  Ticket.find({})

      expect(tickets.length).toEqual(1)
      expect(tickets[0].title).toEqual(title)
      expect(tickets[0].price).toEqual(price)

})