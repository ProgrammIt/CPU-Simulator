import { Byte } from "../types/binary/Byte";
import { Word } from "../types/binary/Word";

// --- constants ----------------------------------------------------------------

describe("Word constants", () => {
    test("SIZE is 2^16 = 65536", () => {
        expect(Word.SIZE).toBe(65536);
    });

    // BUG: MAX_POSITIVE_NUMBER is defined as 16 - 1 = 15 instead of 2**16 - 1 = 65535
    test("MAX_POSITIVE_NUMBER is 65535 (2^16 - 1)", () => {
        expect(Word.MAX_POSITIVE_NUMBER).toBe(65535);
    });

    test("MAX_NEGATIVE_NUMBER is -32768 (-(2^15))", () => {
        expect(Word.MAX_NEGATIVE_NUMBER).toBe(-32768);
    });

    test("NUMBER_OF_BITS is 16", () => {
        expect(Word.NUMBER_OF_BITS).toBe(16);
    });

    test("NUMBER_OF_BYTES is 2", () => {
        expect(Word.NUMBER_OF_BYTES).toBe(2);
    });
});

// --- fromNumber ---------------------------------------------------------------

describe("Word.fromNumber", () => {
    test("0 stays 0", () => {
        expect(Word.fromNumber(0)).toBe(0);
    });

    // BUG: Word.MAX_POSITIVE_NUMBER = 15, so fromNumber masks with & 15 instead of & 0xFFFF
    test("65535 (0xFFFF) stays 65535", () => {
        expect(Word.fromNumber(65535)).toBe(65535);
    });

    test("65536 (2^16) wraps to 0", () => {
        expect(Word.fromNumber(65536)).toBe(0);
    });

    test("65537 wraps to 1", () => {
        expect(Word.fromNumber(65537)).toBe(1);
    });

    test("-1 converts to 65535 (0xFFFF)", () => {
        expect(Word.fromNumber(-1)).toBe(65535);
    });

    test("256 (0x0100) is preserved correctly", () => {
        expect(Word.fromNumber(256)).toBe(256);
    });

    test("0xFF00 is preserved correctly", () => {
        expect(Word.fromNumber(0xFF00)).toBe(0xFF00);
    });

    test("-32768 (MIN signed 16-bit) converts to 32768 (0x8000)", () => {
        expect(Word.fromNumber(-32768)).toBe(0x8000);
    });
});

// --- fromBytes ----------------------------------------------------------------

describe("Word.fromBytes", () => {
    test("high=0x00, low=0x00 -> 0", () => {
        expect(Word.fromBytes(Byte.fromNumber(0x00), Byte.fromNumber(0x00))).toBe(0);
    });

    test("high=0xFF, low=0xFF -> 65535", () => {
        expect(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF))).toBe(65535);
    });

    test("high=0x01, low=0x00 -> 256", () => {
        expect(Word.fromBytes(Byte.fromNumber(0x01), Byte.fromNumber(0x00))).toBe(256);
    });

    test("high=0x00, low=0xFF -> 255", () => {
        expect(Word.fromBytes(Byte.fromNumber(0x00), Byte.fromNumber(0xFF))).toBe(255);
    });

    test("high=0xAB, low=0xCD -> 0xABCD", () => {
        expect(Word.fromBytes(Byte.fromNumber(0xAB), Byte.fromNumber(0xCD))).toBe(0xABCD);
    });
});

// --- getLeastSignificantBit ---------------------------------------------------

describe("Word.getLeastSignificantBit", () => {
    test("LSB of 0 is 0", () => {
        expect(Word.getLeastSignificantBit(Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0)))).toBe(0);
    });

    test("LSB of 1 is 1", () => {
        expect(Word.getLeastSignificantBit(Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(1)))).toBe(1);
    });

    test("LSB of 0xFF00 is 0", () => {
        expect(Word.getLeastSignificantBit(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0x00)))).toBe(0);
    });

    test("LSB of 0xFFFF is 1", () => {
        expect(Word.getLeastSignificantBit(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF)))).toBe(1);
    });
});

// --- getMostSignificantBit ----------------------------------------------------

describe("Word.getMostSignificantBit", () => {
    test("MSB of 0 is 0", () => {
        expect(Word.getMostSignificantBit(Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0)))).toBe(0);
    });

    test("MSB of 0x7FFF (32767) is 0", () => {
        expect(Word.getMostSignificantBit(Word.fromBytes(Byte.fromNumber(0x7F), Byte.fromNumber(0xFF)))).toBe(0);
    });

    test("MSB of 0x8000 (32768) is 1", () => {
        expect(Word.getMostSignificantBit(Word.fromBytes(Byte.fromNumber(0x80), Byte.fromNumber(0x00)))).toBe(1);
    });

    test("MSB of 0xFFFF is 1", () => {
        expect(Word.getMostSignificantBit(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF)))).toBe(1);
    });
});

