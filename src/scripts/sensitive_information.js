'use strict'
const RequestParser=require("./../../src/core/RequestParser.js")
const ResponseParser=require("./../../src/core/ResponseParser.js")
const axios = require("axios")

const {store_cookie,control_status} = require("./../../src/core/WebSpider.js")
var dir_check=true
var erro_check=true
async function Check(req=new RequestParser("http://127.0.0.1")){
    var result=[]
    try{
    //敏感信息收集
    //注释
    {
        let response=  await axios({
            url:req.url,
            method:req.request.request_line.method,
            data:req.request.data,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0]
            },
        })
        var data=response.data.matchAll(/<!--([^<>]*)-->/g)
        var sensitive_information=""
        for(const tmp of data){
            if(tmp[1].match(/[0-9\/:=]/)!==null)
            sensitive_information=sensitive_information+tmp[1]+"\n"
        }
        if(sensitive_information!=="")
            result.push([sensitive_information,""])
    }
    //目录显示
    {
        if((dir_check||control_status[1]==false)&&req.url.split("/").length>4){
            dir_check=false
            let url=new URL(req.url)
            let path="/"+url.pathname.split("/")[1]
            let response=  await axios({
                url:url.origin+path,
                method:req.request.request_line.method,
                data:req.request.data,
                timeout:0,
                headers:{
                    "Cookie":store_cookie[0]
                },
            })
            if(response.status>=200&&response.status<400){
                result.push(["请求网址的某个目录将显示当前目录下的所有文件","服务器对网站目录设置只读权限，禁止目录列表功能"])
            }
        }
    }
    //报错信息
    {
       
        if(erro_check||control_status[1]==false){
            erro_check=false
            let url=new URL(req.url)
            let response=  await axios({
                url:url.origin+"/fadsf/dasf/adfs",
                method:req.request.request_line.method,
                data:req.request.data,
                timeout:0,
                headers:{
                    "Cookie":store_cookie[0]
                },
                validateStatus: function (status) {
                    return status < 500 
                  }
            })
           
            if(response.data.match(/[0-9]+\.[0-9]+\.[0-9]+/)!==null){
                result.push(["访问不存在页面报错隐藏了版本信息","服务端返回错误页面时，不要加入任何和系统相关的信息"])
            }
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






