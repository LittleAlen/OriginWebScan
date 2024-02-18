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
    var playload="'\"/></text><script>alert(Alenkz12)</script>"
    var result=[]
    try{
        //检查反射XSS，和存储XSS
        {
            if(req.request.request_line.method==="GET"&&req.url.includes("__DefaultValue__")){
                let path=req.request.request_line.path
                let url=new URL(req.url.replace("__DefaultValue__",playload))
                let response= await axios({
                    url:url,
                    method:req.request.request_line.method,
                    data:req.request.data,
                    timeout:0,
                    headers:{
                        "Cookie":store_cookie[0]
                    },
                })
                // console.log(response.data.includes("<script>alert(Alenkz12)</script>"))
                // console.log(response.data.match(/<script>alert(Alenkz12)<\/script>/)!==null)
                if(response.data.match(/<script>alert\(Alenkz12\)<\/script>/)!==null)
                    result.push(["",""])
            }else if(req.request.request_line.method==="POST"){
                // console.log(req)
                // console.log(store_cookie)
                let data=req.request.data.replace("__DefaultValue__",playload)
                let response= await axios({
                    url:req.url,
                    method:req.request.request_line.method,
                    data:data,
                    timeout:0,
                    headers:{
                        "Cookie":store_cookie[0]
                    },
                })

            
                //console.log(req.request.data)
                // console.log(response.data)
                if(response.data.match(/<script>alert\(Alenkz12\)<\/script>/)!==null)
                    result.push(["",""])
            }
        }
        //检查DOM XSS
        {
            let response= await axios({
                url:req.url,
                method:req.request.request_line.method,
                data:req.request.data,
                timeout:0,
                headers:{
                    "Cookie":store_cookie[0]
                },
            })
            if(response.data.match(/.innerHTML=.*\+[a-zA-Z].*/)!==null||response.data.match("document.write(.*\+.*")!==null)//可能会误报
                result.push(["innerHTML、document.write 部分可以插入恶意DOM节点"," 对于用户的输入，最好使用innerText来渲染"])

        }
    }catch(e){
       // console.log(e)
    }

    // console.log("XSS")
    if(result.length!==0)
        return [true].concat(result)
    else
        return [false]
    // 对于数组中的元素，第一个是触发方法，第二个是修复意见，如果没有的话就用默认的代替,可以接多个数组

}

module.exports=Check






