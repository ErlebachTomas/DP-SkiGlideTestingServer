const MLR = require('ml-regression-multivariate-linear');
// const mth = require('mathjs');



// @ts-check

/** 
 * MinMax: Normalizátor min-max lineárně reškálí data do intervalu [0,1]   
 * @note pro pole stejných hodnot vrací jedničky!
 * @param {Array<number>} data vstupní pole číselných hodnot 
 * @param {Boolean} invert invertuje hodnoty tak že value = (x-1) * -1
 * @return {Array<number>} normalizedData původní data převedena do intervalu [0,1] 
 */
exports.minMaxNormalize = function(data, invert = false) {

    /** @type {Array<number>} */
    let normalizedData = [];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    if (range == 0) {
       return Array(data.length).fill(1); // pro pole stejných hodnot vrací jedničky
    } 

    for (let i = 0; i < data.length; i++) {
        normalizedData[i] = (data[i] - min) / range; 
    }

    if (invert) {     
       return normalizedData.map(x => Math.abs( (x - 1) * -1) ); 
    } else {          
        return normalizedData;
    }


}
/**
 * Funkce pro výpočet průměru
 * @param {Array<number>} data
 * @returns {Number} mean 
 */

exports.mean = function(data) {
    
    let n = data.length;
    if (n < 1) {
        return NaN;
    }    
    let sum = 0;
    for (var i = 0; i < n; i++) {
        sum += data[i];
    }
    
    return sum / n;
}

/**
 * Vrátí rozdíl od nejlepšího 
 * @param {Array<Number>} data skóre
 * @param {Boolean=} useMin invertuje výpočet a použije minimum 
 * @returns {Array<Number>} výsledek v absolutní hodnotě
 */
exports.differenceFromBest = function (data, useMin = true) {
    
    let diff = 0
    
    if (useMin) { 
        diff = Math.min(...data);     
    } else {
        diff = Math.max(...data)
    }

    let result = [];    
    for (var i = 0; i < data.length; i++) {

        result[i] = Math.abs(data[i] - diff);    // místo 0.2 vrací 0.019999999999999574 :(       
     
    }
    return result;

}


/** Funkce pro výpočet směrodatné odchylky 
 * @param {Array<number>} data
 * @returns {number} standardDeviation
 * 
 */
exports.standardDeviation = function (data) {

    const n = data.length;
    if (n < 1) {
        return NaN;
    }
    const mean = exports.mean(data);
    return Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)


}

/**
 * Normalizuje všechny hodnoty pole na Z-skóre,
 * null hodnoty z výpočtu vynechá a výsledné pole pak na příslušném indexu obsahuje nulu
 * @note pro pole stejných hodnot vrací nuly!
 * @note pro prázdné pole vrací prázdné pole 
 * @param {Array<number>} data 
 * @returns {Array<number>} zskore
 */
exports.calculateZScore = function (data) {

    let nonNullData = data.filter((value) => value != null);

    const mean = exports.mean(nonNullData);    

    const sd = exports.standardDeviation(nonNullData);
    
    let zScore = [];

    if (sd == 0) {
        return Array(data.length).fill(0); 
    }

    for (var i = 0; i < data.length; i++) {

        if (data[i] != null) {
        zScore[i] = (data[i] - mean) / sd; 
        } else {
            zScore[i] = 0;
        }
    }
    return zScore;
     
}

/**
 * Vícerozměrná lineární regrese
 * @param {Array<Array<Number>>} X vstupní data, každé pole reprezentuje nezávisle promněné 
 * @param {Array<Number>} y příslušné závislé promnéné y náležící k x
 * @param {Array<Number>} targetPoint cílová hodnota pro predikci o stejné dimenzi 
 * @returns  {Array<Number>} prediction, odhad y pro targetPoint
 */
exports.MLR = function (X, y, targetPoint) {
    if (X.length != y.length || targetPoint.length != X[0].length) {      
        throw new Error('Wrong dimension');
    }
    const model = new MLR(X, y);     
    return model.predict(targetPoint);   

}
/**
 * Vícerozměrná lineární regrese
 * @param { Array < Array < Number >>} X vstupní data, každé pole reprezentuje nezávisle promněné
 * @param { Array < Number >} y příslušné závislé promnéné y náležící k x
 * @returns { {model: MLR, r2: Number} }  
 */
exports.MLRmodel = function (X, y) {
  
    const model = new MLR(X, y);  
   // TODO r2 calculate model.coefficientOfDetermination(X, y)
    
   return {
        "model" : model,
        "r2": null
    }

}


/**
 * Metoda největšího spádu (Gradient Descent) 
 * @param {Array<Array<Number>>} X
 * @param {Array<Number>} y
 * @param {Array<Number>} theta pořáteční inicializace koeficientů
 * @param {Number} alpha volitelný koeficient posunu (learning rate alpha), pro příliš velké a může ovšem dojít k divergenci, pro příliš malé a bude konvergence naopak pomalá)
 * @param {Number} numIterations počet iterací
 * @returns theta 

exports.SGD = function (X, y, alpha = 0.01, numIterations = 100, theta = null) {

    if (theta == null) {
       theta = Array(y.length + 1).fill(0);
    } 

    for (let i = 0; i < numIterations; i++) {        

        // ................
        
    }
   
    return theta;
}
 */