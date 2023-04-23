const st = require('../middleware/statistic');


describe('minMaxNormalize', () => {
    test('normalizes data correctly', () => {
        const data = [1, 2, 3, 4, 5];
        const expected = [0, 0.25, 0.5, 0.75, 1];
        expect(st.minMaxNormalize(data)).toEqual(expected);
    });

    test('normalizes data inverted', () => {
        const data = [1, 2, 3, 4, 5];
        const expected = [1, 0.75, 0.5, 0.25, 0];
        expect(st.minMaxNormalize(data, true)).toEqual(expected);
    });

    test('returns empty array when given empty array', () => {
        expect(st.minMaxNormalize([])).toEqual([]);
    });

    test('returns same array when given array of same values', () => {
        const data = [1, 1, 1, 1];
        expect(st.minMaxNormalize(data)).toEqual(data);
    });

    test('array of same values', () => {
        const data = [10, 10, 10, 10];
        const expected = [1, 1, 1, 1];
        expect(st.minMaxNormalize(data)).toEqual(expected);
    });
});

describe('calculateMean', () => {
    test('calculates the mean of an array of numbers', () => {
        const data = [1, 2, 3, 4, 5];
        expect(st.mean(data)).toBe(3);
    });
    test('calculates the mean of an array of numbers', () => {
        const data = [2, 4, 4, 4, 5, 5, 7, 9]
        expect(st.mean(data)).toBe(5);
    });

    test('returns NaN for an empty array', () => {
        expect(st.mean([])).toBe(NaN);
    });
    test('calculates the mean of an array of negative numbers', () => {
        const data = [-3, -3];
        expect(st.mean(data)).toBe(-3);
    });
});

describe('calculateStandardDeviation', () => {
    test('calculates the standard deviation of an array of numbers', () => {
        const data = [2, 4, 4, 4, 5, 5, 7, 9];
        expect(st.standardDeviation(data)).toBe(2);
    });

    test('returns NaN for an empty array', () => {
        expect(st.standardDeviation([])).toBe(NaN);
    });
});


describe('calculateZScore', () => {

    test('calculates the Z-scores of an array of data with repeating values', () => {
        const data = [1, 1, 1, 1, 1];
        const expected = [0, 0, 0, 0, 0];
        expect(st.calculateZScore(data)).toEqual(expected);
    });
    test('calculates the Z-scores of an array of data with repeating values', () => {
        const data = [10, 10, 10];
        const expected = [0, 0, 0];
        expect(st.calculateZScore(data)).toEqual(expected);
    });
    test('with null values', () => {
        const data = [2, null, 4, 6, null, null];
        const expected = [-1, 0, 0, 1, 0, 0];
        let result = st.calculateZScore(data)
        for (let i = 0; i < result.length; i++) {
            expect(result[i]).toBeCloseTo(expected[i], 1);
        }
        // TODO fix precision error decimal.js
      }
    );

    test('empty array', () => {
        const data = [];
        const expected = [];
        expect(st.calculateZScore(data)).toEqual(expected);
    });
    test('calculates the Z-score of a value with normal distribution', () => {
        const data = [2, 4, 4, 4, 5, 5, 7, 9];
        let result = st.calculateZScore(data);
        expect(result[0]).toBe(-1.5); // 2
        expect(result[1]).toBe(-0.5); // 4
        expect(result[5]).toBe(0); // 5       
    });

});
describe('difference from best', () => {

    test('calculates inverted difference from best correctly ', () => {
        const data = [13.91, 14.14, 13.93, 14.5];
        const expected = [0, 0.23, 0.02, 0.59];

        let result = st.differenceFromBest(data,true);

        for (var i = 0; i < result.length; i++) {
            expect(result[i]).toBeCloseTo(expected[i], 5);
        }

    });

    test('returns empty array when given empty array', () => {
        expect(st.differenceFromBest([])).toEqual([]);
    });

    test('calculates standart difference from best ', () => {
        const data = [100, 50 ,10];
        const expected = [0, 50, 90];

        let result = st.differenceFromBest(data,false);

        for (var i = 0; i < result.length; i++) {
            expect(result[i]).toBeCloseTo(expected[i], 5);
        }

    });


});

describe('mlr', () => {

    test('example 2D', () => {
        const x = [
            [0, 0],
            [1, 2],
            [2, 3],
            [3, 4]
        ];

        const y = [
            [0],
            [2],
            [4],
            [6]
        ];
        const mlr = st.MLRmodel(x, y);
        let result = mlr.model.predict([3, 3]);
        for (var i = 0; i < result.length; i++) {
            expect(result[i]).toBeCloseTo(6, 2);
        }
    });


    test('return correct values (as in Excel)', () => {

        const X = [
            [0.5],
            [-0.5],
            [-1],
            [-1.5]
        ];

        let y = [
            [0.2653061],
            [0],
            [0.4084507],
            [0]
        ];
        let mlr = st.MLRmodel(X, y);

        console.log(mlr.model.predict([0, 0]))

        result = mlr.model.predict([0, 0])

        expect((result[0] - 1) * -1).toBeCloseTo(0.8, 1); // v procentech, +- 1%


    });

    test('example values', () => {
        const x = [
            [0, 0, 0],
            [1, 2, 0],
            [2, 3, 0],
            [3, 4, 0]
        ];

        const y = [
            [0],
            [2],
            [4],
            [6]
        ];

        let result = st.MLR(x, y, [3, 3, 0])

        for (var i = 0; i < result.length; i++) {
            expect(result[i]).toBeCloseTo(6, 2);
        }

    });



    /*
    describe('gradientDescentMulti', () => {
        test('return correct values', () => {
            const X =
            [[1, 2104, 5, 1],
            [1, 1416, 3, 2],
            [1, 1534, 3, 2],
            [1, 852, 2, 1]];
            const y = [460,232,315,178];
            const theta = [0,0,0,0];
            const alpha = 0.01;
            const iterations = 10;
    
            const expectedTheta = [-1.6808158,0.3673769,0.0021658,0.4336323];
    
            const result = st.SGD(X, y, alpha, iterations, theta);
    
            expect(result).toEqual(expectedTheta);
        });
    });
    */



});