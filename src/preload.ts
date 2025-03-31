// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { NumberSystems } from './types/enumerations/NumberSystems';

declare global {
	interface Window {
		mainMemory: any,
		simulator: any,
		electron: any
	}
}

contextBridge.exposeInMainWorld('electron', {
	getPreloadPath: () => ipcRenderer.sendSync('get-preload-path')
});

contextBridge.exposeInMainWorld("mainMemory", {
	readRangeFromPhysicalMemory: (fromPhysicalAddressHexString: string, toPhysicalAddressHexString: string): Promise<Map<string, string>> => 
		ipcRenderer.invoke("readRangeFromPhysicalMemory", fromPhysicalAddressHexString, toPhysicalAddressHexString),
	readFromPhysicalMemory: (physicalAddressHexString: string): Promise<Map<string, string>> => 
		ipcRenderer.invoke("readFromPhysicalMemory", physicalAddressHexString),
	readRangeFromVirtualMemory: (fromVirtualAddressHexString: string, toVirtualAddressHexString: string): Promise<Map<string, string>> => 
		ipcRenderer.invoke("readRangeFromVirtualMemory", fromVirtualAddressHexString, toVirtualAddressHexString),
	readFromVirtualMemory: (virtualAddressHexString: string): Promise<Map<string, string>> => 
		ipcRenderer.invoke("readFromVirtualMemory", virtualAddressHexString),
	readPageTableEntries: (firstPageNumberToReadDec: number, lastPageNumberToReadDec: number): Promise<Map<string, string>> =>
		ipcRenderer.invoke("readPageTableEntries", firstPageNumberToReadDec, lastPageNumberToReadDec),
});

contextBridge.exposeInMainWorld("simulator", {
	nextCycle: () => ipcRenderer.invoke("nextCycle"),
	readEAX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEAX", radix),
	readEBX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEBX", radix),
	readECX: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readECX", radix),
	readEIP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEIP", radix),
	readEFLAGS: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readEFLAGS", radix),
	readEIR: (asInstruction: boolean): Promise<string> => ipcRenderer.invoke("readEIR", asInstruction),
	readNPTP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readNPTP", radix),
	readVMPTR: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readVMPTR", radix),
	readESP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readESP", radix),
	readITP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readITP", radix),
	readGPTP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readGPTP", radix),
	readPTP: (radix: NumberSystems = 16): Promise<string> => ipcRenderer.invoke("readPTP", radix),
	onLoadedAssemblyProgram: (callback: (filePath: string[]) => void) => 
		ipcRenderer.on("loaded_program", (_event, filePath: string[]) => callback(filePath)),
	onError: (callback: (errorDescription: string) => void) => 
		ipcRenderer.on("on_error", (_event, errorDescription: string) => callback(errorDescription)),
	onDisableAutoScrollForPhysicalRAM: (callback: () => void) => 
		ipcRenderer.on("disable_auto_scroll_physical_ram", () => callback()),
	onDisableAutoScrollForVirtualRAM: (callback: () => void) => 
		ipcRenderer.on("disable_auto_scroll_virtual_ram", () => callback()),
	onDisableAutoScrollForPageTable: (callback: () => void) => 
		ipcRenderer.on("disable_auto_scroll_page_table", () => callback()),
	onEnableAutoScrollForPhysicalRAM: (callback: () => void) => 
		ipcRenderer.on("enable_auto_scroll_physical_ram", () => callback()),
	onEnableAutoScrollForVirtualRAM: (callback: () => void) => 
		ipcRenderer.on("enable_auto_scroll_virtual_ram", () => callback()),
	onEnableAutoScrollForPageTable: (callback: () => void) => 
		ipcRenderer.on("enable_auto_scroll_page_table", () => callback())
});