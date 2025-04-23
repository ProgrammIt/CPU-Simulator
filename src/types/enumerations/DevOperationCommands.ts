export enum DevCommands {
	IO_SEEK = "0000000",
	IO_CLOSE = "0000001",
	IO_READ_BUFFER = "0000010",
	IO_WRITE_BUFFER = "0000011",
	FILE_CREATE = "0000100",
	FILE_DELETE = "0000101",
	FILE_OPEN = "0000110",
	FILE_STAT = "0000111",
	CONSOLE_PRINT_NUMBER = "0001000",
	CONSOLE_READ_NUMBER = "0001001",
	PROCESS_CREATE = "0001010",
	PROCESS_EXIT = "0001011",
	PROCESS_YIELD = "0001100",
}

export function devCommandNameByValue(value: string): string {
	for (const [key, val] of Object.entries(DevCommands)) {
		if (val === value) {
			return key;
		}
	}
	return "UNKONWN";
}