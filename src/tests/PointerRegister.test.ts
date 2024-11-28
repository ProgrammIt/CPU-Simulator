import { PointerRegister } from "../simulator/functional_units/PointerRegister";
import { Doubleword } from "../types/Doubleword";
import { VirtualAddress } from "../types/VirtualAddress";

describe("Test register for addresses", () => {
    const ip: PointerRegister = new PointerRegister("EIP");

    test("Point address register to new address", () => {
        ip.content = VirtualAddress.fromInteger(0);
        expect(ip.content.toString()).toEqual(VirtualAddress.fromInteger(0).toString());
    });
});