const Ski = require('../model/Ski');
const User = require('../model/User');
const TestSession = require('../model/TestSession');

const similarity = require('../middleware/similarity');

const skiRideController = require('./skiRideController');
const debug = require('debug')('myApp');

//@ts-check
/* Bussines logika a pomocné funkce */
//https://www.mongodb.com/docs/manual/reference/sql-comparison/

/**
 * zkontroluje jestli v db existuje uťivatelskť účet a pokud ne, rovnou ho založí
 * porovná čas  
 * @param {Request} req
 * @param {Response} res
 */
exports.checkUser =
    async function (req, res) {

    let user = req.body.user

    try {
        let serverAccount = await User.find({ user_id: user.id });

        if (serverAccount == null) {
          
            let newUser = new User({ data });
            await newUser.save();

        } else {
            // do crud operace user, porovnat čas a updatovat případně
            // kontrola verze aplikace a nabídnout update

        }

    } catch (err) {
        res.status(500).json(err);
    }

}
/**
 * Porovná dva UTC časy, jestliťe je první čas větší vrací true  
 * @param {String} clientUpdateTime UTC time string
 * @param {String} serverUpdateTime UTC time string
 */
exports.isServerOutDateted = function (clientUpdateTime, serverUpdateTime) {

    client = new Date(clientUpdateTime);
    server = new Date(serverUpdateTime);
    return client > server; 

}
/**
 * Vrátí akuální čas v ISO formátu
 * */
exports.currentTimeString = function () {

    return new Date().toISOString();
} 

/** Wraper pro ošetření api akcí
 * @param {Response} res  
 * @param {Function} lambdaFun lambda
 * @param {JSON} response odpověd
 * @param {number} kod pro úspěch (500 pokud err) 
 * */
exports.try = async function (res, lambdaFun, status = 200) {

    try {          
        await lambdaFun();
        res.sendStatus(status);
            
    } catch (err) {
        debug(err);
        /** #swagger.responses[500] = {
            description: 'Server error' }*/

        res.status(500).json(err);
    }
};

/**
 * Preprocesing dat
 * @param {Request} req
 * @param {Response} res 
 * @param {any} next 
 */
exports.processDataBody = async function (req, res, next) {

    req.body.data["ownerUserID"] = req.body.userID;   
    debug(req.body.data)
    next()   

}


/**
 * Doporučí nejvhodnější pár lyží
 * @param {TestSession} input 
 * @param {{numOfSnowType: Number, weights: Array<Numbers>}=} settings
 * @returns {{ skiResults: { differenceFromBest: number; score: number; skiUUID: string; skiName: string; skiDescription: string | undefined; results: number[]; mean: number; }[]; id: number; testData: { UUID: string; ownerUserID: string; datetime: string; airTemperature: number; snowTemperature: number; snowType: number; testType: number; status?: string | undefined; updated_at?: string | undefined; humidity?: number | undefined; note?: string | undefined; } vector: number[]; distance: number; angle: number; }[] } recomendation
 */
exports.recomendation = async function (input, 
    settings = {numOfSnowType: 5, weights: [1, 1, 0.1 ]},
    limit = 10
    ) {

  const trainData = await TestSession.find({ ownerUserID: input.ownerUserID });
  if (trainData.length == 0) {
    debug("No training data");
    return [];
  }


  /** @type {{ id: number; testData: TestSession; vector: number[];distance: number; angle: number;}[]} */
   const sm = similarity.findClosest(trainData,input,settings);

   let length = sm.length > limit ? limit : sm.length // limit
   
   let result = []
   for (let i = 0; i < length; i++) {
    
    let skiRideSorted = await skiRideController.getSkiRidesNormalizedResult(sm[i].testData.UUID) 
         
    result.push({
        ...sm[i],
        skiResults: skiRideSorted
        }); 
   }  

   return result;

}