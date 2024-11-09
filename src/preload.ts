import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("mainMemory", {
    cells: () => ipcRenderer.invoke("retrieveMainMemoryCells"),
});