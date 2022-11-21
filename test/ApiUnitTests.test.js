const app = require('./server');
const request = require('supertest');

const mongoose = require('mongoose');
const token = process.env.TOKEN; // Auth0 Token pro přístup k API
// undone aktualizovat token a odskomentovat auth0 testy 

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
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("name");
    });
    /*
    test("/getAllUsersSki", async () => {
        const res = await request(app).get("/api/getAllUsersSki").set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);       
    });    
    */
});

/* Auth0 tests */
describe('Auth0', function () {

    /*
    it('get + Bearer auth', async function () {       
        const res =  await request(app)
            .get('/api/private')           
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);        
    });
    */

    it('get (unautorized)', async function () {
        const res = await request(app)
            .get('/api/private')
            
        expect(res.statusCode).toEqual(401); 
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