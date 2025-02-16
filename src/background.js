'use strict'

function getResourcePath() {
  if (process.env.NODE_ENV === 'development') {
    return process.cwd()
  } else {
    return process.resourcesPath
  }
}
const { app, protocol, BrowserWindow,ipcMain } = require( 'electron')
//const { createProtocol } =require('vue-cli-plugin-electron-builder/lib')
//const {installExtension, VUEJS3_DEVTOOLS } =require( 'electron-devtools-installer')
const events = require('./core/events.js')
const fs = require('fs')
const path = require('path')
require('dotenv').config();

// import { app, protocol, BrowserWindow,ipcMain } from 'electron'
// import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
// import * as events from './core/events.js'
// import fs from 'fs'
// import path from 'path'


// console.log("INFO:ProcessDirname",process.cwd())//origin
// console.log(app.getAppPath()) //src
// console.log(process.resourcesPath)
//console.log(process.env.NODE_ENV)
//重定向日志
const formatDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
};
// 创建写入流
// var logpath=`${path.dirname(__dirname)}/log/${formatDate()}_output.log`
//var logpath=`${getResourcePath()}/log/output.log`
var logpath=path.join(getResourcePath(),'log','output.log')
// if(!fs.existsSync(path.dirname(logpath))){
//   fs.mkdirSync(dir, { recursive: true });
// }
fs.writeFileSync(logpath, '');
const logFile = fs.createWriteStream(logpath, { flags: 'a' });
const errorFile = fs.createWriteStream(logpath, { flags: 'a' });

// 将标准输出和错误流重定向到文件
process.stdout.write = logFile.write.bind(logFile);
process.stderr.write = errorFile.write.bind(errorFile);



const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready   配合vue-cli-plugin-electron-builder使用的
// protocol.registerSchemesAsPrivileged([
//   { scheme: 'app', privileges: { secure: true, standard: true } }
// ])


// try {
//   const axios = require('axios');
//   console.log('axios loaded successfully');
// } catch (error) {
//   console.error('Failed to load axios:', error);
// }


async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 640,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
          .ELECTRON_NODE_INTEGRATION ,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,

      preload: path.join(__dirname, 'preload.js')

    }
  })



  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //打开控制台
    if (!process.env.IS_TEST)
     win.webContents.openDevTools()
  } else {
    //配合vue-cli-plugin-electron-builder使用的
    //createProtocol('app')
    // Load the index.html when not in development
    //win.loadURL('app://./index.html')
    //打开控制台
    // if (!process.env.IS_TEST)
    //   win.webContents.openDevTools()
    win.loadFile(path.join(__dirname,'..','dist_electron' ,'index.html'))
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS3_DEVTOOLS)
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }

  // events register 
  ipcMain.on('set-title', events.handleSetTitle)
  ipcMain.handle("Start",events.handelStart)
  ipcMain.handle("Stop",events.handelStop)
  ipcMain.handle("GetRules",events.handleGetRules)
  ipcMain.handle("StoreRules",events.handleStoreRules)
  ipcMain.on("DeleteFile",events.handelDeleteFile)
  ipcMain.on("StoreFile",events.handelStoreFile)
  ipcMain.on("MoveFile",events.handelMoveFile)
  ipcMain.handle("GetFile",events.handelGetFile)
  ipcMain.on("SetControlStatus",events.handleSetControlStatus)
  ipcMain.handle("GetDirpath",events.getDirname)
  ipcMain.handle("ScanDirectory",events.handleScanDirectory)

  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



