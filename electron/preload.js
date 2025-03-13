// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runPython: (mode) => ipcRenderer.invoke('run-python', mode)
});