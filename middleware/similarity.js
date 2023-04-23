// https://www.npmjs.com/package/compute-cosine-similarity?activeTab=readme
const { distance, similarity } = require('ml-distance');
const st = require('./statistic');
const TestSession = require('../model/TestSession');


/**
 * Vyhledá nejbližší podobný test a vrátí seznam seřazený podle vzdáleností
 * @param {Array<TestSession>} model trénovací data
 * @param {TestSession} point test pro výpočet vzdálenosti
 * 
 * @typedef {Object} ModelSettings nastavení modelu jako počet druhů sněhu, pole vah (teplota vzduchu, sněhu, vlhkost, typ sněhu)  
 * @property {Number} numOfSnowType počet kategorií sněhu
 * @property {Array<Number>=} weights váhy jednotlivých parametrů v pořadí vzduch, sníh, vlhkost, typ sněhu (každá dimenze vlastní) 
 * @param {ModelSettings} modelSettings
 *  
 * @typedef {Object} DistanceArrayModel
 * @property {Number} id model id
 * @param {TestSession} data
 * @property {Number} distance
 * @property {Number} angle
 * @returns {{ id: number; testData: TestSession; vector: number[];distance: number; angle: number;}[]} seřazené pole dat podle vzdálenosti  
 */

exports.findClosest = function (data, point, modelSettings = {numOfSnowType: 5}) {
  
  data.unshift(point); // přidá výchozí bod na vrchol zásobníku
  
  let normalizedData = exports.extractAndNormalizeTestsData(data, modelSettings.numOfSnowType );
  let length = normalizedData.airTemperature.length;

  if (length !== normalizedData.snowTemperature.length ||
      length !== normalizedData.humidity.length ||
      length !== normalizedData.snowType.length) {   
       
    throw new Error(`Invalid dimensions: 
        airTemperature-${normalizedData.airTemperature.length},
        snowTemperature-${normalizedData.snowTemperature.length},
        snowType-${normalizedData.snowType.length},
        humidity-${normalizedData.humidity.length}` 
        )
   }
  let vectorSample = [];
  vectorSample.push(normalizedData.airTemperature[0]);
  vectorSample.push(normalizedData.snowTemperature[0]);
  vectorSample.push(normalizedData.humidity[0]);
  for (let j = 0; j < normalizedData.snowType[0].length; j++) {
    vectorSample.push(normalizedData.snowType[0][j]);
  }

  let result = [];
  for (let i = 1; i < length; i++) {
   
    let vector = [];
    vector.push(normalizedData.airTemperature[i]);
    vector.push(normalizedData.snowTemperature[i]);
    vector.push(normalizedData.humidity[i]);
    
    for (let j = 0; j < normalizedData.snowType[i].length; j++) {
        vector.push(normalizedData.snowType[i][j]);
    }
   
    let distance = exports.euclideanDistance(vectorSample, vector, modelSettings.weights);
    let angle = exports.cosineSimilarity(vectorSample, vector);

    result.push( {id: i, testData: data[i], vector: vector, distance: distance, angle: angle}); 

  }
  return result.sort((a, b) => a.distance - b.distance);

}
/**
 * Extrahuje hodnoty z pole objektů a vrátí je jako samostatná pole
 * @param {Array<TestSession>} data Pole objektů s daty.
 * @param {Number} numOfSnowType Počet kategorií sněhu
 * @note Využívá normalizační funkci z modulu {@link ./statistic}
 * @typedef {Object} normalizedData 
 * @property {Array<Number>} snowTemperature
 * @property {Array<Number>} airTemperature
 * @property {Array<Number>} humidity
 * @property {Array<Array<Number>>} snowType one hot vector
 * @returns {normalizedData} objekt polí normalizovaných dat
 */

