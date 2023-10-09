import request from 'supertest';
import { app } from '../../app';

const createTickets = ()=>{
    const cookie = global.signin()//retrun a cookie string
    const title = 'Premier league'
    const price = 800
    return request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title,price
        })
}
it('can fetch all the list of tickkets',async()=>{
    await createTickets();
    await createTickets();


    const response = await request(app)
            .get('/api/tickets')
            .send({})
            .expect(200)

        expect(response.body.length).toEqual(2)    
})