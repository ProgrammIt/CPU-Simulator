import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, IpcMainInvokeEvent, Menu, shell } from "electron";
import path from 'path';
import { Simulator } from "./simulator/Simulator";
import { Doubleword } from "./types/Doubleword";
import { twosComplementToDecimal } from "./helper";
import { NumberSystem } from "./types";
import { PhysicalAddress } from "./types/PhysicalAddress";
import { Byte } from "./types/Byte";
import { VirtualAddress } from "./types/VirtualAddress";
import { Bit } from "./types/Bit";
import { MemoryManagementUnit } from "./simulator/execution_units/MemoryManagementUnit";

const createWindow = (win: BrowserWindow, simulator: Simulator) => {
	const menu = Menu.buildFromTemplate([
		{
			label: "App",
			submenu: [
				{
					label: "Exit",
					accelerator: "CmdOrCtrl+Q",
					click() {
						app.quit()
					} 
				}
			]
		},
		{
			label: "File",
			submenu: [
				{
					label: "Open Assembly Program",
					accelerator: "CmdOrCtrl+O",
					click() {
						dialog.showOpenDialog({
							properties: ["openFile", "createDirectory"],
							filters: [{ name: "Assembly Files", extensions: ['asm'] }]
						}).then(function(fileObj) {
							if (!fileObj.canceled) {
								simulator.bootProcess(fileObj.filePaths[0]);
								win.webContents.send("loaded_program", fileObj.filePaths);
							}
						}).catch((err) => win.webContents.send("on_error", err))
					}
				}
			],
		},
		{
			label: "Settings",
			submenu: [
				{
					label: "Behavior",
					submenu: [
						{
							label: "Physical RAM",
							submenu : [
								{
									label: "Disable Auto Scroll",
									click() {
										if (simulator.autoScrollForPhysicalRAMEnabled) {
											win.webContents.send("disable_auto_scroll_physical_ram");
										}
									}
								},
								{
									label: "Enable Auto Scroll",
									click() {
										if (!simulator.autoScrollForPhysicalRAMEnabled) {
											win.webContents.send("enable_auto_scroll_physical_ram");
										}
									}
								}
							]
						},
						{
							label: "Virtual RAM",
							submenu : [
								{
									label: "Disable Auto Scroll",
									click() {
										if (simulator.autoScrollForVirtualRAMEnabled) {
											win.webContents.send("disable_auto_scroll_virtual_ram");
										}
									}
								},
								{
									label: "Enable Auto Scroll",
									click() {
										if (!simulator.autoScrollForVirtualRAMEnabled) {
											win.webContents.send("enable_auto_scroll_virtual_ram");
										}
									}
								}
							]
						},
						{
							label: "Page Table",
							submenu : [
								{
									label: "Disable Auto Scroll",
									click() {
										if (simulator.autoScrollForPageTableEnabled) {
											win.webContents.send("disable_auto_scroll_page_table");
										}
									}
								},
								{
									label: "Enable Auto Scroll",
									click() {
										if (!simulator.autoScrollForPageTableEnabled) {
											win.webContents.send("enable_auto_scroll_page_table");
										}
									}
								}
							]
						}
					]
				}
			]
		},
		{
			label: "Window",
			submenu: [
				{
					label: "Minimize",
					accelerator: "CmdOrCtrl+M",
					click() {
						if (win.isMinimizable() && !win.isMinimized()) {
							win.minimize();
						}
					}
				},
				{
					label: "Reload",
					accelerator: "CmdOrCtrl+R",
					click() {
						win.webContents.reload()
					}
				},
				{
					label: "Force Reload",
					accelerator: "CmdOrCtrl+Shift+R",
					click() {
						win.webContents.reloadIgnoringCache()
					}
				},
				{
					label: "Toggle Developer Tools",
					accelerator: "CmdOrCtrl+Shift+I",
					click() {
						win.webContents.openDevTools();
					}
				}
			]
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Documentation",
					accelerator: "CmdOrCtrl+H",
					click() {
						shell.openExternal("https://programmit.github.io/CPU-Simulator/")
					}
				},
				{
					label: "GitHub Repository",
					click() {
						shell.openExternal("https://github.com/ProgrammIt/CPU-Simulator")
					}
				}
			]
		}
	])
	Menu.setApplicationMenu(menu);
  	win.loadFile("./src/index.html");
};

