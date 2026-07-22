import { Byte } from "../types/binary/Byte";
import { describe, expect, test } from '@jest/globals';

describe("Test instantiation of a byte", () => {

    test("Test instantiation of byte with formNumber method", () => {
        expect(Byte.fromNumber(-8)).toEqual(0b11111000);
    });
});