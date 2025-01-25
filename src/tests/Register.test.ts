import { GeneralPurposeRegister } from "../simulator/functional_units/GeneralPurposeRegister";
import { Bit } from "../binary_types/Bit";
import { DoubleWord } from "../binary_types/DoubleWord";

describe("Read and write from or to main memory", () => {
    const eax: GeneralPurposeRegister = new GeneralPurposeRegister("EAX");
    test("Write doubleword to register", () => {        
        eax.content = new DoubleWord(new Array<Bit>(32).fill(1));  
        expect(eax.content.toString()).toBe("11111111111111111111111111111111");
    });

    test("Get name of register", () => {
        expect(eax.name).toBe("EAX");
    });
});