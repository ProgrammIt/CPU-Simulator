import { app, BrowserWindow, ipcMain } from "electron/main";
import { MainMemory } from "./simulator/MainMemory";
import path from 'path';
import { Assembler } from "./simulator/Assembler";
import { readFileSync } from "original-fs";

const WORD_WIDTH = 32;

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
	const mainMemory = MainMemory.instance(Math.pow(2, WORD_WIDTH));
	const assembler = Assembler.instance;
	assembler.loadLanguageDefinition(readFileSync("./src/settings/language_definition.json", "utf-8"));
	const assemblyProgram: string = readFileSync("./src/assets/programs/examples/loop.asm", "utf8");
	const compiledProgram: string[] = assembler.compile(assemblyProgram);
	const startAddressProgrammDec: number = 0;
	var currentAddressDec: number = startAddressProgrammDec;
	for (const quadword of compiledProgram) {
		mainMemory.writeQuadwordTo((currentAddressDec).toString(2), quadword);
		currentAddressDec += 4;
	}
	var physicalAddress: string = "";
    physicalAddress = parseInt("0x1000000", 16).toString(2);
    mainMemory.writeQuadwordTo(physicalAddress, "11011001001011101010000101100000");
	
	createWindow();

	// Create listeners.
  	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
  	});

  	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
  	});

	ipcMain.handle("retrieveMainMemoryCells", async () => {
		return mainMemory.cells;
	});
});
