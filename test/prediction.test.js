const middleware = require('../controller/generalController');
const userController = require('../controller/userController');
const skiController = require('../controller/skiController');
const testSessionController = require('../controller/testSessionController');
const pred = require('../middleware/prediction');
const TOLERANCE = require('../middleware/prediction');

// @ts-check
describe('tools', function () {

    test("simple dynamic query", async () => {

        let expected = { id: 10, value: "testing" };

        let query = {}    
        
        if(expected.id) {
        query["id"] = expected.id;
        
        query["value"] = expected.value;
        }
        if (expected.ttt) {
            query["ttt"] = expected.value;
        }
        expect(query).toEqual(expected);

    });


    test("dynamic query function", async () => {
          
       let filters = { 
        ownerUserID: "Test123",
        AirTemperature: { value: 10, tolerance: 5 }, 
        snowType: [1, 2],
        snowTemperature: -3
        }
    
        let query = pred.queryBuilder(filters);

        let expected =  {  
             "ownerUserID":  {
                "$in": "Test123",
              },
              "AirTemperature":  {
                "$gte": 5,
                "$lte": 15,
             },             
               "snowType": {
                 "$in": [ 1, 2],
             },
             "snowTemperature":  {
                "$in": -3,
              },
         }

        expect(query).toEqual(expected);


    });


    test("set tolerance to object", async () => {
    
        let filters = { 
            ownerUserID: "Test123",
            airTemperature: 10 , 
            snowType: 1,
            snowTemperature: -3
            }

    let result = pred.setTolerance(filters);
    
    const expected = {
            ownerUserID: "Test123",
            airTemperature: { value: 10, tolerance: pred.TOLERANCE.airTemperature },
            snowType: 1,
            snowTemperature: { value: -3 , tolerance: pred.TOLERANCE.snowTemperature }
        }
    

    expect(result).toEqual(expected);

    
    });
});