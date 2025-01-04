import { contextBridge, ipcRenderer } from 'electron';
import { NumberSystem } from './types';

declare global {
	interface Window {
		mainMemory: any,
		simulator: any
  	}
}

contextBridge.exposeInMainWorld("mainMemory", {
  	readCells: () => ipcRenderer.invoke("retrieveMainMemoryCells"),
});

contextBridge.exposeInMainWorld("simulator", {
	nextCycle: () => ipcRenderer.invoke("nextCycle"),
	readEAX: (basis: NumberSystem = 16) => ipcRenderer.invoke("readEAX", basis),
	readEBX: (basis: NumberSystem = 16) => ipcRenderer.invoke("readEBX", basis),
	readEIP: (basis: NumberSystem = 16) => ipcRenderer.invoke("readEIP", basis),
	readEFLAGS: (basis: NumberSystem = 16) => ipcRenderer.invoke("readEFLAGS", basis),
	readEIR: () => ipcRenderer.invoke("readEIR"),
	readNPTP: (basis: NumberSystem = 16) => ipcRenderer.invoke("readNPTP", basis),
	readVMPTR: (basis: NumberSystem = 16) => ipcRenderer.invoke("readVMPTR", basis),
	readESP: (basis: NumberSystem = 16) => ipcRenderer.invoke("readESP", basis),
	readITP: (basis: NumberSystem = 16) => ipcRenderer.invoke("readITP", basis),
	readGPTP: (basis: NumberSystem = 16) => ipcRenderer.invoke("readGPTP", basis),
	readPTP: (basis: NumberSystem = 16) => ipcRenderer.invoke("readPTP", basis)
});