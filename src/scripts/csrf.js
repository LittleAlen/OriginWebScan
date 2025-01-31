'use strict'
const RequestParser=require("./../../src/core/RequestParser.js")
const ResponseParser=require("./../../src/core/ResponseParser.js")
const axios  = require("axios")

const {store_cookie} = require("./../../src/core/WebSpider.js")

async function Check(req=new RequestParser("http://127.0.0.1")){
    if(store_cookie[0]==="")
        return [false]
    var keyword=new URL(req.url).searchParams.toString()+req.request.data;
    if(keyword==="")
        return [false]
    var result=[]
    try{
    //csrf 检验
    {
        let response1= await axios({
            url:req.url,
            method:req.request.request_line.method,
            data:req.request.data,
            timeout:0,
          
        })
        let response2= await axios({
            url:req.url,
            method:req.request.request_line.method,
            data:req.request.data,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0]
            },
        })
        if(response1.data.length===response2.data.length)
            return [false]
        //console.log(req)
        // console.log(response1.data===response2.data)
        if(req.request.request_line.method==="GET"){ //可能会产生大量的误报，登录状态下的每个跳转链接都必须要权限，然后普通跳转都会报漏洞
            // console.log("??")
            // console.log(req)
            // console.log("----1----",response1.data)
            // console.log("----2----",response2.data)
            if(req.request.request_line.path.match(/csrf=/i)===null&&req.request.request_line.path.match(/token=/i)===null)
                result.push(["",""])
        }
        else if(req.request.request_line.method==="POST"){
            if(req.request.data.match(/csrf=/i)===null&&req.request.data.match(/token=/i)===null)
                result.push(["",""])
        }
     //cookie 未和token做绑定不做检查   
     {
        
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






