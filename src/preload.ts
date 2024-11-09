import { contextBridge, ipcRenderer } from 'electron';

export const mainMemory = {
  cells: () => ipcRenderer.invoke("retrieveMainMemoryCells"),
};

contextBridge.exposeInMainWorld("mainMemory", mainMemory);