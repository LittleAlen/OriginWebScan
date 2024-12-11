import { BrowserWindow} from 'electron'
import OriginScan from "./run"
import RequestParser from './RequestParser'
import fs from 'fs'
import path from 'path'
import readRules from "./database"
// var {control_status,store_cookie} = require("./WebSpider")
import { control_status, store_cookie } from './WebSpider'



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

export async function handelDeleteFile(event,path){
    fs.rm(path,(err)=>{
      if(err){
        console.error('ERROR: Error deleting file:', err);
      } else {
        console.log('INFO: File deleted successfully',path);
      }
    })

   
}
export async function handelStoreFile(event,path,buffer){
    
    fs.writeFile(path, Buffer.from(buffer), (err) => {
        if (err) {
          console.error('ERROR: Error writing file:', err);
        } else {
          console.log('INFO: File written successfully ',path);
        }
      });

}

export async function handleSetControlStatus(event,status){
    for(let i=0;i<control_status.length;i++)
      control_status[i]=status[i]
    console.log("INFO: Control Status: [Running,DomainScan,StaticRender]")
    console.log("INFO: ",status)
}


export function handleScanDirectory(event,dirPath) {
  // 读取目录中的所有文件和文件夹
  var res=[]
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // 遍历每个文件/文件夹
    files.forEach(file => {
      var node={name:undefined,path:undefined,children:[]}
      const fullPath = path.join(dirPath, file.name)
     
      if (file.isDirectory()) {
        // 如果是文件夹，则递归调用 scanDirectory
        node.children=scanDirectory(fullPath)
      }
      node.name=file.name
      node.path=fullPath
      res.push(node)
    })
  })
  return res
}

export function getDirname(event){
 
  return path.dirname(__dirname)
}

