import { app, BrowserWindow, ipcMain } from "electron";
import { RAM } from "./simulator/functional_units/RAM";
import path from 'path';
import { Assembler } from "./simulator/Assembler";
import { readFileSync } from "fs";
import { MemoryManagementUnit } from "./simulator/execution_units/MemoryManagementUnit";
import { Doubleword, VirtualAddress } from "./types";

const createWindow = () => {
  	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
      		preload: path.join(__dirname, 'preload.js')
    	}
  	});

  	win.loadFile("./src/index.html");
};

app.whenReady().then(() => {
	const mainMemory = RAM.instance;
	const mmu = MemoryManagementUnit.instance(mainMemory);
	const assembler = Assembler.instance;
	assembler.loadLanguageDefinition(readFileSync("./src/settings/language_definition.json", "utf-8"));
	const assemblyProgram: string = readFileSync("./src/assets/programs/examples/loop.asm", "utf8");
	const compiledProgram: Doubleword[] = assembler.compile(assemblyProgram);
	
	const startAddressProgrammDec: number = 0;
	var currentAddressDec: number = startAddressProgrammDec;
	for (const doubleword of compiledProgram) {
		mmu.writeDoublewordTo(VirtualAddress.fromInteger(currentAddressDec), doubleword);
		currentAddressDec += 4;
	}
	
	createWindow();

	// Create listeners.
  	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
  	});

  	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
  	});

	ipcMain.handle("retrieveMainMemoryCells", async () => {
		var tmp: Map<string, string> = new Map<string, string>();
		mainMemory.cells.forEach((byte, address) => {
			tmp.set(address, byte.toString());
		});
		return tmp;
	});
});
