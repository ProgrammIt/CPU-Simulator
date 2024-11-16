import { DoublewordRegister, Register } from "../simulator/functional_units/Register";
import { Bit } from "../types";

describe("Read and write from or to main memory", () => {
    const eax: DoublewordRegister = new DoublewordRegister("EAX");
    test("Write doubleword to register", () => {        
        eax.content.value = new Array<Bit>(32).fill(new Bit(1));  
        expect(eax.content.value.join("")).toBe("11111111111111111111111111111111");
    });

    test("Get name of register", () => {
        expect(eax.name).toBe("EAX");
    });
});