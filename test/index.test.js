const app = require('./server');
const request = require('supertest');

/*
const mongoose = require('mongoose');
afterAll(async () => { mongoose.connection.close(); }); //ukonèit db spojení po testech
*/

describe('Auth0 tests', function () {

   
    test("config file exist", async () => {

        const res = await request(app).get("/auth_config.json");

        expect(res.statusCode).toEqual(200);  

        //console.log(res.body)

        expect(res.body).toHaveProperty("domain");
        expect(res.body["domain"]).toEqual(process.env.Auth_domain)
        expect(res.body["clientId"]).toEqual(process.env.Auth_clientId)           
    });    

});

