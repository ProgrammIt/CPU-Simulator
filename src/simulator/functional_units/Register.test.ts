import { DOUBLEWORD } from "../../constants";
import { Register } from "./Register";

describe("Read and write from or to main memory", () => {
    
    const eax: Register = new Register("EAX", DOUBLEWORD);
    test("Write doubleword to register", () => {        
        eax.value = "11111111111111111111111111111111"
        expect(eax.value).toBe("11111111111111111111111111111111");
    });

    test("Get name of register", () => {
        expect(eax.name).toBe("EAX");
    });
});