// --- getLeastSignificantBits --------------------------------------------------

describe("Word.getLeastSignificantBits", () => {
    const word = Word.fromBytes(Byte.fromNumber(0xAB), Byte.fromNumber(0xCD)); // 0xABCD

    test("lowest 8 bits of 0xABCD is 0xCD", () => {
        expect(Word.getLeastSignificantBits(word, 8)).toBe(0xCD);
    });

    test("lowest 4 bits of 0xABCD is 0xD", () => {
        expect(Word.getLeastSignificantBits(word, 4)).toBe(0xD);
    });

    test("lowest 16 bits of 0xABCD is 0xABCD", () => {
        expect(Word.getLeastSignificantBits(word, 16)).toBe(0xABCD);
    });

    test("lowest 1 bit of 0xABCD (odd) is 1", () => {
        expect(Word.getLeastSignificantBits(word, 1)).toBe(1);
    });
});

// --- getMostSignificantBits ---------------------------------------------------

describe("Word.getMostSignificantBits", () => {
    const word = Word.fromBytes(Byte.fromNumber(0xAB), Byte.fromNumber(0xCD)); // 0xABCD

    test("top 8 bits of 0xABCD is 0xAB", () => {
        expect(Word.getMostSignificantBits(word, 8)).toBe(0xAB);
    });

    test("top 4 bits of 0xABCD is 0xA", () => {
        expect(Word.getMostSignificantBits(word, 4)).toBe(0xA);
    });

    test("top 16 bits of 0xABCD is 0xABCD", () => {
        expect(Word.getMostSignificantBits(word, 16)).toBe(0xABCD);
    });

    test("top 1 bit of 0x8000 is 1", () => {
        expect(Word.getMostSignificantBits(Word.fromBytes(Byte.fromNumber(0x80), Byte.fromNumber(0x00)), 1)).toBe(1);
    });
});

// --- getBit -------------------------------------------------------------------

describe("Word.getBit", () => {
    // index 0 = MSB, index 15 = LSB
    const word = Word.fromBytes(Byte.fromNumber(0b10110001), Byte.fromNumber(0b00101110));
    //  binary: 1011000100101110

    test("index 0 (MSB) is 1", () => {
        expect(Word.getBit(word, 0)).toBe(1);
    });

    test("index 15 (LSB) is 0", () => {
        expect(Word.getBit(word, 15)).toBe(0);
    });

    test("index 8 is correct", () => {
        // bit 8 from MSB is bit 7 of 0b00101110 = 0
        expect(Word.getBit(word, 8)).toBe(0);
    });

    test("all bits of 0xFFFF are 1", () => {
        const all_ones = Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF));
        for (let i = 0; i < 16; i++) {
            expect(Word.getBit(all_ones, i as Word.BitIndex)).toBe(1);
        }
    });

    test("all bits of 0x0000 are 0", () => {
        const zero = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0));
        for (let i = 0; i < 16; i++) {
            expect(Word.getBit(zero, i as Word.BitIndex)).toBe(0);
        }
    });
});

// --- setBit -------------------------------------------------------------------

describe("Word.setBit", () => {
    test("set MSB (index 0) to 1 on 0x0000 yields 0x8000", () => {
        expect(Word.setBit(Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0)), 0, 1)).toBe(0x8000);
    });

    test("set MSB (index 0) to 0 on 0xFFFF yields 0x7FFF", () => {
        expect(Word.setBit(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF)), 0, 0)).toBe(0x7FFF);
    });

    test("set LSB (index 15) to 1 on 0x0000 yields 1", () => {
        expect(Word.setBit(Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0)), 15, 1)).toBe(1);
    });

    test("set LSB (index 15) to 0 on 0xFFFF yields 0xFFFE", () => {
        expect(Word.setBit(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF)), 15, 0)).toBe(0xFFFE);
    });
});

// --- getUpperByte / getLowerByte ----------------------------------------------

describe("Word.getUpperByte / Word.getLowerByte", () => {
    const word = Word.fromBytes(Byte.fromNumber(0xAB), Byte.fromNumber(0xCD));

    test("upper byte of 0xABCD is 0xAB", () => {
        expect(Word.getUpperByte(word)).toBe(0xAB);
    });

    test("lower byte of 0xABCD is 0xCD", () => {
        expect(Word.getLowerByte(word)).toBe(0xCD);
    });

    test("upper byte of 0x0000 is 0x00", () => {
        expect(Word.getUpperByte(Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0)))).toBe(0);
    });

    test("lower byte of 0xFF00 is 0x00", () => {
        expect(Word.getLowerByte(Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0x00)))).toBe(0);
    });
});

