const middleware = require('../controller/generalController');
const userController = require('../controller/userController');
const skiController = require('../controller/skiController');
const testSessionController = require('../controller/testSessionController');
const skiRideController = require('../controller/skiRideController');
const User = require('../model/User');

const controller = require('../controller/generalController');

const { v4: uuidv4 } = require('uuid');

const TestSession = require('../model/TestSession');
const Ski = require('../model/Ski');
const SkiRide = require('../model/SkiRide');

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const utils = require('./utils');
/* === TESTY === */


describe('getSkiRidesByTestSessionUUID', () => {
    let mongoServer;
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
  
    afterEach(async () => {
      await TestSession.deleteMany({});
      await Ski.deleteMany({});
      await SkiRide.deleteMany({});
    });
  
    test('prázdné pole', async () => {
      const testSessionUUID = 'test-session-uuid-1';
      const skiRides = await skiRideController.getSkiRidesByTestSessionUUID(testSessionUUID);
      expect(skiRides).toEqual([]);
    });
  
    test('korektní výsledky', async () => {
      const testSessionUUID = 'test-session-uuid-1';
  
      // test data
      const testSession = new TestSession({
        UUID: testSessionUUID,
        datetime: '2023-04-16T14:00:00.000Z',
        ownerUserID: 'user-1',
        airTemperature: 0,
        snowTemperature: 0,
        snowType: 1,
        testType: 1,
      });
      const ski = new Ski({
        UUID: 'ski-uuid-1',
        name: 'Ski 1',
        ownerUserID: 'user-1',
        description: 'Description 1',
      });
      const skiRide = new SkiRide({
        UUID: 'ski-ride-uuid-1',
        testSessionID: testSessionUUID,
        skiID: ski.UUID,
        result: 10,
      });
      await testSession.save();
      await ski.save();
      await skiRide.save();
      

      const skiRides = await skiRideController.getSkiRidesByTestSessionUUID(testSessionUUID);
      expect(skiRides.length).toBe(1);
      expect(skiRides[0].skiRideUUID).toBe(skiRide.UUID); 
      expect(skiRides[0].result).toBe(skiRide.result);
      expect(skiRides[0].skiName).toBe(ski.name);
      expect(skiRides[0].skiDescription).toBe(ski.description);
 
    });

});

describe('getSkiRidesNormalizedResult', () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await TestSession.deleteMany({});
    await Ski.deleteMany({});
    await SkiRide.deleteMany({});
  });

  test('korektní výsledky', async () => {
    const testSessionUUID = 'test-session-uuid-1';
    
    // test data
    const testSessions = [
    new TestSession({
    UUID: testSessionUUID,
    datetime: '2023-04-16T14:00:00.000Z',
    ownerUserID: 'user-1',
    airTemperature: 0,
    snowTemperature: 0,
    snowType: 1,
    testType: 1,
    })]
    const skis = [
    new Ski({
    UUID: 'ski-uuid-1',
    name: 'Ski 1',
    ownerUserID: 'user-1',
    description: 'Description 1',
    }),
    new Ski({
    UUID: 'ski-uuid-2',
    name: 'Ski 2',
    ownerUserID: 'user-1',
    description: 'Description 2',
    }),
    new Ski({
    UUID: 'ski-uuid-3',
    name: 'Ski 3',
    ownerUserID: 'user-1',
    description: 'Description 3',
    }),
    ];
    
    const skiRides = [
    new SkiRide({
    UUID: 'ski-ride-uuid-1',
    testSessionID: testSessionUUID,
    skiID: skis[0].UUID,
    result: 100,
    }),
    new SkiRide({
    UUID: 'ski-ride-uuid-3',
    testSessionID: testSessionUUID,
    skiID: skis[2].UUID,
    result: 50,
    }),
    new SkiRide({
    UUID: 'ski-ride-uuid-2',
    testSessionID: testSessionUUID,
    skiID: skis[1].UUID,
    result: 10,
    }),
    ];
    
    await Promise.all([
    ...testSessions.map(testSession => testSession.save()),
    ...skis.map(ski => ski.save()),
    ...skiRides.map(skiRide => skiRide.save()),
    ]);

    let results = await skiRideController.getSkiRidesNormalizedResult(testSessionUUID);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("score");
    expect(results[0].score).toBe(1);
    expect(results[0]).toHaveProperty("differenceFromBest");
    expect(results[0].differenceFromBest).toBe(0);
    expect(results[0]).toHaveProperty("mean");
    });
  
});



