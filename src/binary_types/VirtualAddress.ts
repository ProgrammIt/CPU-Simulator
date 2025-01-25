import Address from "./Address";
import Bit from "./Bit";

/**
 * This class represents a virtual memory address.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class VirtualAddress extends Address {
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
		super(value);
	}
}