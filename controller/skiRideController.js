const SkiRide = require('../model/SkiRide');
const debug = require('debug')('myApp');
const controller = require('./generalController');

const middleware = require('../middleware/statistic');
const TestSession = require('../model/TestSession');
const Ski = require('../model/Ski');

exports.insertSkiRide = async function (req, res) {
  /** #swagger.tags = ['SkiRide']
          #swagger.summary = Insert a new SkiRide object
          #swagger.responses[201] = {
                 description: 'Successfully inserted the SkiRide object' }
          #swagger.security = [{
                  "apiKeyAuth": []
              }] */
  controller.try(res, async function () {
    new SkiRide(req.body.data).save();
  }, 201);
}

exports.updateSkiRide = async function (req, res) {
  /** #swagger.tags = ['SkiRide']
     #swagger.summary = Update a SkiRide object
     #swagger.parameters['userID'] = { 
          in: 'body',
          description: 'The user ID of the owner of the SkiRide object to be updated.',
          required: true,
          type: 'string'
     }
     #swagger.parameters['UUID'] = {
          in: 'body',
          description: 'The UUID of the SkiRide object to be updated.',
          required: true,
          type: 'string'
     }
     #swagger.parameters['data'] = { 
          in: 'body',
          description: 'The updated SkiRide object data.',
          required: true,
          type: 'object'
     }
     #swagger.responses[200] = { 
          description: 'SkiRide object updated successfully.'
     }
     #swagger.responses[500] = { 
          description: 'SkiRide object not found.'
     }
     #swagger.security = [{
                  "apiKeyAuth": []
              }] 
  */


  controller.try(res, async function () {
    const filter = { "UUID:": req.body.data.UUID, "ownerUserID": req.body.userID };
    let updateDoc = req.body.data;
    SkiRide.updateOne(filter, updateDoc, { upsert: true });
  });
}


exports.deleteSkiRide = async function (req, res) {
  /** #swagger.tags = ['SkiRide']
     #swagger.summary = Delete a SkiRide object
     #swagger.parameters['userID'] = { 
          in: 'body',
          description: 'The user ID of the owner of the SkiRide object to be deleted.',
          required: true,
          type: 'string'
     }
     #swagger.parameters['UUID'] = {
          in: 'body',
          description: 'The UUID of the SkiRide object to be deleted.',
          required: true,
          type: 'string'
     }
     #swagger.responses[200] = { 
          description: 'SkiRide object deleted successfully.'
     }
     #swagger.responses[500] = { 
          description: 'SkiRide object not found.'
     }
     #swagger.security = [{
                  "apiKeyAuth": []
              }] 
  */
  controller.try(res, async function () {
    SkiRide.findOneAndRemove({ UUID: req.body.data.UUID, ownerUserID: req.body.userID });
  });
}

exports.syncSkiRide = async function (req, res) {
  /** #swagger.tags = ['SkiRide'] 
       #swagger.security = [{
                  "apiKeyAuth": []
              }] */
  controller.try(res, async function () {
    let result = await SkiRide.find({ ownerUserID: req.body.userID, UUID: req.body.data.UUID });
    if (Object.keys(result).length == 0) {
      new SkiRide(req.body.data).save();
    }
  });
}

exports.getAllSkiRidesWithSki = async function (req, res) {
  const userID = req.query.userID;
  const testID = req.query.testID;
  try {
      let result = await SkiRide.find({ ownerUserID: userID, testSessionID: testID })
      .populate('ski'); // join on "skiID"  
      debug(result);

      // Transforming result data
      let transformedResult = result.map(item => ({
          skiRide: {
              _id: item._id,
              UUID: item.UUID,
              testSessionID: item.testSessionID,
              skiID: item.skiID,
              result: item.result,
              note: item.note,
              status: item.status,
              updated_at: item.updated_at,
              __v: item.__v,
              value: item.value,
          },
          ski: item.ski,
          id: item.id
      }));

      res.json(transformedResult);
  } catch (err) {
      console.error(err);
      res.status(500).json(err);
  }
}

exports.getAllSkiRides = async function (req, res) {
  /** #swagger.tags = ['SkiRide']
 #swagger.summary = Get all SkiRide objects for a user
 #swagger.parameters['userID'] = { 
      in: 'query',
      description: 'The user ID of the owner of the SkiRide objects to be retrieved.',
      required: true,
      type: 'string'
 }
 #swagger.responses[200] = { 
      description: 'SkiRide objects retrieved successfully.',
      schema: { 
          type: 'array', 
          items: { 
              $ref: '#/definitions/SkiRide'
          }
      }
 }
 #swagger.security = [{
              "apiKeyAuth": []
          }] 
 #swagger.responses[500] = { 
      description: 'Internal server error.'
 }
*/
  debug("nacitam data jizd pro " + req.query.userID);
  try {
    let result = await SkiRide.find({ ownerUserID: req.query.userID });
    res.json(result);
  } catch (err) {
    debug(err);
    res.status(500).json(err);
  }
}

