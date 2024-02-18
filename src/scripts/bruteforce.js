'use strict'
const RequestParser=require("./../../src/core/RequestParser.js")
const ResponseParser=require("./../../src/core/ResponseParser.js")
const { default: axios } = require("axios")

const {store_cookie} = require("./../../src/core/WebSpider.js")

async function Check(req=new RequestParser("http://127.0.0.1")){
    if(req.request.request_line.method==="GET")
            return [false]
    var result=[]
    try{
    //暴力破解
    {
        let response1= await axios({
            url:req.url,
            method:req.request.request_line.method,
            data:req.request.data,
            timeout:0,
            headers:{},
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

        if(response1.data!==response2.data)
            return [false]

        // console.log(req)
        var param=new URLSearchParams(req.request.data)
        var count=0
        var last_key=""
        for (let [key, value] of param) {
            if(value.includes("__DefaultValue__")){
                count=count+1
                last_key=key
            }
        }
        param.delete(last_key)

       // console.log(count)
       //检测是否有验证码
        if(count>=3){
            //检测验证码是否在前端校验
            var response4= await axios({
                    url:req.url,
                    method:req.request.request_line.method,
                    data:param.toString(),
                    timeout:0,
                    headers:{},
                })
            
            if(response4.data===response1.data){
                result.push(["验证码在前端校验，可通过代理工具直接绕过","在后端校验验证码"])
            }
        }
        else if(count==2){
            //检测多次请求后账户是否锁定
            var response3=undefined
            for(let i=0;i<5;i++){
                response3= await axios({
                        url:req.url,
                        method:req.request.request_line.method,
                        data:req.request.data,
                        timeout:0,
                        headers:{},
                    })
            }
            if(response3.data===response1.data)
                result.push(["",""])
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






