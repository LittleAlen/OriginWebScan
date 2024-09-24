import { BrowserWindow} from 'electron'
import OriginScan from "./run"
import RequestParser from './RequestParser'
const fs = require("fs")
import readRules from "./database"
var {control_status,store_cookie} = require("./WebSpider")
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

export async function handelDeleteScript(event,name){
    var path="src/scripts/"+name
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File does not exist');
        } else {
        // console.log('File exists');
        fs.unlink(path, (err) => {
            if (err) {
              console.error('ERROR: Error deleting file:', err);
            } else {
              console.log('INFO: File deleted successfully');
            }
          });
        }
      });
}
export async function handelStoreScript(event,name,text){
    var path="src/scripts/"+name
    fs.writeFile(path, text, (err) => {
        if (err) {
          console.error('ERROR: Error writing file:', err);
        } else {
          console.log('INFO: File written successfully');
        }
      });
}

export async function handleSetControlStatus(event,status){
    for(let i=0;i<control_status.length;i++)
      control_status[i]=status[i]
    console.log("INFO: Control Status: [Running,DomainScan,StaticRender]")
    console.log("INFO: ",status)
}