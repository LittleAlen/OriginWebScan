const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  testText:(callback)=>ipcRenderer.on('text',callback),
  start:(url,rawRequest,filePath)=>ipcRenderer.invoke("Start",url,rawRequest,filePath),
  stop:()=>ipcRenderer.invoke("Stop"),
  getRules:()=>ipcRenderer.invoke("GetRules"),
  storeRules:(rules)=>ipcRenderer.invoke("StoreRules",rules),
  deleteScript:(name)=>ipcRenderer.send("DeleteScript",name),
  storeScript:(name,text)=>ipcRenderer.send("StoreScript",name,text),
  setControlStatus:(status)=>ipcRenderer.send("SetControlStatus",status)
})