/*  Na základě ID testu a vrátí informace o provedených jídách
 * @async
 * @param {String} testSessionUUID UUID vybraného záznamu TestSession.  
 * @returns {Promise<Array<{skiUUID: string; skiName: string |  undefined; skiDescription: string | undefined; skiRideUUID: string;  result: number | undefined;}>>} pole objektů dat
 * @throws {Error} Pokud není nalezen záznam Ski s daným UUID v některém z SkiRide.
 */

/*
exports.getSkiRidesByTestSessionUUID = async function(testSessionUUID) {
     
  const skiRides = await SkiRide.find({ testSessionID: testSessionUUID });  
  if(!skiRides) {
    return [];
  }  
  const skiRidesWithSkiInfo = [];

  for (let index = 0; index < skiRides.length; index++) {
    
    const skiRide = skiRides[index];
    let id = skiRide.skiID;

    let ski = await Ski.find({ UUID: id });
    if (!ski || !ski[0]) {
      throw new Error(`Ski with UUID ${skiRide.skiID} from ${skiRide.UUID} not found`);
    } else {
        skiRidesWithSkiInfo.push({      
        skiUUID: id,
        skiName:  ski[0].name || null,
        skiDescription: ski[0].description || null,
        
        skiRideUUID: skiRide.UUID,
        result: skiRide.result
        });
    }
  }

  return skiRidesWithSkiInfo;
  
}
*/

/** Na základě ID testu a vrátí informace o provedených jídách
 * @async
 * @param {String} testSessionUUID UUID vybraného záznamu TestSession.  
 * @returns {Promise<Array<{skiUUID: string; skiName: string; skiDescription: string | undefined; skiRideUUID: string;  result: number}>>} pole objektů dat
 */
exports.getSkiRidesByTestSessionUUID = async function (testSessionUUID) {
  const sks = await SkiRide.find({ testSessionID: testSessionUUID });

  const pipeline = [

    // filtr 
    { $match: { testSessionID: testSessionUUID } },
    // Join 
    {
      $lookup: {
        from: "skis",
        localField: "skiID",
        foreignField: "UUID",
        as: "ski",
      },
    },
    // rozbalení
    { $unwind: "$ski" },
    // mapování
    {
      $project: {
        skiRideUUID: "$UUID",
        skiUUID: "$skiID",
        skiName: "$ski.name",
        skiDescription: "$ski.description",
        result: "$result",
      },
    },
  ];

  const skiRides = await SkiRide.aggregate(pipeline);

  return skiRides;
}


/**
 * Rozhodně zda invertovat výsledek testu
 * @param {Number} testType 
 * @returns {boolean} true 
 */
exports.isMinBest = function (testType) {
  const settings = {
    Time: 0,
    Distance: 1,
    Speed: 2
  }
  switch (testType) {
    case settings.Time:
      return true;
    case settings.Distance:
      return false;
    case settings.Speed:
      return false;
    default:
      return false
  }
}

/**
* Vrátí relativní výsledek score lyží seřazený podle skóre
* @async
* @param {string} testSessionUUID UUID vybraného záznamu TestSession.
* @returns {Promise<Array<{differenceFromBest: number; score: number; skiUUID: string;skiName: string; skiDescription: string | undefined; results: number[]; mean: number;}>>} Pole objektů obsahující informace o SkiRide a odpovídajícím záznamu Ski s průměrnou hodnotou skiRideResult.

*/
exports.getSkiRidesNormalizedResult = async function (testSessionUUID) {

  const testSessions = await TestSession.find({ UUID: testSessionUUID });
  const testSession = testSessions[0];

  const skiRides = await exports.getSkiRidesByTestSessionUUID(testSessionUUID); // načte jízdy 


  const uniqueID = [...new Set(skiRides.map(skiRide => skiRide.skiUUID))]; // unikátní lyže

  let temp = [];

  for (let i = 0; i < uniqueID.length; i++) {
    let selectedSki = uniqueID[i];

    let filteredSkiRides = skiRides.filter((skiRide) => skiRide.skiUUID === selectedSki) // výběr
    let allSkiResults = filteredSkiRides.map((skiRide) => skiRide.result); // extahování všech výsledků jedné lyže v testu

    let mean = middleware.mean(allSkiResults);

    let skiRide = filteredSkiRides[0] // stačí jeden reprezentant       
    let row = {
      skiUUID: skiRide.skiUUID,
      skiName: skiRide.skiName,
      skiDescription: skiRide.skiDescription,
      results: allSkiResults,
      mean: mean,
    }
    temp.push(row);
  }

  // výpočet z průměrné hodnoty
  let scoreArray = temp.map((obj) => obj.mean);

  let isInverted = exports.isMinBest(testSession.testType);


  let differenceFromBest = middleware.differenceFromBest(scoreArray, isInverted)
  let normalizedScore = middleware.minMaxNormalize(scoreArray, isInverted);


  let output = [];
  for (let i = 0; i < temp.length; i++) {
    output.push(
      {
        ...temp[i],
        differenceFromBest: differenceFromBest[i],
        score: normalizedScore[i]
      });
  }
  //const skiRideSorted = output.sort((a, b) => a.score - b.score);
  const skiRideSorted = output.sort((a, b) => b.score - a.score); //sestupně
  return skiRideSorted;

}