import { PointerRegister } from "../main/simulator/functional_units/PointerRegister";
import { VirtualAddress } from "../types/binary/VirtualAddress";

describe("Test register for addresses", () => {
    const ip: PointerRegister = new PointerRegister("EIP");

    test("Point address register to new address", () => {
        ip.content = VirtualAddress.fromInteger(0);
        expect(ip.content.toString()).toEqual(VirtualAddress.fromInteger(0).toString());
    });
});