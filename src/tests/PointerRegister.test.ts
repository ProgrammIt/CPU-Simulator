import { DoubleWord } from "../types/binary/DoubleWord";
import { PointerRegister } from "../simulator/functional_units/PointerRegister";
import { describe, expect, test } from '@jest/globals';

describe("Test register for addresses", () => {
    const ip: PointerRegister = new PointerRegister("EIP");

    test("Point address register to new address", () => {
        ip.content = DoubleWord.fromNumber(0);
        expect(ip.content).toEqual(DoubleWord.fromNumber(0));
    });
});