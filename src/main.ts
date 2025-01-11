import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, Menu } from "electron";
import path from 'path';
import { Simulator } from "./simulator/Simulator";
import { Doubleword } from "./types/Doubleword";
import { twosComplementToDecimal } from "./helper";
import { NumberSystem } from "./types";
import { PhysicalAddress } from "./types/PhysicalAddress";
import { Byte } from "./types/Byte";
import { readFileSync } from "original-fs";

const createWindow = (simulator: Simulator) => {
  	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
      		preload: path.join(__dirname, 'preload.js')
    	}
  	});

	// setting up the menu with just two items 
	const menu = Menu.buildFromTemplate([
		{
		label: 'Menu',
		submenu: [
			{
				label:'Open Assembly Program',
				accelerator: 'CmdOrCtrl+O',
				// this is the main bit hijack the click event 
				click() {
					// construct the select file dialog 
					dialog.showOpenDialog({
						properties: ["openFile", "createDirectory"],
						filters: [{ name: "Assembly Files", extensions: ['asm'] }]
					}).then(function(fileObj) {
						if (!fileObj.canceled) {
							win.webContents.send("open_program", fileObj.filePaths);
							// TODO: Load assembly program into simulator!
							// simulator.loadProgram(fileObj.filePaths);
						}
					}).catch((err) => win.webContents.send("error_open_program", err))
				}
			},
			{
				label:'Exit',
				accelerator: 'CmdOrCtrl+Q',
				click() {
					app.quit()
				} 
			}
		]
		}
	])
	Menu.setApplicationMenu(menu);

  	win.loadFile("./src/index.html");
};

app.whenReady().then(() => {
	const simulator = Simulator.getInstance(Math.pow(2, 32));
	// simulator.loadProgramm(readFileSync("./assets/programs/examples/for_loop.asm", "utf8"));    
	
	createWindow(simulator);

	// Create listeners.
  	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
  	});

  	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow(simulator);
  	});

	ipcMain.handle("readRangeFromMainMemory", async (event: Electron.IpcMainInvokeEvent, fromPhysicalAddressHexString: string, toPhysicalAddressHexString: string): Promise<Map<string, string>> => {
		const tmp: Map<string, string> = new Map<string, string>();
		const from: number = parseInt(fromPhysicalAddressHexString, 16);
		const to: number = parseInt(toPhysicalAddressHexString, 16);
		for (let i = from; i <= to; ++i) {
			const byte: Byte = simulator.mainMemory.readByteFrom(PhysicalAddress.fromInteger(i));
			tmp.set(`0x${(i).toString(16)}`, byte.toString());
		}
		return tmp;
	});

	ipcMain.handle("readFromMainMemory", async (event: Electron.IpcMainInvokeEvent, physicalAddressHexString: string): Promise<string> => {
		const physicalAddressDec: number = parseInt(physicalAddressHexString, 16);
		const byte: Byte = simulator.mainMemory.readByteFrom(PhysicalAddress.fromInteger(physicalAddressDec));
		return byte.toString();
	});

	ipcMain.handle("retrieveMainMemoryCells", async (): Promise<Map<string, string>> => {
		var tmp: Map<string, string> = new Map<string, string>();
		simulator.mainMemory.cells.forEach((byte, address) => {
			tmp.set(address, byte.toString());
		});
		return tmp;
	});

	ipcMain.handle("readEAX", async (event, basis): Promise<string> => {
		const content: Doubleword = simulator.core.eax.content;
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
		const content: Doubleword = simulator.core.ebx.content;
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
		const content = simulator.core.eip.content;
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
		const content = simulator.core.eflags.content;
		return content.toString();
	});

	ipcMain.handle("readEIR", async (event): Promise<string> => {
		const content = simulator.core.eir.content;
		return content.toString();
	});

	ipcMain.handle("readNPTP", async (event, basis): Promise<string> => {
		const content = simulator.core.nptp.content;
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
		const content = simulator.core.vmtpr.content;
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
		const content = simulator.core.esp.content;
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
		const content = simulator.core.itp.content;
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
		if (simulator.core.gptp === null) {
			return " ";
		}
		const content = simulator.core.gptp.content;
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
		const content = simulator.core.ptp.content;
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
		var resultOfCycle: boolean = false;
		try {
			resultOfCycle = simulator.cycle();
		} catch (error) {
			// 
		}
		return resultOfCycle;
	});
});
