import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import path from 'path';
import { readFileSync } from "fs";
import { Simulator } from "./simulator/Simulator";
import { Doubleword } from "./types/Doubleword";
import { twosComplementToDecimal } from "./helper";
import { NumberSystem } from "./types";

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
	const simulator = Simulator.getInstance(Math.pow(2, 32));
	simulator.loadProgramm(readFileSync("./src/assets/programs/examples/array.asm", "utf8"));
	
	createWindow();

	// Create listeners.
  	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
  	});

  	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
  	});

	ipcMain.handle("retrieveMainMemoryCells", async (): Promise<Map<string, string>> => {
		var tmp: Map<string, string> = new Map<string, string>();
		simulator.mainMemory.cells.forEach((byte, address) => {
			tmp.set(address, byte.toString());
		});
		return tmp;
	});

	ipcMain.handle("readEAX", async (event, basis): Promise<string> => {
		const content: Doubleword = simulator.cpuCore.eax.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readEBX", async (event, basis): Promise<string> => {
		const content: Doubleword = simulator.cpuCore.ebx.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readEIP", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.eip.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readEFLAGS", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.eflags.content;
		return content.toString();
	});

	ipcMain.handle("readEIR", async (event): Promise<string> => {
		const content = simulator.cpuCore.eir.content;
		return content.toString();
	});

	ipcMain.handle("readNPTP", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.nptp.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readVMPTR", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.vmtpr.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readESP", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.esp.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readITP", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.itp.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readGPTP", async (event, basis): Promise<string> => {
		if (simulator.cpuCore.gptp === null) {
			return " ";
		}
		const content = simulator.cpuCore.gptp.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("readPTP", async (event, basis): Promise<string> => {
		const content = simulator.cpuCore.ptp.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		if (basis === NumberSystem.HEX) {
			result = `0x${result}`;
		} 
		if (basis === NumberSystem.BIN) {
			result = `0b${result}`;
		}
		return result;
	});

	ipcMain.handle("nextCycle", async (): Promise<boolean> => {
		return simulator.cycle();
	});
});
