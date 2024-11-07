import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  
});