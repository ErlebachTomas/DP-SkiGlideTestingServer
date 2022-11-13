﻿const app = require('./server');
const middleware = require('../controller/middleware');
const userController = require('../controller/userController');
const skiController = require('../controller/skiController');
const testSessionController = require('../controller/testSessionController');

const User = require('../model/User');

const { v4: uuidv4 } = require('uuid');

/* === TESTY === */
describe('calculation', function () {

    test("time comparation", async () => {

        let oldDate = "2022-10-16T13:50:01.917Z"
        let newDate = "2022-10-16T13:58:01.917Z";

        let t1 = middleware.isServerOutDateted(oldDate, newDate);
        expect(t1).toEqual(false);

        let t2 = middleware.isServerOutDateted(newDate, oldDate);
        expect(t2).toEqual(true);
    });

});
describe('userController', function () {

    test("User CRUD", async () => {

        let id = uuidv4();

        let testUser = {
            user_id: id,
            email: "venca@email.cz",
            name: "venca",
            updated_at: "2022-10-16T13:58:01.917Z"
        }

        try {
            let r = await userController.insertUser(testUser);

            expect(r.user_id).toEqual(testUser.user_id);

            let now = middleware.currentTimeString(); 

            await userController.updateUser({
                user_id: id,
                email: "vencuvnovymail@email.cz",
                name: "venca",
                updated_at: now
            });

            let db_account = await userController.loadUserByID(testUser.user_id);
          
            expect(db_account.updated_at).toEqual(now);

            let result = await userController.deleteUser(db_account);

            expect(result).toEqual(true);


        } catch (err) {
            console.log(err)
        }
        

    });


});