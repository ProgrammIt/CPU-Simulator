export const BYTE: number = 8;
export const WORD: number = 16;
export const DOUBLEWORD: number = 32;
export const QUADWORD: number = 64;
export const BINARY_DATA_REGEX: RegExp = /^(?:0b)?[01]*$/gmi;
export const HEX_DATA_REGEX: RegExp = /^0x[1-9ABCDEF][0-9ABCDEF]*$/gmi;