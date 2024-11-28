import { Byte } from "../types/Byte";

describe("Test instantiation of a byte", () => {

    test("Test instantiation of byte with formInteger method", () => {
        expect(Byte.fromInteger(-8).toString()).toEqual("11111000");
    });

    test("Expect error during instantiation of byte using formInteger method and an integer value to big to be displayable with a single byte", () => {
         const attemptToConvert = () => {
            Byte.fromInteger(-129).toString()
        } 
        expect(attemptToConvert).toThrow(Error);
    });
});