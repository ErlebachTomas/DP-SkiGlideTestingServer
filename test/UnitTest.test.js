const app = require('./server');
const request = require('supertest');

const mongoose = require('mongoose');
afterAll(async () => { mongoose.connection.close(); }); //ukonèit db spojení po testech


describe('Demo test Suite 1', function () {
    it("Test 1 - This shouldn't fail", function () {
        expect(1 === 1).toBeTruthy();
    });
});


describe('Test API', function () {

    test("seznam uživatelù", async () => {

        const res = await request(app).get("/api/getAllUsers");
        expect(res.statusCode).toEqual(200);

        // expect(res.body.length).toBeGreaterThan(0); zatim prazdna db
        // expect(res.body[0]).toHaveProperty("name");
    });

});

/* Auth0 tests */
//TODO https://auth0.com/docs/quickstart/backend/nodejs/interactive

const token = process.env.TOKEN;
console.log(token)

describe('GET', function () {

    it('get + auth', function () {       
        expect(true).toBeTruthy();
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
