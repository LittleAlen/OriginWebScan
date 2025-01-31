"use strict"
const fs = require('fs')
const path = require('path')
const readRules =require("./database")
const {WebSpider,control_status,store_cookie}=require("./WebSpider")
const spider = new WebSpider()
const RequestParser = require("./RequestParser")
const ResponseParser = require("./ResponseParser")
const ResultShow = require("./ResultShow")

async function OriginScan(url="",rawRequest="",filePath=""){
  //todo
  console.log("INFO: Start Scan")
  spider.set(url,rawRequest)
  await spider.start()
  var requests=spider.result()
  var database=await readRules()
  var result=[]
  // console.log(database)
  // console.log(requests)
  var loop = async ()=>{
    for(let i=0;i<database.length;i++){
      if(database[i].status==false)
        continue
      for(let j=0;j<requests.length;j++){
          if(!control_status[0])
            return
          //console.log(database[i].function)
          
          var checkResult = await database[i].function(requests[j])
          if(checkResult[0]){
            for(let k=1;k<checkResult.length;k++){
              result.push(JSON.parse(JSON.stringify(
                new ResultShow(database[i].name,requests[j].request.request_line.path,database[i].grade, requests[j].request.request_line.method,
                  checkResult[k][0]===""?database[i].method:checkResult[k][0],
                  checkResult[k][1]===""?database[i].suggestion:checkResult[k][1])
                )))
              }
          }
          
        
      }
    }
  }
  await loop()
  console.log(`INFO: Scan Results ${result.length}`)
  //  console.log(store_cookie)

  console.log("INFO: Stop Scan")
  return result
}

// async function test(){
//   var result=await  OriginScan("http://127.0.0.1")
// }
// test()

module.exports=OriginScan