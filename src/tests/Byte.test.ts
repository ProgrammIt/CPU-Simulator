import { Byte } from "../types/binary/Byte";
import { describe, expect, test } from '@jest/globals';

// --- fromNumber ---------------------------------------------------------------

describe("Byte.fromNumber", () => {
    test("zero stays zero", () => {
        expect(Byte.fromNumber(0)).toBe(0);
    });

    test("positive value within range is unchanged", () => {
        expect(Byte.fromNumber(255)).toBe(255);
    });

    test("256 wraps to 0 (overflow)", () => {
        expect(Byte.fromNumber(256)).toBe(0);
    });

    test("257 wraps to 1", () => {
        expect(Byte.fromNumber(257)).toBe(1);
    });

    test("-1 wraps to 255 (0xFF)", () => {
        expect(Byte.fromNumber(-1)).toBe(255);
    });

    test("-8 converts to two's-complement byte 0b11111000", () => {
        expect(Byte.fromNumber(-8)).toBe(0b11111000);
    });

    test("-128 converts to 0b10000000", () => {
        expect(Byte.fromNumber(-128)).toBe(0b10000000);
    });

    test("-256 wraps to 0", () => {
        expect(Byte.fromNumber(-256)).toBe(0);
    });

    test("large positive value is masked to 8 bits", () => {
        expect(Byte.fromNumber(0x1FF)).toBe(0xFF);
    });
});

// --- getLeastSignificantBit ---------------------------------------------------

describe("Byte.getLeastSignificantBit", () => {
    test("LSB of 0 is 0", () => {
        expect(Byte.getLeastSignificantBit(Byte.fromNumber(0))).toBe(0);
    });

    test("LSB of 1 is 1", () => {
        expect(Byte.getLeastSignificantBit(Byte.fromNumber(1))).toBe(1);
    });

    test("LSB of 0b10101010 is 0", () => {
        expect(Byte.getLeastSignificantBit(Byte.fromNumber(0b10101010))).toBe(0);
    });

    test("LSB of 0b11111111 is 1", () => {
        expect(Byte.getLeastSignificantBit(Byte.fromNumber(0xFF))).toBe(1);
    });

    test("LSB of 0b10000000 (128) is 0", () => {
        expect(Byte.getLeastSignificantBit(Byte.fromNumber(128))).toBe(0);
    });
});

// --- getMostSignificantBit ----------------------------------------------------

describe("Byte.getMostSignificantBit", () => {
    test("MSB of 0 is 0", () => {
        expect(Byte.getMostSignificantBit(Byte.fromNumber(0))).toBe(0);
    });

    test("MSB of 127 (0b01111111) is 0", () => {
        expect(Byte.getMostSignificantBit(Byte.fromNumber(127))).toBe(0);
    });

    test("MSB of 128 (0b10000000) is 1", () => {
        expect(Byte.getMostSignificantBit(Byte.fromNumber(128))).toBe(1);
    });

    test("MSB of 255 (0b11111111) is 1", () => {
        expect(Byte.getMostSignificantBit(Byte.fromNumber(255))).toBe(1);
    });
});

// --- getLeastSignificantBits --------------------------------------------------

describe("Byte.getLeastSignificantBits", () => {
    test("lowest 1 bit of 0b10101011 is 1", () => {
        expect(Byte.getLeastSignificantBits(Byte.fromNumber(0b10101011), 1)).toBe(0b1);
    });

    test("lowest 4 bits of 0b11001010 is 0b1010", () => {
        expect(Byte.getLeastSignificantBits(Byte.fromNumber(0b11001010), 4)).toBe(0b1010);
    });

    test("lowest 8 bits of 0xFF is 0xFF", () => {
        expect(Byte.getLeastSignificantBits(Byte.fromNumber(0xFF), 8)).toBe(0xFF);
    });

    test("lowest 8 bits of 0 is 0", () => {
        expect(Byte.getLeastSignificantBits(Byte.fromNumber(0), 8)).toBe(0);
    });
});

// --- getMostSignificantBits ---------------------------------------------------

describe("Byte.getMostSignificantBits", () => {
    test("top 1 bit of 0b10000000 is 1", () => {
        expect(Byte.getMostSignificantBits(Byte.fromNumber(0b10000000), 1)).toBe(1);
    });

    test("top 1 bit of 0b01111111 is 0", () => {
        expect(Byte.getMostSignificantBits(Byte.fromNumber(0b01111111), 1)).toBe(0);
    });

    test("top 4 bits of 0b11001010 is 0b1100", () => {
        expect(Byte.getMostSignificantBits(Byte.fromNumber(0b11001010), 4)).toBe(0b1100);
    });

    test("top 8 bits of 0xFF is 0xFF", () => {
        expect(Byte.getMostSignificantBits(Byte.fromNumber(0xFF), 8)).toBe(0xFF);
    });
});