// --- logicalRightShift --------------------------------------------------------

describe("Word.logicalRightShift", () => {
    test("0 shifts to 0, removed bit is 0", () => {
        const zero = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0));
        expect(Word.logicalRightShift(zero)).toEqual([0, 0]);
    });

    test("0x0002 shifts to 0x0001, removed bit is 0", () => {
        const word = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(2));
        expect(Word.logicalRightShift(word)).toEqual([1, 0]);
    });

    test("0x0001 shifts to 0, removed bit is 1", () => {
        const word = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(1));
        expect(Word.logicalRightShift(word)).toEqual([0, 1]);
    });

    test("0x8000 (MSB set) shifts to 0x4000: MSB is NOT extended (logical)", () => {
        const word = Word.fromBytes(Byte.fromNumber(0x80), Byte.fromNumber(0x00));
        const [result, removed] = Word.logicalRightShift(word);
        expect(result).toBe(0x4000);
        expect(removed).toBe(0);
    });

    test("0xFFFF shifts to 0x7FFF, removed bit is 1", () => {
        const word = Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF));
        expect(Word.logicalRightShift(word)).toEqual([0x7FFF, 1]);
    });
});

// --- arithmeticRightShift -----------------------------------------------------

describe("Word.arithmeticRightShift", () => {
    test("0 shifts to 0, removed bit is 0", () => {
        const zero = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0));
        expect(Word.arithmeticRightShift(zero)).toEqual([0, 0]);
    });

    test("positive 0x0002 shifts to 0x0001: sign bit stays 0", () => {
        const word = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(2));
        expect(Word.arithmeticRightShift(word)).toEqual([1, 0]);
    });

    // BUG: setBit result is discarded, so MSB is NOT preserved for negative values
    test("0x8000 arithmetic shift must extend sign bit to 0xC000", () => {
        const word = Word.fromBytes(Byte.fromNumber(0x80), Byte.fromNumber(0x00));
        const [result, removed] = Word.arithmeticRightShift(word);
        expect(result).toBe(0xC000);
        expect(removed).toBe(0);
    });

    test("0xFFFF arithmetic shift: result is 0xFFFF, removed bit is 1", () => {
        const word = Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF));
        const [result, removed] = Word.arithmeticRightShift(word);
        expect(result).toBe(0xFFFF);
        expect(removed).toBe(1);
    });

    test("0xFFFE arithmetic shift: result is 0xFFFF, removed bit is 0", () => {
        const word = Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFE));
        const [result, removed] = Word.arithmeticRightShift(word);
        expect(result).toBe(0xFFFF);
        expect(removed).toBe(0);
    });
});

// --- leftShift ----------------------------------------------------------------

describe("Word.leftShift", () => {
    test("0 shifts to 0, removed bit is 0", () => {
        const zero = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(0));
        expect(Word.leftShift(zero)).toEqual([0, 0]);
    });

    test("0x0001 shifts to 0x0002, removed bit is 0", () => {
        const word = Word.fromBytes(Byte.fromNumber(0), Byte.fromNumber(1));
        expect(Word.leftShift(word)).toEqual([2, 0]);
    });

    test("0x8000 shifts to 0x0000, removed bit is 1 (MSB shifts out)", () => {
        const word = Word.fromBytes(Byte.fromNumber(0x80), Byte.fromNumber(0x00));
        const [result, removed] = Word.leftShift(word);
        expect(result).toBe(0);
        expect(removed).toBe(1);
    });

    test("0xFFFF shifts to 0xFFFE, removed bit is 1", () => {
        const word = Word.fromBytes(Byte.fromNumber(0xFF), Byte.fromNumber(0xFF));
        expect(Word.leftShift(word)).toEqual([0xFFFE, 1]);
    });

    test("0x4000 shifts to 0x8000, removed bit is 0", () => {
        const word = Word.fromBytes(Byte.fromNumber(0x40), Byte.fromNumber(0x00));
        expect(Word.leftShift(word)).toEqual([0x8000, 0]);
    });
});

// --- getBitRange --------------------------------------------------------------

describe("Word.getBitRange", () => {
    const word = Word.fromBytes(Byte.fromNumber(0b11001010), Byte.fromNumber(0b00110101));
    // binary: 1100101000110101

    test("range [0,8) returns the top byte 0b11001010", () => {
        expect(Word.getBitRange(word, 0, 8)).toBe(0b11001010);
    });

    test("range [8,16) returns the bottom byte 0b00110101", () => {
        expect(Word.getBitRange(word, 8, 16)).toBe(0b00110101);
    });

    test("full range [0,16) returns the whole word", () => {
        expect(Word.getBitRange(word, 0, 16)).toBe(0b1100101000110101);
    });
});
