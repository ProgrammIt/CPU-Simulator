import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import { SimulationController } from './simulator/SimulationController';
import { DoubleWord } from './types/binary/DoubleWord';
import { ApplicationWindow } from './ApplicationWindow';
import path from 'path';
import { Byte } from './types/binary/Byte';
import { PageNumber } from './types/binary/PageNumber';
import { PageTableEntry } from './types/binary/PageTableEntry';
import { NumberSystems } from './types/enumerations/NumberSystems';
import { RegisterNames } from './types/enumerations/RegisterNumbers';

export let applicationWindow: ApplicationWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
	app.quit();
}

if (process.env.NODE_ENV !== "test") {
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.whenReady().then(() => {
		app.setAppUserModelId("de.hs-hannover.IhmeCoreX1Simulator.IhmeCoreX1Simulator");
		applicationWindow = new ApplicationWindow(1280, 720, "IhmeCoreX1 Simulator");
		let pathToLanguageDefinition: string;
		let pathToOSFilesystem: string;
		if (app.isPackaged) {
			pathToLanguageDefinition = `${process.resourcesPath}/settings/language_definition.json`;

			const resourcePath = `${process.resourcesPath}/os_filesystem`;
			const userPath = `${app.getPath("userData")}/os_filesystem`;

			// copy once on first run
			if (!fs.existsSync(userPath)) {
				fs.cpSync(resourcePath, userPath, { recursive: true });
			}

			pathToOSFilesystem = userPath;
		} else {
			pathToLanguageDefinition = process.cwd() + "/settings/language_definition.json";
			pathToOSFilesystem = process.cwd() + "/os_filesystem";
		}

		registerFileOperationHandlers();

		SimulationController.getInstanceOrCreate(
			DoubleWord.SIZE,
			pathToLanguageDefinition,
			pathToOSFilesystem,
			!app.isPackaged
		).then(simulator => {
			registerSimulatorHandlers(simulator);
			applicationWindow.createMenu(applicationWindow.mainWindow!, simulator);
		}).catch(error => {
			console.error("Failed to initialize the simulator:", error);
		});
	});

	// Quit when all windows are closed, except on macOS. There, it's common
	// for applications and their menu bar to stay active until the user quits
	// explicitly with Cmd + Q.
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			applicationWindow = new ApplicationWindow(1280, 720, "IhmeCoreX1 Simulator");
		}
	});
}

/**
 * Registers IPC handlers for file operations such as opening and saving assembler files.
 */
function registerFileOperationHandlers() {
	ipcMain.removeHandler('dialog:openFile');
	ipcMain.removeHandler('dialog:saveFile');

	/*
	 * IPC Handler for open an assembler file. If the filePath is null, 
	 * it will open a save dialog to get the path from the user.
	 */
	ipcMain.handle('dialog:openFile', async (_, filePath: string | null) => {
		if (!filePath) {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				properties: ['openFile'],
				filters: [{ name: 'Assembler Files', extensions: ['asm'] }]
			});
			if (canceled || filePaths.length === 0) return null;
			filePath = filePaths[0];
		}
		const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
		const fileName = path.basename(filePath);
		return { content, filePath, fileName };
	});

	/*
	 * IPC Handler for saving a file. If the filePath is null, 
	 * it will open a save dialog to get the path from the user.
	 */
	ipcMain.handle('dialog:saveFile', async (_, content: string, filePath: string | null) => {
		if (!filePath) {
			const { canceled, filePath: newFilePath } = await dialog.showSaveDialog({
				filters: [{ name: 'Assembler Files', extensions: ['asm'] }]
			});
			if (canceled || !newFilePath) return null;
			filePath = newFilePath;
		}
		fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
		const fileName = path.basename(filePath);
		return { success: true, filePath, fileName };
	});
}

/**
 * Registers IPC handlers for simulator operations such as reading from physical memory.
 * @param simulator The instance of the SimulationController to register handlers for.
 */