// --- getBit -------------------------------------------------------------------

describe("Byte.getBit", () => {
    // index 0 = MSB, index 7 = LSB
    test("index 0 (MSB) of 0b10000000 is 1", () => {
        expect(Byte.getBit(Byte.fromNumber(0b10000000), 0)).toBe(1);
    });

    test("index 0 (MSB) of 0b01111111 is 0", () => {
        expect(Byte.getBit(Byte.fromNumber(0b01111111), 0)).toBe(0);
    });

    test("index 7 (LSB) of 0b00000001 is 1", () => {
        expect(Byte.getBit(Byte.fromNumber(0b00000001), 7)).toBe(1);
    });

    test("index 7 (LSB) of 0b11111110 is 0", () => {
        expect(Byte.getBit(Byte.fromNumber(0b11111110), 7)).toBe(0);
    });

    test("index 4 of 0b00001000 is 1", () => {
        expect(Byte.getBit(Byte.fromNumber(0b00001000), 4)).toBe(1);
    });

    test("all bits of 0b10110101 are correct", () => {
        const byte = Byte.fromNumber(0b10110101);
        expect(Byte.getBit(byte, 0)).toBe(1);
        expect(Byte.getBit(byte, 1)).toBe(0);
        expect(Byte.getBit(byte, 2)).toBe(1);
        expect(Byte.getBit(byte, 3)).toBe(1);
        expect(Byte.getBit(byte, 4)).toBe(0);
        expect(Byte.getBit(byte, 5)).toBe(1);
        expect(Byte.getBit(byte, 6)).toBe(0);
        expect(Byte.getBit(byte, 7)).toBe(1);
    });
});

// --- getBitRange --------------------------------------------------------------

describe("Byte.getBitRange", () => {
    // index 0 = MSB; range [start, end) excludes bit at 'end'
    test("range [0,4) of 0b11001010 returns top nibble 0b1100", () => {
        expect(Byte.getBitRange(Byte.fromNumber(0b11001010), 0, 4)).toBe(0b1100);
    });

    test("range [4,8) of 0b11001010 returns bottom nibble 0b1010", () => {
        expect(Byte.getBitRange(Byte.fromNumber(0b11001010), 4, 8)).toBe(0b1010);
    });

    test("full range [0,8) returns all 8 bits", () => {
        expect(Byte.getBitRange(Byte.fromNumber(0b10110011), 0, 8)).toBe(0b10110011);
    });

    test("single-bit range [3,4) of 0b00010000 returns 1", () => {
        expect(Byte.getBitRange(Byte.fromNumber(0b00010000), 3, 4)).toBe(1);
    });
});

// --- getBitsStartingAt --------------------------------------------------------

describe("Byte.getBitsStartingAt", () => {
    test("1 bit starting at index 0 of 0b10000000 is 1", () => {
        expect(Byte.getBitsStartingAt(Byte.fromNumber(0b10000000), 0, 1)).toBe(1);
    });

    test("4 bits starting at index 0 of 0b11000000 is 0b1100", () => {
        expect(Byte.getBitsStartingAt(Byte.fromNumber(0b11000000), 0, 4)).toBe(0b1100);
    });

    test("4 bits starting at index 4 of 0b00001010 is 0b1010", () => {
        expect(Byte.getBitsStartingAt(Byte.fromNumber(0b00001010), 4, 4)).toBe(0b1010);
    });

    test("default count of 1 returns single bit", () => {
        expect(Byte.getBitsStartingAt(Byte.fromNumber(0b01000000), 1)).toBe(1);
    });
});

// --- setBit -------------------------------------------------------------------

describe("Byte.setBit", () => {
    test("set MSB (index 0) to 1 on 0x00", () => {
        expect(Byte.setBit(Byte.fromNumber(0), 0, 1)).toBe(0b10000000);
    });

    test("set MSB (index 0) to 0 on 0xFF", () => {
        expect(Byte.setBit(Byte.fromNumber(0xFF), 0, 0)).toBe(0b01111111);
    });

    test("set LSB (index 7) to 1 on 0x00", () => {
        expect(Byte.setBit(Byte.fromNumber(0), 7, 1)).toBe(1);
    });

    test("set LSB (index 7) to 0 on 0xFF", () => {
        expect(Byte.setBit(Byte.fromNumber(0xFF), 7, 0)).toBe(0b11111110);
    });

    test("set index 3 to 1 on 0x00", () => {
        expect(Byte.setBit(Byte.fromNumber(0), 3, 1)).toBe(0b00010000);
    });

    test("setting a bit that is already set leaves value unchanged", () => {
        expect(Byte.setBit(Byte.fromNumber(0xFF), 4, 1)).toBe(0xFF);
    });

    test("clearing a bit that is already 0 leaves value unchanged", () => {
        expect(Byte.setBit(Byte.fromNumber(0), 4, 0)).toBe(0);
    });
});