describe('komplexní test', function () {
  
  let mongoServer;
  let user = "user123";
  let testCount = 2;
  const skisCount = 3;
  const ridesCount = 20;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    
    let data = utils.generateTestData(skisCount, testCount, ridesCount);   

    for (let i = 0; i < data.testSessions.length; i++) {
      await data.testSessions[i].save();    
    }
    for (let i = 0; i < data.skiRides.length; i++) {
      await data.skiRides[i].save();    
    }
    for (let i = 0; i < data.skis.length; i++) {
      await data.skis[i].save();    
    }  
   

  });
  // afterEach(async () => { }); 
  afterAll(async () => {
    await TestSession.deleteMany({});
    await Ski.deleteMany({});
    await SkiRide.deleteMany({});

    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("data", async () => {
    
    let result = await TestSession.find({ ownerUserID: user });     
    expect(result.length).toEqual(testCount);
    result = await Ski.find({ ownerUserID: user});
    expect(result.length).toEqual(skisCount);
     
  });
  test("vyber", async () => {    

     let results = await skiRideController.getSkiRidesNormalizedResult("UUID-1");
     expect(results.length).toBeGreaterThan(0);
     expect(results[0]).toHaveProperty("score");
     expect(results[0].score).toBe(1);
     expect(results[0]).toHaveProperty("differenceFromBest");
     expect(results[0].differenceFromBest).toHaveProperty(0);
     expect(results[0]).toHaveProperty("mean");
     expect(results[results.length-1].score).toBe(0);
     
  });

  test("doporuceni", async () => { 

    let input = {
    UUID: "0",
    datetime: '2023-04-16T14:00:00.000Z',
    ownerUserID: user,
    airTemperature: 0,
    snowTemperature: 0,
    snowType: 1,
    testType: 1,
    };

    let result = await controller.recomendation(input);  
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("distance");
    expect(result[0]).toHaveProperty("angle");
    expect(result[0]).toHaveProperty("skiResults");
    
  });

  test("doporuceni no data error", async () => { 

    let input = {
    UUID: "0",
    datetime: '2023-04-16T14:00:00.000Z',
    ownerUserID: "user nenalezen",
    airTemperature: 0,
    snowTemperature: 0,
    snowType: 1,
    testType: 1,
    };
    let result = await controller.recomendation(input);  
    expect(result.length).toBe(0);
    //expect(() => controller.recomendation(input)).toThrow("No training data");
    
  });


  

});

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


/*
describe('SkiController', function () {

    let userID = "123";
    let ski = {
        name: "lyze1",
        ownerUserID: userID,
        description: "testovaci lyže",
        updated_at: middleware.currentTimeString()
    }

    describe('Ski CRUD', function () {

        test("Add and remove", async () => {           

            // přidá záznam
            let r = await skiController.addSkiIfNotExist(userID, ski);          
            expect(ski.name).toEqual(r.name);
            // přidá stejný záznam znovu
            let addTheSame = await skiController.addSkiIfNotExist(userID, ski);
            expect(addTheSame.name).toEqual(r.name);
            // kontrola, že se vložil jednou
            let loadedSki = await skiController.loadSki(userID, ski.name);
            expect(Object.keys(loadedSki).length).toEqual(1);
             //vymaže záznam
            let r2 = await skiController.deleteSki(userID, ski.name);
            expect(ski.name).toEqual(r2.name);            
        });
    });
   
});
*/

/*
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

            fail(err);
        }

    });


});
*/