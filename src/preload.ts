// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { NumberSystems } from './types/enumerations/NumberSystems';
import { DoubleWord } from './types/binary/DoubleWord';
import { Byte } from './types/binary/Byte';
import { PageNumber } from './types/binary/PageNumber';
import { PageTableEntry } from './types/binary/PageTableEntry';

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mainMemory: any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		simulator: any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		electron: any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		windowUpdate: any
	}
}

contextBridge.exposeInMainWorld('electron', {
	getPreloadPath: () => ipcRenderer.sendSync('get-preload-path')
});

contextBridge.exposeInMainWorld("mainMemory", {
	readRangeFromPhysicalMemory: (fromPhysicalAddress: DoubleWord, toPhysicalAddress: DoubleWord): Promise<Map<DoubleWord, Byte>> => 
		ipcRenderer.invoke("readRangeFromPhysicalMemory", fromPhysicalAddress, toPhysicalAddress),
	readFromPhysicalMemory: (physicalAddress: DoubleWord): Promise<Byte> => 
		ipcRenderer.invoke("readFromPhysicalMemory", physicalAddress),
	readDoubleWordFromPhysicalMemory: (physicalAddress: DoubleWord): Promise<DoubleWord> =>
		ipcRenderer.invoke("readDoubleWordFromPhysicalMemory", physicalAddress),
	findVirtualAddresses: (physicalAddress: DoubleWord): Promise<DoubleWord[]> =>
		ipcRenderer.invoke("findVirtualAddresses", physicalAddress),
	translateVirtualAddress: (virtualAddress: DoubleWord): Promise<DoubleWord> =>
		ipcRenderer.invoke("translateVirtualAddress", virtualAddress),
	readRangeFromVirtualMemory: (fromVirtualAddress: DoubleWord, toVirtualAddress: DoubleWord): Promise<Map<DoubleWord, Byte | undefined>> => 
		ipcRenderer.invoke("readRangeFromVirtualMemory", fromVirtualAddress, toVirtualAddress),
	readFromVirtualMemory: (virtualAddress: DoubleWord): Promise<Byte | undefined> => 
		ipcRenderer.invoke("readFromVirtualMemory", virtualAddress),
	readPageTableEntries: (firstPageNumberToRead: PageNumber, lastPageNumberToRead: PageNumber): Promise<Map<PageNumber, PageTableEntry>> =>
		ipcRenderer.invoke("readPageTableEntries", firstPageNumberToRead, lastPageNumberToRead),
});

contextBridge.exposeInMainWorld("simulator", {
	nextCycle: () => ipcRenderer.invoke("nextCycle"),
	readEAX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEAX", radix),
	readEBX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEBX", radix),
	readECX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readECX", radix),
	readEDX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEDX", radix),
	readEIP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEIP", radix),
	readFLAGS: (radix: NumberSystems = 2): Promise<string> => ipcRenderer.invoke("readFLAGS", radix),
	readEIR: (asInstruction: boolean): Promise<string> => ipcRenderer.invoke("readEIR", asInstruction),
	readNPTP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readNPTP", radix),
	readVMPTR: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readVMPTR", radix),
	readESP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readESP", radix),
	readITP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readITP", radix),
	readGPTP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readGPTP", radix),
	readPTP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readPTP", radix),
	onLoadedAssemblyProgram: (callback: (filePath: string | Error) => void) => 
		ipcRenderer.on("loaded_program", (_event, filePath: string | Error) => callback(filePath)),
	onAssembledProgram: (callback: (filePath: string) => void) => 
		ipcRenderer.on("assembled_program", (_event, filePath: string) => callback(filePath)),
	onError: (callback: (errorDescription: string) => void) => 
		ipcRenderer.on("on_error", (_event, errorDescription: string) => callback(errorDescription)),
	onDisableAutoScrollForPageTable: (callback: () => void) => 
		ipcRenderer.on("disable_auto_scroll_page_table", () => callback()),
	onEnableAutoScrollForPageTable: (callback: () => void) => 
		ipcRenderer.on("enable_auto_scroll_page_table", () => callback()),
	keyboardInterrupt: (consoleInput: string) =>
		ipcRenderer.send("keyboard_interrupt", consoleInput),
});

contextBridge.exposeInMainWorld("windowUpdate", {
	onClearLog: (callback: () => void) => 
		ipcRenderer.on('clear_log', () => callback()),
	onUpdateLog: (callback: (message: string) => void) => 
		ipcRenderer.on('update_log', (_event, message) => callback(message)),
	onHideLog: (callback: () => void) =>
		ipcRenderer.on("hide_log", () => callback()),
	onShowLog: (callback: () => void) =>
		ipcRenderer.on("show_log", () => callback()),
	onHideConsole: (callback: () => void) =>
		ipcRenderer.on("hide_console", () => callback()),
	onShowConsole: (callback: () => void) =>
		ipcRenderer.on("show_console", () => callback()),
	onUpdateConsole: (callback: (message: string) => void) =>
		ipcRenderer.on('update_console', (_event, message) => callback(message)),
	onEnableRamFollowEip: (callback: () => void) => 
		ipcRenderer.on("enable_ram_view_follow_eip", () => callback()),
	onDisableRamFollowEip: (callback: () => void) => 
		ipcRenderer.on("disable_ram_view_follow_eip", () => callback()),
})