// --- logicalRightShift --------------------------------------------------------

describe("Byte.logicalRightShift", () => {
    test("0 shifts to 0, removed bit is 0", () => {
        expect(Byte.logicalRightShift(Byte.fromNumber(0))).toEqual([0, 0]);
    });

    test("0b00000010 shifts to 0b00000001, removed bit is 0", () => {
        expect(Byte.logicalRightShift(Byte.fromNumber(0b00000010))).toEqual([0b00000001, 0]);
    });

    test("0b00000001 shifts to 0, removed bit is 1", () => {
        expect(Byte.logicalRightShift(Byte.fromNumber(0b00000001))).toEqual([0, 1]);
    });

    test("0b10000000 (128) shifts to 0b01000000: MSB is NOT extended (logical)", () => {
        expect(Byte.logicalRightShift(Byte.fromNumber(0b10000000))).toEqual([0b01000000, 0]);
    });

    test("0b11111111 shifts to 0b01111111, removed bit is 1", () => {
        expect(Byte.logicalRightShift(Byte.fromNumber(0b11111111))).toEqual([0b01111111, 1]);
    });
});

// --- arithmeticRightShift -----------------------------------------------------

describe("Byte.arithmeticRightShift", () => {
    test("0 shifts to 0, removed bit is 0", () => {
        expect(Byte.arithmeticRightShift(Byte.fromNumber(0))).toEqual([0, 0]);
    });

    test("0b00000010 (positive) shifts to 0b00000001: sign bit stays 0", () => {
        expect(Byte.arithmeticRightShift(Byte.fromNumber(0b00000010))).toEqual([0b00000001, 0]);
    });

    // BUG: setBit result is discarded, so MSB is NOT preserved on negative values
    test("0b10000000 (-128) arithmetic shift must extend the sign bit to 0b11000000", () => {
        const [result, removed] = Byte.arithmeticRightShift(Byte.fromNumber(0b10000000));
        expect(result).toBe(0b11000000);
        expect(removed).toBe(0);
    });

    test("0b10001110 arithmetic shift must extend the sign bit to 0b11000111", () => {
        const [result, removed] = Byte.arithmeticRightShift(Byte.fromNumber(0b10001110));
        expect(result).toBe(0b11000111);
        expect(removed).toBe(0);
    });

    test("0b11111111 arithmetic shift: result is 0b11111111, removed bit is 1", () => {
        const [result, removed] = Byte.arithmeticRightShift(Byte.fromNumber(0b11111111));
        expect(result).toBe(0b11111111);
        expect(removed).toBe(1);
    });

    test("0b00000001 (positive, LSB=1) shifts to 0, removed bit is 1", () => {
        const [result, removed] = Byte.arithmeticRightShift(Byte.fromNumber(0b00000001));
        expect(result).toBe(0);
        expect(removed).toBe(1);
    });
});

// --- leftShift ----------------------------------------------------------------

describe("Byte.leftShift", () => {
    test("0 shifts to 0, removed bit is 0", () => {
        expect(Byte.leftShift(Byte.fromNumber(0))).toEqual([0, 0]);
    });

    test("0b00000001 shifts to 0b00000010, removed bit is 0", () => {
        expect(Byte.leftShift(Byte.fromNumber(0b00000001))).toEqual([0b00000010, 0]);
    });

    test("0b10000000 shifts to 0, removed bit is 1 (MSB shifts out)", () => {
        expect(Byte.leftShift(Byte.fromNumber(0b10000000))).toEqual([0, 1]);
    });

    test("0b11111111 shifts to 0b11111110, removed bit is 1", () => {
        expect(Byte.leftShift(Byte.fromNumber(0b11111111))).toEqual([0b11111110, 1]);
    });

    test("0b01000000 shifts to 0b10000000, removed bit is 0", () => {
        expect(Byte.leftShift(Byte.fromNumber(0b01000000))).toEqual([0b10000000, 0]);
    });
});