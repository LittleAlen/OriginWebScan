const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  testText:(callback)=>ipcRenderer.on('text',callback),
  start:(url,rawRequest,filePath)=>ipcRenderer.invoke("Start",url,rawRequest,filePath),
  stop:()=>ipcRenderer.invoke("Stop"),
  getRules:()=>ipcRenderer.invoke("GetRules"),
  storeRules:(rules)=>ipcRenderer.invoke("StoreRules",rules),
  deleteFile:(path)=>ipcRenderer.send("DeleteFile",path),
  storeFile:(path,buffer)=>ipcRenderer.send("StoreFile",path,buffer),
  setControlStatus:(status)=>ipcRenderer.send("SetControlStatus",status),
  getDirname:()=>ipcRenderer.invoke("GetDirpath"),
  scanDir:(dirpath)=>ipcRenderer.invoke("ScanDirectory",dirpath),

})

