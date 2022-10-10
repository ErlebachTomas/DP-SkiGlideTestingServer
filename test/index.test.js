const app = require('./server');
const request = require('supertest');

/*
const mongoose = require('mongoose');
afterAll(async () => { mongoose.connection.close(); }); //ukonèit db spojení po testech
*/
describe('Environment variables', function () {
    test("vars are set and exist", async () => {
        expect(process.env.Auth_domain).toBeNonEmptyString()
        expect(process.env.Auth_clientId).toBeNonEmptyString()
        expect(API_IDENTIFIER).toBeNonEmptyString()
    });
});

describe('Auth0 tests', function () {
   
    test("config file exist", async () => {

        const res = await request(app).get("/auth_config.json");

        expect(res.statusCode).toEqual(200);  

        // console.log(res.body)

        expect(res.body).toHaveProperty("domain");
        expect(res.body["domain"]).toEqual(process.env.Auth_domain)
        expect(res.body["clientId"]).toEqual(process.env.Auth_clientId)     
        expect(res.body["audience"]).toEqual(process.env.API_IDENTIFIER) 
    });    

});



