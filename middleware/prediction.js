const SkiRide = require('../model/SkiRide');
const debug = require('debug')('myApp');
const controller = require('../controller/generalController');
const st = require('./statistic');
const TestSession = require('../model/TestSession');

// @ts-check
/** Enum pro nastavení */
exports.TOLERANCE = {
  airTemperature: 2,
  snowTemperature: 2,
  humidity: 10
} // TODO  process.env

/** 
 * @param {Object} params vstupní parametry predikce
 * @param {string} params.ownerUserID
 * @param {Number=} params.airTemperature 
 * @param {Number=} params.snowTemperature
 * @param {Number=} params.snowType
 * @param {Number=} params.humidity
 * @typedef {Object} PredictedResult
 * @property {number} score skóre
 * @returns {PredictedResult} žebříček skóre
 */

exports.predict = async function (params) {

  let tests = TestSession.find(params);    // TODO do controllerů 

  if (tests.length == 1) {
    let data = await SkiRide.find(
      {
        ownerUserID: params.ownerUserID,
        testSessionID: tests[0].testSessionID
      });

    /** @type {Array<Number>} pole výsledků */
    const results = data.map((obj) => obj.value);
    const normalizedData = st.minMaxNormalize(results) //TODO kontrola typu testu


    const prediction = data.map((obj) => {
      return { ...obj, score: normalizedData };
    });

    return prediction; // predikci stanoví na základě existujícího testu
    /* -------------- */
    //TODO více jak 1 
    /* -------------- */
  } else {

    // nastavení tolerance   
    let data = TestSession.find(exports.setTolerance(params));   // provést hledání s odchylkou 

    if (data.length == 0) {
      return null; // žádný odpovídají test nebyl nalezen

    } else {
      // odhad výsledku    
      // vytvořit dynamické pole

      let X = params.map(obj => [obj.snowTemperature, obj.airTemperature, obj.humidity]);
      let y = st.minMaxNormalize(score);
      //todo výpočet regrese???
      // st.MLR()

    }

  }

}
/**
 * Dynamicky vytvoří mongo query objekt
 * Například můžete vyhledat všechny dokumenty s polem mezi 20 a 30 s tolerancí 5 pomocí následujícího parametru filtru: { property: { value: 25, tolerance: 5 }
*  @param {Object} filters 
 * @param {string} filters.ownerUserID 
 * @param {any=} filters.param1 hodnota
 * @param {Array=} filters.param2 výčet přípustných hodnot
 * @param {withTolerance=} filters.param3
 * @typedef {Object} withTolerance tolerance 
 * @property {number} value hodnota
 * @property {number} tolerance +- odchylka *
 * */
exports.queryBuilder = function (filters) {

  const query = {};

  for (const param in filters) {

    if (filters[param].hasOwnProperty('value')
      && filters[param].hasOwnProperty('tolerance')) {
      // interval filter
      query[param] = {
        $gte: filters[param].value - filters[param].tolerance,
        $lte: filters[param].value + filters[param].tolerance
      }; // nastaví horní a dolní hranici podle tolerance


    } else if (Array.isArray(filters[param])) {
      // výčet
      query[param] = { $in: filters[param] };
    } else {
      // hodnota
      query[param] = { $in: filters[param] };
    }

  }

  return query;

}


/**
 * Zabalí prvky x do nového pole 
 * @param {Array<any>} x 
 * @returns {Array<Array<any>>}
 */
function wrapArrays(x) {
  let y = [];
  for (let i = 0; i < x.length; i++) {
    y.push([x[i]]);
  }
  return y;
}


/**
 * Nastaví tolerance 
 * @param {Object} data filtr
 * @param {Number=} data.airTemperature 
 * @param {Number=} data.snowTemperature
 * @param {Number=} data.humidity
 * @returns {withTolerance} data s vlastní tolerancí
 */
exports.setTolerance = function (data) {

  for (let key in data) {
    switch (key) {
      case "airTemperature":
        data[key] = { value: data[key], tolerance: exports.TOLERANCE.airTemperature };
        break;
      case "snowTemperature":
        data[key] = { value: data[key], tolerance: exports.TOLERANCE.snowTemperature };
        break
      case "humidity":
        data[key] = { value: data[key], tolerance: exports.TOLERANCE.humidity };
        break;
      default:
        // pokud není definováná, nechá bezezměny
        break;
    }
  }
  return data;

}