function registerSimulatorHandlers(simulator: SimulationController) {
	ipcMain.removeHandler("readRangeFromPhysicalMemory");
	ipcMain.removeHandler("readFromPhysicalMemory");
	ipcMain.removeHandler("readRangeFromVirtualMemory");
	ipcMain.removeHandler("readFromVirtualMemory");
	ipcMain.removeHandler("retrieveMainMemoryCells");
	ipcMain.removeHandler("readPageTableEntries");
	ipcMain.removeHandler("readRegister");
	ipcMain.removeHandler("nextCycle");
	ipcMain.removeHandler("on_disable_auto_scroll_physical_ram");
	ipcMain.removeHandler("on_enable_auto_scroll_physical_ram");
	ipcMain.removeHandler("on_disable_auto_scroll_virtual_ram");
	ipcMain.removeHandler("on_enable_auto_scroll_virtual_ram");
	ipcMain.removeHandler("on_disable_auto_scroll_page_table");
	ipcMain.removeHandler("on_enable_auto_scroll_page_table");

	/**
	 * IPC Handler for reading a range of bytes from physical memory.
	 * @param fromPhysicalAddress The starting physical address to read from.
	 * @param toPhysicalAddress The ending physical address to read to.
	 * @returns A map of physical addresses to their corresponding byte values.
	 */
	ipcMain.handle("readRangeFromPhysicalMemory", async (_, fromPhysicalAddress: DoubleWord, toPhysicalAddress: DoubleWord): Promise<Map<DoubleWord, Byte>> => {
		const tmp: Map<DoubleWord, Byte> = new Map<DoubleWord, Byte>();
		for (let i = fromPhysicalAddress; i <= toPhysicalAddress; ++i) {
			const byte: Byte = simulator.mainMemory.readByteFrom(DoubleWord.fromNumber(i));
			tmp.set(i, byte);
		}
		return tmp;
	});

	/**
	 * IPC Handler for reading a single byte from physical memory.
	 * @param physicalAddress The physical address to read from.
	 * @returns The byte value at the specified physical address.
	 */
	ipcMain.handle("readFromPhysicalMemory", async (_, physicalAddress: DoubleWord): Promise<Byte> => {
		const byte: Byte = simulator.mainMemory.readByteFrom(physicalAddress);
		return byte;
	});

	/**
	 * IPC Handler for reading a range of bytes from virtual memory.
	 * @param fromVirtualAddress The starting virtual address to read from.
	 * @param toVirtualAddress The ending virtual address to read to.
	 * @returns A map of virtual addresses to their corresponding byte values or undefined if the address is invalid.
	 */
	ipcMain.handle("readRangeFromVirtualMemory", async (_, fromVirtualAddress: DoubleWord, toVirtualAddress: DoubleWord): Promise<Map<DoubleWord, Byte | undefined>> => {
		const tmp: Map<DoubleWord, Byte | undefined> = new Map<DoubleWord, Byte | undefined>();
		for (let i = fromVirtualAddress; i <= toVirtualAddress; ++i) {
			try {
				const physicalAddress: DoubleWord = simulator.core.mmu.translate(i, false, false, true, true);
				const byte: Byte = simulator.mainMemory.readByteFrom(physicalAddress);
				tmp.set(i, byte);
			}
			catch {
				tmp.set(i, undefined);
			}
		}
		return tmp;
	});

	/**
	 * IPC Handler for reading a single byte from virtual memory.
	 * @param virtualAddress The virtual address to read from.
	 * @returns The byte value at the specified virtual address or undefined if the address is invalid.
	 */
	ipcMain.handle("readFromVirtualMemory", async (_, virtualAddress: DoubleWord): Promise<Byte | undefined> => {
		try {
			const physicalAddress: DoubleWord = simulator.core.mmu.translate(virtualAddress, false, false, true, true);
			const byte: Byte = simulator.mainMemory.readByteFrom(physicalAddress);
			return byte;
		} catch {
			return undefined;
		}
	});

	/**
	 * IPC Handler for retrieving all cells from the main memory.
	 * @returns A map of physical addresses to their corresponding byte values.
	 */
	ipcMain.handle("retrieveMainMemoryCells", async (): Promise<Map<DoubleWord, Byte>> => {
		return simulator.mainMemory.cells;
	});

	/**
	 * IPC Handler for reading a range of page table entries.
	 * @param firstPageNumberToRead The first page number to read.
	 * @param lastPageNumberToRead The last page number to read.
	 * @returns A map of page numbers to their corresponding page table entries.
	 */
	ipcMain.handle("readPageTableEntries", async (_, firstPageNumberToRead: PageNumber, lastPageNumberToRead: PageNumber): Promise<Map<PageNumber, PageTableEntry>> => {
		const tmp: Map<PageNumber, PageTableEntry> = new Map<PageNumber, PageTableEntry>();
		const fromPhysicalAddressDec: number = firstPageNumberToRead + simulator.core.ptp.content;
		const toPhysicalAddressDec: number = lastPageNumberToRead + simulator.core.ptp.content;
		let currentPageFrameNumber: PageNumber = firstPageNumberToRead;
		let currentPhysicalAddressDec: number = fromPhysicalAddressDec;
		while (currentPhysicalAddressDec <= toPhysicalAddressDec) {
			const pageTableEntry: PageTableEntry = PageTableEntry.fromDoubleWord(simulator.mainMemory.readDoublewordFrom(DoubleWord.fromNumber(currentPhysicalAddressDec)));
			tmp.set(currentPageFrameNumber, pageTableEntry);
			currentPhysicalAddressDec += 4;
			currentPageFrameNumber++;
		}
		return tmp;
	});

	/**
	 * IPC Handler for reading a register's content.
	 * @param registerName The name of the register to read.
	 * @param basis The number system to use for the returned value.
	 * @param asInstruction Whether to interpret the content as an instruction.
	 * @returns The content of the specified register as a string.
	 */
	ipcMain.handle("readRegister", async (_, registerName: RegisterNames, basis: NumberSystems, asInstruction?: boolean): Promise<string> => {
		let content: DoubleWord;
		switch (registerName) {
			case RegisterNames.EAX:
				content = simulator.core.eax.content;
				break;
			case RegisterNames.EBX:
				content = simulator.core.ebx.content;
				break;
			case RegisterNames.ECX:
				content = simulator.core.ecx.content;
				break;
			case RegisterNames.EDX:
				content = simulator.core.edx.content;
				break;
			case RegisterNames.EIP:
				content = simulator.core.eip.content;
				break;
			case RegisterNames.ESP:
				content = simulator.core.esp.content;
				break;
			case RegisterNames.ITP:
				content = simulator.core.itp.content;
				break;
			case RegisterNames.PTP:
				content = simulator.core.ptp.content;
				break;
			case RegisterNames.NPTP:
				content = simulator.core.nptp.content;
				break;
			case RegisterNames.VMPTR:
				content = simulator.core.vmptr.content;
				break;
			case RegisterNames.FLAGS: {
				const flags: Byte = simulator.core.flags.content;
				return flags.toString(2).padStart(8, "0");
			}
			case RegisterNames.EIR: {
				content = simulator.core.eir.content;
				if (asInstruction) {
					// TODO
				}
				return content.toString(2).padStart(32, "0").replace(/(.{4})/g, "$1 ").trim();
			}
			default:
				throw new Error(`Unknown register name: ${registerName}`);
		}

		let result: string;
		if (basis === NumberSystems.HEX) {
			result = `0x${content.toString(16)}`;
		} else if (basis === NumberSystems.DEC) {
			result = `${content}`;
		} else {
			result = content.toString(2).padStart(32, "0").replace(/(.{4})/g, "$1 ").trim();
		}
		return result;
	});

	/**
	 * IPC Handler for executing the next cycle of the simulator.
	 * If an error occurs during the cycle, it sends the error message to the renderer process.
	 * @returns A promise that resolves when the cycle is complete.
	 */
	ipcMain.handle("nextCycle", async (): Promise<void> => {
		try {
			simulator.cycle();
		} catch (error) {
			if (error instanceof Error) {
				applicationWindow.mainWindow!.webContents.send("error", error.message);
			}
		}
	});

	/**
	 * IPC Handler for disabling auto-scroll for physical RAM.
	 * @returns A promise that resolves when the operation is complete.
	 */
	ipcMain.handle("on_disable_auto_scroll_physical_ram", async (): Promise<void> => {
		simulator.autoScrollForPhysicalRAMEnabled = false;
		return;
	});

	/**
	 * IPC Handler for enabling auto-scroll for physical RAM.
	 * @returns A promise that resolves when the operation is complete.
	 */
	ipcMain.handle("on_enable_auto_scroll_physical_ram", async (): Promise<void> => {
		simulator.autoScrollForPhysicalRAMEnabled = true;
		return;
	});

	/**
	 * IPC Handler for disabling auto-scroll for virtual RAM.
	 * @returns A promise that resolves when the operation is complete.
	 */
	ipcMain.handle("on_disable_auto_scroll_virtual_ram", async (): Promise<void> => {
		simulator.autoScrollForVirtualRAMEnabled = false;
		return;
	});

	/**
	 * IPC Handler for enabling auto-scroll for virtual RAM.
	 * @returns A promise that resolves when the operation is complete.
	 */
	ipcMain.handle("on_enable_auto_scroll_virtual_ram", async (): Promise<void> => {
		simulator.autoScrollForVirtualRAMEnabled = true;
		return;
	});

	/**
	 * IPC Handler for disabling auto-scroll for the page table.
	 * @returns A promise that resolves when the operation is complete.
	 */
	ipcMain.handle("on_disable_auto_scroll_page_table", async (): Promise<void> => {
		simulator.autoScrollForPageTableEnabled = false;
		return;
	});

	/**
	 * IPC Handler for enabling auto-scroll for the page table.
	 * @returns A promise that resolves when the operation is complete.
	 */
	ipcMain.handle("on_enable_auto_scroll_page_table", async (): Promise<void> => {
		simulator.autoScrollForPageTableEnabled = true;
		return;
	});
}