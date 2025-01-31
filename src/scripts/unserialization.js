'use strict'
const RequestParser=require("../core/RequestParser.js")
const ResponseParser=require("../core/ResponseParser.js")
const axios = require("axios")

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
   var keyword=new URL(req.url).searchParams.toString()+req.request.data;
   if(keyword.includes("__DefaultValue__")===false)
       return [false]
    //各个通用的框架的PHP漏洞
    var playload_php=[]
    var playload_java=[]
    var result=[]
   
    try{
       //php反序列化，通过对象来包括了命令执行，文件上传，下载， 还有一个文件上传的PHAR漏洞，
       //有些程序会将base64编码解码后再发送的，这个必须通过网络代理才能发现，，，
       //最优方案通过时延来测试,
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