exports.extractAndNormalizeTestsData = function (data, numOfSnowType) { 
  
  let result = {
    snowTemperature: [],
    airTemperature: [],
    humidity: [], 
    snowType: []
  };

  // extrakce dat
  data.forEach((obj) => {
    
    result.snowTemperature.push(obj.snowTemperature);
    result.airTemperature.push(obj.airTemperature);
    result.humidity.push(obj.humidity);
    let oneHotVector = exports.oneHotVector(obj.snowType, numOfSnowType);
    result.snowType.push(oneHotVector);
  
    });

    // normalizace dat
    result.snowTemperature = st.calculateZScore(result.snowTemperature);
    result.airTemperature = st.calculateZScore(result.airTemperature);
    result.humidity = st.calculateZScore(result.humidity);    


  return result;

}


/**
 * Zakoduje kategorickou hodnotu do vektoru
 * @param {Number} category Hodnota
 * @param {Number} length Počet kategorií celkem (udává délku vektoru)
 * @returns {Number[]} zakódovaná vstupní data
 * @example
 *  const data = 2;
    const categories = 3;
    const oneHot = oneHotVector(data,categories);
    console.log(oneHot); // [0, 0, 1];
 */
exports.oneHotVector = function(category, length) {  
    const oneHotVector = new Array(length).fill(0);
    oneHotVector[category] = 1;   
   return oneHotVector;
}

/**
 * Mapuje pole kategoriálních dat reprezentovaných číselnými identifikátory na jednočíselný vektor.
 *
 * @param {number[]} data Vstupní pole dat.
 * @param {number} lenght Počet kategorií.
 * @returns {number[][]} Dvourozměrné pole představující zakódováných vstupních dat
 *
 * @example
 * const data = [0, 1, 2, 0];
 * const categories = 3;
 * const oneHot = mapToOneHotVector(data, categories);
 * console.log(oneHot); // [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]]
 */
exports.mapToOneHotVectors = function(data, lenght) {  
  let result = [];
  for (let i = 0; i < data.length; i++) { 
    const oneHotVector = exports.oneHotVector(data[i], lenght);    
    result.push(oneHotVector);
  }
  return result;  
}
/**
 * Vypočítá euklidovskou vzdálenost mezi dvěma body
 * @param {number[]} A první bod
 * @param {number[]} B Druhý bod
 * @param {number[]} [weights=[]] Váhy pro jednotlivé rozměry, pokud nejsou uvedeny,
 * každá dimenze bude mít stejnou váhu 1.
 * @returns {number} (Vážená) euklidovská vzdálenost mezi dvěma body.
 * @throws {Error} Pokud nesedí dimenze (rozměr pole musí být stejný)
 */
exports.euclideanDistance = function (A, B, weights = []) {    
    if (A.length !== B.length) {
        throw new Error("wrong dimensions");
    }    
    let sum = 0;  
    for (let i = 0; i < A.length; i++) {
             
      if (weights != null && weights[i]) {
        sum += weights[i] * Math.pow(A[i] - B[i], 2)     
      } else {
        sum += Math.pow(A[i] - B[i], 2)
      }     
    
    }  
    return Math.sqrt(sum);
  }
  

  /**
   * Kosínová podobnost měří úhel mezi dvěma vektory a určuje, 
   * jak moc jsou tyto vektory orientovány v podobném směru.
   *  Pokud jsou vektory identické, úhel mezi nimi bude roven 0 a výsledek bude 1.
   *  pokud jsou vektory naprosto odlišné, úhel bude kolmý (90 stupňů) a výsledek podobnosti 0  
   * @param {Number[]} A souřadnice bodu A 
   * @param {Number[]} B souřadnice bodu B
   * @returns {Number} skóre podobnosti mezi dvěma vektory v rozmezí od 0 (odlišné) do 1 (shodné) 
   */
  
  exports.cosineSimilarity = function (A, B) { 
    if (A == null || B == null || A.length == 0 || B.length == 0 || B.length != A.length) { 
      return NaN;
    }    
    return similarity.cosine(A, B);
  }