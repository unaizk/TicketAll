import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'

it('Return 404 if the provided id is not exist',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.signin()//retrun a cookie string
    const title = 'Premier league'
    const price = 500;

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',cookie)
        .send({
            title,price
        })
        .expect(404)

})

it('retuens 401 if the user is not authenticated',async()=>{

    const id = new mongoose.Types.ObjectId().toHexString()
    const title = 'Premier league'
    const price = 500;

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title,price
        })
        .expect(401)

})

it('Return 401 if the user does not own the ticket',async()=>{

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())//retrun a cookie string
    .send({
        title:'Premier league',
        price:500
    })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())//retrun a new cookie string so the user has changed
        .send({
            title:'Concert',
            price:200
        })
        .expect(401)
})

it('Return 400 if the user provided invalid title or price',async()=>{
    const cookie = global.signin()//retrun a cookie string
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'Premier league',
        price:500
    })


    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'',
            price:500
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'Premier league',
            price:-500
        })
        .expect(400)
})

it('Updates the products user provided valid inputs',async()=>{
    const cookie = global.signin()//retrun a cookie string
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'Premier league',
        price:500
    })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'Concert',
            price: 300
        })
        .expect(200)
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send({})

        expect(ticketResponse.body.title).toEqual('Concert')
        expect(ticketResponse.body.price).toEqual(300)
})


it('Publishes an event',async()=>{
    const cookie = global.signin()//retrun a cookie string
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'Premier league',
        price:500
    })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'Concert',
            price: 300
        })
        .expect(200)


    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
