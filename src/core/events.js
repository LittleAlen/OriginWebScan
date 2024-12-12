import { BrowserWindow} from 'electron'
import OriginScan from "./run"
import RequestParser from './RequestParser'
import fs from 'fs'
import path from 'path'
import readRules from "./database"
// var {control_status,store_cookie} = require("./WebSpider")
import { control_status, store_cookie } from './WebSpider'
import AdmZip from 'adm-zip'


export function handleSetTitle (event, title) {
    const webContents = event.sender
    const win= BrowserWindow.fromWebContents(webContents)
    
    win.setTitle(title)
    win.webContents.send("text",`hello, I have changed the title to ${title}`)
}

export async function handelStart(event,url="",rawRequest="",filePath=""){
    const webContents = event.sender
    const win= BrowserWindow.fromWebContents(webContents)
    // console.log("__________________________________________________")
    // console.log("url "+url)
    // console.log("raw "+rawRequest)
    // console.log("filepath "+filePath)
    try{
      control_status[0]=true
      store_cookie[0]=""
      var req=new RequestParser(url,rawRequest)
      var hostname=new URL(req.url).hostname
      var result= await OriginScan(url,rawRequest,filePath)
    }catch(e){
      console.log(e)
      return ["Error",[]]
    }
    // console.log(result)
  
    return [hostname,result]
}

export async function handelStop(event){
  control_status[0]=false
  return
}

export async function handleGetRules(){
    //console.log("Get Rules")
    var result=[]
    var rules= await readRules()
    // console.log("rules  ")
    // console.log(rules)
    for(let i=0;i<rules.length;i++)
        result.push(JSON.parse(JSON.stringify(rules[i])))
   // console.log(result)
    return result
}

export async function handleStoreRules(event,rules){
    //console.log("Store rule")
    //console.log(rules)
    fs.writeFile('src/scripts/database.txt', JSON.stringify(rules), (err) => {
        if (err) {
          console.error('Error appending to file:', err);
          return;
        }
      });
    
    return;
    
}

export async function handelDeleteFile(event,filepath){
    var file=await fs.promises.stat(filepath)
    if(file.isDirectory())
    {
        fs.rm(filepath,{ recursive: true, force: true },(err)=>{
        if(err){
          console.error('ERROR: Error deleting directory:', err);
        } else {
          console.log('INFO: Directory deleted successfully',filepath);
        }
      })
    }else{
      fs.rm(filepath,(err)=>{
        if(err){
          console.error('ERROR: Error deleting file:', err);
        } else {
          console.log('INFO: File deleted successfully',filepath);
        }
      })
    }

   
}
export async function handelStoreFile(event,filepath,buffer){
    
  fs.writeFile(filepath, Buffer.from(buffer), (err) => {
    if (err) {
      console.error('ERROR: Error writing file:', err);
    } else  {
      console.log('INFO: File written successfully ',filepath);
    }
  });
    

}

export async function handelMoveFile(event,srcpath,despath){
  
  var data=await handelGetFile(null,srcpath)
  if(path.extname(despath).toLowerCase()===".zip"){
    const directory=path.dirname(despath)
    const zip = new AdmZip(data)
    zip.extractAllTo(directory, true);
    console.log('INFO: File unzips successfully ',directory);
  }else{
    fs.writeFile(despath, data, (err) => {
        if (err) {
          console.error('ERROR: Error writing file:', err);
        } else {
          console.log('INFO: File written successfully ',despath);
        }
      });
  }
}
export async function handelGetFile(event,filepath){
    
  return new Promise((resolve,reject)=>{

    fs.readFile(filepath,(err,data)=>{
      if (err) {
        console.error('ERROR: Error read file:', err);
        reject(`ERROR: in handelGetFile ${filepath}`)
      } else if(filepath.includes("log/output.log")==false){
        console.log('INFO: File Read successfully ',filepath);
      }
      resolve(data)

    })
   
  })

}


export async function handleSetControlStatus(event,status){
    for(let i=0;i<control_status.length;i++)
      control_status[i]=status[i]
    console.log("INFO: Control Status: [Running,DomainScan,StaticRender]")
    console.log("INFO: ",status)
}


export async function handleScanDirectory(event,dirpath) {
  return  await ScanDirectory(dirpath)
}

async function  ScanDirectory(dirpath){
  return new Promise((resolve,reject)=>{
    // 读取目录中的所有文件和文件夹
    var res=[]
    fs.readdir(dirpath, { withFileTypes: true }, async (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        reject(err)
      }

      // 遍历每个文件/文件夹
      for (let file of files) {
        var node={name:undefined,path:undefined,filetype:undefined,children:[]}
        const fullPath = path.join(dirpath, file.name)
      
        if (file.isDirectory()) {
          // 如果是文件夹，则递归调用 handleScanDirectory
          node.children=await ScanDirectory(fullPath)
          node.filetype="dir"
        }else{
          node.filetype="file"
        }
        node.name=file.name
        node.path=fullPath
        res.push(node)
      }
      resolve(res)
    })
  })
}

export function getDirname(event){
 
  return path.dirname(__dirname)
}

