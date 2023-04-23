const Ski = require('../model/Ski');
const SkiRide = require('../model/SkiRide');
const TestSession = require('../model/TestSession')
// @ts-check

/**
 * Generuje testovací data 
 * @param {number} skiCount počet požadovaných záznamů lyží
 * @param {number} testCount    
 * @param {number} skiRideCount 
 * @returns {{testSessions: TestSession[], skiRides: SkiRide[], skis: Ski[]}} Testovací data
 */
exports.generateTestData = function(skiCount, testCount, skiRideCount, userId = "user123" ) {
    const testSessions = exports.generateTestSessions(testCount, userId);   
    const skis = exports.generateSki(skiCount, userId); 

    const skiRides = []; 

    for (let i = 1; i <= skiRideCount; i++) {  
    
    let testSessionUUID = testSessions[Math.floor(Math.random() * testSessions.length)].UUID
    let skiUUID = skis[Math.floor(Math.random() * skis.length)].UUID;

      const skiRide = new SkiRide({
        UUID: `ski-ride-uuid-${i}`,
        testSessionID: testSessionUUID,
        skiID: skiUUID,
        result: Math.floor(Math.random() * 1000),
      });
     
      skiRides.push(skiRide);
    }
  
    return { testSessions, skiRides, skis };
  }



exports.generateSki = function (count, userId = "user123") {
    const skis = [];  
    for (let i = 1; i <= count; i++) {  
        
      // Vytvoření Ski
      const skiUUID = `ski-uuid-${i}`;      
      const ski = new Ski({
        UUID: skiUUID,
        name: `Ski ${i}`,
        ownerUserID: userId,
        description: `Description ${i}`,
      });
      skis.push(ski);
    }
    return skis;
}

  /**
 * Generuruje dump data testů
 * @param {Number} count 
 * @returns {Array}
 */
  exports.generateTestSessions = function (count, userID = "user123" ) {
    
    let tests = [];
    
    let types = 3
    let snowType = 5;
  
  
    for (let i = 1; i <= count; i++) {
      let test = new TestSession({
        UUID: "UUID-" + String(i),
        datetime: new Date(),
        ownerUserID: userID,
        airTemperature: Math.floor(Math.random() * 30) - 15,
        snowTemperature: Math.floor(Math.random() * 30) - 15,
        snowType: Math.floor(Math.random() * snowType),
        testType: Math.floor(Math.random() * types),
        humidity: Math.random() < 0.5 ? null : Math.floor(Math.random() * 100),         
        note: "Test session " + i,
        status: "online",
        updated_at: new Date()
      });
      tests.push(test);
    }
  
    return tests;
  }