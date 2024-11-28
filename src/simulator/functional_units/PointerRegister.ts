import { Address } from "../../types/Address";
import { Register } from "./Register";

/**
 * This class represents a special tpye of register,
 * which can hold a single address.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class PointerRegister extends Register<Address> {
    public constructor(name: string) {
        super(name, new Address());
    }
}