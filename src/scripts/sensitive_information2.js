'use strict'
const RequestParser=require("../core/RequestParser.js")
const ResponseParser=require("../core/ResponseParser.js")
const  axios = require("axios")

const {store_cookie,control_status} = require("../core/WebSpider.js")
var domain_url=""
var Path=new Set()
async function Check(req=new RequestParser("http://127.0.0.1")){
    
    var result=[]
    let url=new URL(req.url)
    if(url.pathname.includes(".")===false)
        return [false]
    if(control_status[1]==true)
    {
        if(Path.has(url.origin+url.pathname))
            return false;
        else    
            Path.add(url.origin+url.pathname)
    }
    
    try{
    //敏感信息收集2
    // 因编辑意外关闭而泄漏的文件
    {
        var suffix=[".bak","~",".swp",".swo",".swn",".backup",".old",".~"]
        for(let suff of suffix){
            let response=  await axios({
                url:url.origin+url.pathname+suff,
                method:req.request.request_line.method,
                data:req.request.data,
                timeout:0,
                headers:{
                    "Cookie":store_cookie[0]
                },
                validateStatus:(status)=>{
                    return status<500
                }
            })
          //  console.log(url.origin+url.pathname+suff)
            if(response.status>=200&&response.status<400)
                result.push([`该页面存在备份文件，${url.origin+url.pathname+suff}`,""])
        }
    }
    //网站备份
    {
        if(domain_url!==new URL(req.url).origin){
            var origin=new URL(req.url).origin
            domain_url=origin
            var domain_check=["robots.txt","readme.md",".git/HEAD",".svn/entries",".hg/last-message.txt","jwks.json","cgi-bin","web.tar","web.tar.gz","web.zip","web.rar","website.tar","website.tar.gz","website.zip","website.rar","backup.tar","backup.tar.gz","backup.zip","backup.rar","back.tar","back.tar.gz","back.zip","back.rar","www.tar","www.tar.gz","www.zip","www.rar","wwwroot.tar","wwwroot.tar.gz","wwwroot.zip","wwwroot.rar","temp.tar","temp.tar.gz","temp.zip","temp.rar"]
            for(let path of domain_check){
                let response=  await axios({
                    url: origin+"/"+path ,
                    method:req.request.request_line.method,
                    data:req.request.data,
                    timeout:0,
                    headers:{
                        "Cookie":store_cookie[0]
                    },
                    validateStatus:(status)=>{
                        return status<500
                    }
                })
                // console.log(origin+"/"+path)
                if(response.status>=200&&response.status<400&&response.data.match(/404|not\s+found/i)===null)
                    result.push([`主域名下存在网站备份文件，${origin+"/"+path}`,""])
            }

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






