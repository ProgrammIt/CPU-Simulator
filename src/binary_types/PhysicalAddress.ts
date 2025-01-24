import { Address } from "./Address";
import { Bit } from "./Bit";

/**
 * This class represents a physical memory address.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class PhysicalAddress extends Address {
	/**
	 * Constructs a new instance.
	 */
	public constructor(
		value: Array<Bit> = new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		)
	) {
		super(value.slice());
	}
}