import { contextBridge, ipcRenderer } from 'electron';

declare global {
	interface Window {
    mainMemory: any
  }
}

contextBridge.exposeInMainWorld("mainMemory", {
  cells: () => ipcRenderer.invoke("retrieveMainMemoryCells"),
});