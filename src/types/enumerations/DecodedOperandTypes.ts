import { EncodedOperandTypes } from "./EncodedOperandTypes"

export type DecodedOperandTypes =
	EncodedOperandTypes.NO |
	EncodedOperandTypes.IMMEDIATE |
	EncodedOperandTypes.REGISTER_DIRECT |
	EncodedOperandTypes.REGISTER_INDIRECT |
	EncodedOperandTypes.MEMORY_ADDRESS;