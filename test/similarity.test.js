const utils = require('./utils');
const sm = require('../middleware/similarity')
const TestSession = require('../model/TestSession')


describe('weightedEuclideanDistance', () => {
    test('vypočítá správnou vzdálenost mezi dvěma body se stejnými váhami', () => {
      const pointA = [1, 2, 3];
      const pointB = [4, 5, 6];
      const expectedDistance = 5;
      const distance = sm.euclideanDistance(pointA, pointB);
      expect(distance).toBeCloseTo(expectedDistance,1)
    });
    test('váhy jsou null', () => {
      const pointA = [1, 2, 3];
      const pointB = [4, 5, 6];
      const expectedDistance = 5;
      const weights = null;
      const distance = sm.euclideanDistance(pointA, pointB, weights);
      expect(distance).toBeCloseTo(expectedDistance,1)
    });
    test('vypočítá správnou vzdálenost mezi dvěma body s různými váhami', () => {
        const pointA = [1, 2, 3];
        const pointB = [4, 5, 6];
        const weights = [0.5, 0.3, 0.2];
        const expectedDistance = 3;
        const distance = sm.euclideanDistance(pointA, pointB, weights);
        expect(distance).toBeCloseTo(expectedDistance,1)
      });
    test('vyhodí chybu, pokud mají body různé rozměry', () => {
        const pointA = [1, 2, 3];
        const pointB = [4, 5];
        expect(() => sm.euclideanDistance(pointA, pointB)).toThrow();
      });




});

describe('cosineSimilarity', () => {
    test('podobnost mezi dvěma vektory', () => {
      const vector1 = [1, 2, 3];
      const vector2 = [2, 4, 6];
      const similarity = sm.cosineSimilarity(vector1, vector2);
      expect(similarity).toBeCloseTo(1, 5);
  
      const vector3 = [1, 0, 0, 1];
      const vector4 = [0, 1, 0, 1];
      const similarity2 = sm.cosineSimilarity(vector3, vector4);
      expect(similarity2).toBeCloseTo(0.5, 5);
    });
  
    test('vrátí NaN', () => {
      const vector1 = [1, 2, 3];
      const vector2 = [];
      const similarity = sm.cosineSimilarity(vector1, vector2);      
      expect(similarity).toBeNaN();
      expect(sm.cosineSimilarity(vector1, null)).toBeNaN();
      expect(sm.cosineSimilarity(vector1, undefined)).toBeNaN();

    });  


   
  });


  describe('OneHot', () => {
    test(' one hot vectors', () => {
      const data = [0, 1, 2, 0];
      const categories = 3;
      const expected = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]];
      const result = sm.mapToOneHotVectors(data, categories);
      expect(result).toEqual(expected);
    });    
    test(' one hot vector', () => {
        const data = 2;
        const categories = 3;
        const expected = [0, 0, 1];
        const result = sm.oneHotVector(data,categories)
        expect(result).toEqual(expected);
      }); 
    test('prázdné pole', () => {
      const data = [];
      const categories = 3;
      const expected = [];
      const result = sm.mapToOneHotVectors(data, categories);
      expect(result).toEqual(expected);
    });
  });

  describe('extractAndNormalizeTestsData', () => {
    test('vrací normalizovaná testovací data', () => {
      const data = [
        { snowTemperature: -2, airTemperature: 20, humidity: 30, snowType: 0 },
        { snowTemperature: -2, airTemperature: 15, humidity: 25, snowType: 1 },
        { snowTemperature: -2, airTemperature: 0, humidity: 10, snowType: 2 },
      ];
      const numOfSnowType = 3;
  
      const result = sm.extractAndNormalizeTestsData(data, numOfSnowType);
  
      expect(result).toEqual({
        snowTemperature: [0, 0.649, -1.432],
        airTemperature: [0, 0.074, -1.0],
        humidity: [0, 0.580, -1.742],
        snowType: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      });
    });
  });

  describe('findClosest', () => {
    test('test dva stejné', () => { 
      
      let example = new TestSession({
        UUID: "user123",
        datetime: "2022-04-20T13:15:00.000Z",
        ownerUserID: "user123",
        airTemperature: 5,
        snowTemperature: 0,
        snowType: 3,
        testType: 1,
        humidity: 80,
        note: "Test session",
        status: "online",
        updated_at: "2022-04-20T16:00:00.000Z"
    });
      
    let tests = utils.generateTestSessions(10);     
    tests.push(example);

    const setinngs = {numOfSnowType: 9};

     
    const result = sm.findClosest(tests,example, setinngs )
      
    expect(result[0].distance).toEqual(0);
    expect(result[0].angle).toBeCloseTo(1,1);
    expect(result[1].distance).toBeGreaterThan(0);
    expect(result[1].angle).toBeLessThan(1);

    });


   test('různé váhy', () => { 
      
      let target = new TestSession({
        UUID: "target",
        datetime: "2022-04-20T13:15:00.000Z",
        ownerUserID: "user123",
        airTemperature: 5,
        snowTemperature: 0,
        snowType: 3,
        testType: 1,
        humidity: 80,
        note: "Test session",
        status: "online",
        updated_at: "2022-04-20T16:00:00.000Z"
    });
    let id = "správný výsledek, pouze výrazně jiná vlhkost";

    let example = new TestSession({
      UUID: "o stupeň jina teplota ",
      datetime: "2022-04-20T13:15:00.000Z",
      ownerUserID: "user123",
      airTemperature: 4,
      snowTemperature: 1,
      snowType: 3,
      testType: 1,
      humidity: 80,
      note: "Test session",
      status: "online",
      updated_at: "2022-04-20T16:00:00.000Z"
  });

  let example2 = new TestSession({
    UUID: id,
    datetime: "2022-04-20T13:15:00.000Z",
    ownerUserID: "user123",
    airTemperature: 5,
    snowTemperature: 0,
    snowType: 3,
    testType: 1,
    humidity: 70,
    note: "Test session",
    status: "online",
    updated_at: "2022-04-20T16:00:00.000Z"
});

let example3 = new TestSession({
  UUID: "totalně mimo",
  datetime: "2022-04-20T13:15:00.000Z",
  ownerUserID: "user123",
  airTemperature: -5,
  snowTemperature: 8,
  snowType: 1,
  testType: 1,
  humidity: 20,
  note: "Test session",
  status: "online",
  updated_at: "2022-04-20T16:00:00.000Z"
});

    let tests = []; 
    tests.push(example);
    tests.push(example2);    
    tests.push(example3);

    const setinngs = {numOfSnowType: 5,
                     weights: [1, 1, 0.1 ]
    };

     
    const result = sm.findClosest(tests,target, setinngs )      
    expect(result[0].data.UUID).toEqual(id);    

    });
  
  });


  test('null v uživatelem zadaném testu, větší počet dat', () => { 
      
    let target = new TestSession({
      UUID: "target",
      datetime: "2022-04-20T13:15:00.000Z",
      ownerUserID: "user123",
      airTemperature: 5,
      snowTemperature: 0,
      snowType: 3,
      testType: 1,
      humidity: null,
      note: "Test session",
      status: "online",
      updated_at: "2022-04-20T16:00:00.000Z"
  });
  const num = 50000;
  let tests = utils.generateTestSessions(num); 
 
  const setinngs = {numOfSnowType: 5,
                   weights: [1, 1, 0.1 ]
  };

   
  const result = sm.findClosest(tests,target, setinngs )      
  expect(result.length).toEqual(num);    

  });

