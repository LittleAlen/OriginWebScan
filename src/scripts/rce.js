'use strict'
const RequestParser=require("./../../src/core/RequestParser.js")
const ResponseParser=require("./../../src/core/ResponseParser.js")
const { default: axios } = require("axios")

const {store_cookie} = require("./../../src/core/WebSpider.js")
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
    var playload=";echo 'RCE__Alenkz12__';"
    var result=[]
    var url=req.url.replace("__DefaultValue__",playload)
    var data=req.request.data.replace("__DefaultValue__",playload)
    try{
       //rce 检测
       // 简单的返回输出结果
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
        // if(req.url.includes("sqli_del"))
        //     console.log(response.data)
        // console.log("RCE",response.data.includes("echo 'RCE__Alenkz12__'"))
        if(!(response.data.includes("echo &#039;RCE__Alenkz12__&#039;")||response.data.includes("echo 'RCE__Alenkz12__'"))&&response.data.includes("RCE__Alenkz12__")){
            result.push([playload,""])
        }
       
       }
       //DNS 带外请求
       {}
       //延时检测
    //    {
    //         if(result.length==0){
    //             playload=";sleep 2;"
    //             url=req.url.replace("__DefaultValue__",playload)
    //             data=req.request.data.replace("__DefaultValue__",playload)
    //             let start=new Date()
    //             let response=  await axios({
    //                 url:url,
    //                 method:req.request.request_line.method,
    //                 data:data,
    //                 timeout:0,
    //                 headers:{
    //                     "Cookie":store_cookie[0]
    //                 },
    //             })
    //             let end=new Date()
    //             if(end-start>2000){
    //                 result.push([playload,""])
    //             }
    //         }   
    //    }
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






