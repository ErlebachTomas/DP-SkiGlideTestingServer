const app = require('./server');
const request = require('supertest');

const mongoose = require('mongoose');

/** ukončit db spojení po testech */
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});

/* === TESTY === */
describe('Test public API', function () {

    test("seznam uživatelů", async () => {

        const res = await request(app).get("/api/getAllUsers");
        expect(res.statusCode).toEqual(200);

        // expect(res.body.length).toBeGreaterThan(0); zatim prazdna db
        // expect(res.body[0]).toHaveProperty("name");
    });

    test("/getAllUsersSki", async () => {
        const res = await request(app).get("/api/getAllUsersSki");
        expect(res.statusCode).toEqual(200);       
    });    

});

/* Auth0 tests */
//TODO https://auth0.com/docs/quickstart/backend/nodejs/interactive
const token = process.env.TOKEN;

describe('Auth0', function () {

    it('get + Bearer auth', function () {       
        const res =  await request(app)
            .get('/api/private')           
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);        
    });

});

/*
describe('POST', function () {
    it('does something', function (done) {
        request(app)
            .post('/some-url')
            .send({ body: 'some-body' })
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(200, done);
    });
});
*/