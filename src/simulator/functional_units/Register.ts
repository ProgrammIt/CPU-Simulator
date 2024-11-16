import { Byte, Doubleword } from "../../types";

export class Register {
    /**
     * The name of the register.
     * @readonly
     */
    public readonly name: string;

    /**
     * This method constructs an instance of the Register class.
     * @param name The name of the register.
     */
    public constructor(name: string) {
        this.name = name.toUpperCase();
    }
}

export class ByteRegister extends Register {
    /**
     * The registers content.
     */
    public content: Byte;

    /**
     * This method constructs an instance.
     * @param name The name of the register.
     */
    public constructor(name: string) {
        super(name.toUpperCase());
        this.content = new Byte();
    }
}

export class DoublewordRegister extends Register {
    /**
     * The registers content.
     */
    public content: Doubleword;

    /**
     * This method constructs an instance.
     * @param name The name of the register.
     */
    public constructor(name: string) {
        super(name.toUpperCase());
        this.content = new Doubleword();
    }
}