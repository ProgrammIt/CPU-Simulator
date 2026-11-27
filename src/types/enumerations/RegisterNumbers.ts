/**
 * An enum representing all the registers and their binary codes.
 */
export enum RegisterNumbers {
	EAX =   0b00000000,
	EBX =   0b00000001,
	ECX =   0b00000010,
	EDX =   0b00000011,
	EIP =   0b00000100,
	EIR =   0b00000101,
	ESP =   0b00000110,
	ITP =   0b00000111,
	PTP =   0b00001000,
    FLAGS = 0b00001001,
	NPTP =  0b00001010,
	VMPTR = 0b00001011
}