app.whenReady().then(() => {
	const win = new BrowserWindow({
		title: "Ihme Core X1 Simulator",
		width: 800,
		height: 600,
		webPreferences: {
      		preload: path.join(__dirname, 'preload.js')
    	},
		icon: "./assets/img/icons/icon.png"
  	});

	const simulator = Simulator.getInstance(Math.pow(2, 32));    
	
	createWindow(win, simulator);

	// Create listeners.
  	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
  	});

  	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow(win, simulator);
  	});

	ipcMain.handle("readRangeFromPhysicalMemory", async (event: Electron.IpcMainInvokeEvent, fromPhysicalAddressHexString: string, toPhysicalAddressHexString: string): Promise<Map<string, string>> => {
		const tmp: Map<string, string> = new Map<string, string>();
		const fromPhysicalAddressDec: number = parseInt(fromPhysicalAddressHexString, 16);
		const toPhysicalAddressDec: number = parseInt(toPhysicalAddressHexString, 16);
		for (let i = fromPhysicalAddressDec; i <= toPhysicalAddressDec; ++i) {
			const byte: Byte = simulator.mainMemory.readByteFrom(PhysicalAddress.fromInteger(i));
			tmp.set(`0x${(i).toString(16)}`, byte.toString());
		}
		return tmp;
	});

	ipcMain.handle("readFromPhysicalMemory", async (event: Electron.IpcMainInvokeEvent, physicalAddressHexString: string): Promise<string> => {
		const physicalAddressDec: number = parseInt(physicalAddressHexString, 16);
		const byte: Byte = simulator.mainMemory.readByteFrom(PhysicalAddress.fromInteger(physicalAddressDec));
		return byte.toString();
	});

	ipcMain.handle("readRangeFromVirtualMemory", async (event: Electron.IpcMainInvokeEvent, fromVirtualAddressHexString: string, toVirtualAddressHexString: string): Promise<Map<string, string>> => {
		const tmp: Map<string, string> = new Map<string, string>();
		const fromPhysicalAddressDec: number = parseInt(fromVirtualAddressHexString, 16);
		const toPhysicalAddressDec: number = parseInt(toVirtualAddressHexString, 16);
		for (let i = fromPhysicalAddressDec; i <= toPhysicalAddressDec; ++i) {
			const byte: Byte = simulator.core.mmu.readByteFrom(PhysicalAddress.fromInteger(i));
			tmp.set(`0x${(i).toString(16)}`, byte.toString());
		}
		return tmp;
	});

	ipcMain.handle("readFromVirtualMemory", async (event: Electron.IpcMainInvokeEvent, virtualAddressHexString: string): Promise<string> => {
		const virtualAddressDec: number = parseInt(virtualAddressHexString, 16);
		const byte: Byte = simulator.core.mmu.readByteFrom(PhysicalAddress.fromInteger(virtualAddressDec));
		return byte.toString();
	});

	ipcMain.handle("retrieveMainMemoryCells", async (): Promise<Map<string, string>> => {
		var tmp: Map<string, string> = new Map<string, string>();
		simulator.mainMemory.cells.forEach((byte, address) => {
			tmp.set(address, byte.toString());
		});
		return tmp;
	});

	ipcMain.handle("readPageTableEntries", async (event: Electron.IpcMainInvokeEvent, firstPageNumberToReadDec: number, lastPageNumberToReadDec: number): Promise<Map<string, string>> => {
		const tmp: Map<string, string> = new Map<string, string>();
		const fromPhysicalAddressDec: number = firstPageNumberToReadDec + parseInt(simulator.core.ptp.content.toString(), 2);
		const toPhysicalAddressDec: number = lastPageNumberToReadDec + parseInt(simulator.core.ptp.content.toString(), 2);
		var currentPageFrameNumber: number = firstPageNumberToReadDec;
		var currentPhysicalAddressDec: number = fromPhysicalAddressDec;
		while (currentPhysicalAddressDec <= toPhysicalAddressDec) {
			const pageTableEntry: Doubleword = simulator.mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(currentPhysicalAddressDec));
			var currentPageFrameNumberBinaryString: string = currentPageFrameNumber.toString(2)
				.padStart(20, "0")
				.padEnd(32, "0");
			tmp.set(currentPageFrameNumberBinaryString, pageTableEntry.toString());
			currentPhysicalAddressDec += 4;
			currentPageFrameNumber += 1;
		}
		return tmp;
	});

	ipcMain.handle("readEAX", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content: Doubleword = simulator.core.eax.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${twosComplementToDecimal(content).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${twosComplementToDecimal(content)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readEBX", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content: Doubleword = simulator.core.ebx.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${twosComplementToDecimal(content).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${twosComplementToDecimal(content)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readEDX", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content: Doubleword = simulator.core.edx.content;
		var result: string = twosComplementToDecimal(content).toString(basis);
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${twosComplementToDecimal(content).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${twosComplementToDecimal(content)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readEIP", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.eip.content;
		var result: string = parseInt(content.toString(), 2).toString(basis);
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readEFLAGS", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.eflags.content;
		return content.toString();
	});

	ipcMain.handle("readEIR", async (event: IpcMainInvokeEvent, asInstruction: boolean): Promise<string> => {
		if (asInstruction) {
			// TODO
		}
		const content = simulator.core.eir.content;
		return content.toString(true);
	});

	ipcMain.handle("readNPTP", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.nptp.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readVMPTR", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.vmtpr.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readESP", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.esp.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readITP", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.itp.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readGPTP", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		if (simulator.core.gptp === null) {
			return "-";
		}
		const content = simulator.core.gptp.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("readPTP", async (event: IpcMainInvokeEvent, basis: NumberSystem): Promise<string> => {
		const content = simulator.core.ptp.content;
		var result: string;
		if (basis === NumberSystem.HEX) {
			result = `0x${parseInt(content.toString(), 2).toString(16)}`;
		} else if (basis === NumberSystem.DEC) {
			result = `${parseInt(content.toString(), 2)}`;
		} else {
			result = content.toString(true);
		}
		return result;
	});

	ipcMain.handle("nextCycle", async (): Promise<boolean> => {
		var resultOfCycle: boolean = false;
		try {
			resultOfCycle = simulator.cycle();
		} catch (error) {
			if (error instanceof Error) {
				win.webContents.send("error", error.message);
			}
		}
		return resultOfCycle;
	});

	ipcMain.handle("on_disable_auto_scroll_physical_ram", async (): Promise<void> => {
		simulator.autoScrollForPhysicalRAMEnabled = false;
		return;
	});

	ipcMain.handle("on_ensable_auto_scroll_physical_ram", async (): Promise<void> => {
		simulator.autoScrollForPhysicalRAMEnabled = true;
		return;
	});

	ipcMain.handle("on_disable_auto_scroll_virtual_ram", async (): Promise<void> => {
		simulator.autoScrollForVirtualRAMEnabled = false;
		return;
	});

	ipcMain.handle("on_ensable_auto_scroll_virtual_ram", async (): Promise<void> => {
		simulator.autoScrollForVirtualRAMEnabled = true;
		return;
	});

	ipcMain.handle("on_disable_auto_scroll_page_table", async (): Promise<void> => {
		simulator.autoScrollForPageTableEnabled = false;
		return;
	});

	ipcMain.handle("on_enable_auto_scroll_page_table", async (): Promise<void> => {
		simulator.autoScrollForPageTableEnabled = true;
		return;
	});
});
