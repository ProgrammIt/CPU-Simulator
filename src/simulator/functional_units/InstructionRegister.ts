import { Instruction } from "../../types/Instruction";
import { Register } from "./Register";

/**
 * This class represents the instruction register (EIR).
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InstructionRegister extends Register<Instruction> {
    /**
     * Constructs a new instance.
     */
    public constructor() {
        super("EIR", new Instruction());
    }    
}