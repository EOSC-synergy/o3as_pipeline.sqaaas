import { asc, sum, mean, std, q25, q75, median,  } from "./math";

describe("tests the functions provided in the math package", () => {
    it('sorts an array of numbers in ascending order', () => {
        const unsorted = [4, 2, 5, 1, 0, 3]
        expect(asc(unsorted)).toEqual([...Array(unsorted.length).keys()]);
    });

    it('takes the sum of all elements from an array', () => {
        const numbers = [...Array(11).keys()]; // 0 ... 10
        expect(sum(numbers)).toEqual(55); // gauss
    });

    it('takes the mean of all elements from an array', () => {
        const numbers = [1, 2, 3, 4, 5];
        expect(mean(numbers)).toEqual(3);
    });

    it('takes the std of all elements from an array', () => {
        const numbers = [2, 4, 4, 4, 5, 5, 7, 9];
        expect(std(numbers)).toEqual(2);
    });

    it('takes the lower quartile of an array', () => {
        const numbers = [6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49];
        expect(q25(numbers)).toEqual(25.5);
    });
    
    it('takes the median of an arry', () => {
        const numbers = [6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49];
        expect(median(numbers)).toEqual(40);
    });

    it('takes the upper quartile of an array', () => {
        const numbers = [6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49];
        expect(q75(numbers)).toEqual(42.5);
    });
});