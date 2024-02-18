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
   // console.log(req.url)
    var url=new URL(req.url)
    // if(req.url.includes("vul/urlredirect/"))
    //     console.log(req.url)
    if(url.searchParams.toString()==="")
       return [false]
    // console.log("pass")
    var result=[]
    const test_url=url.origin
    for ( const [key,value] of url.searchParams){
        url.searchParams.set(key,test_url)
    }

    try{
       //重定向
       {
        let response1=  await axios({
            url:url.href,
            method:req.request.request_line.method,
            data:req.request.data,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0]
            },
        })

        let response2=  await axios({
            url:test_url,
            method:"GET",
            timeout:0,
        })
        // console.log(url.href)
        // console.log(response1.data)
        // console.log("__________kkkk______")
        // console.log(response2.data)
        if(response1.data===response2.data){
            result.push(["",""])
        }
       
       }
     
    }catch(e){
        console.log(e)
    }

    
    if(result.length!==0)
        return [true].concat(result)
    else
        return [false]
    // 对于数组中的元素，第一个是触发方法，第二个是修复意见，如果没有的话就用默认的代替,可以接多个数组

}

module.exports=Check






