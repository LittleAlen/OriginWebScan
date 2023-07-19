const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  ipcRenderer
})