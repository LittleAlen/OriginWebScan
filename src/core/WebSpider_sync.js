'use strict'
const axios= require("axios")
const RequestParser = require("./RequestParser")
const ResponseParser = require("./ResponseParser")

class WebSpider{
    constructor(url="",rawRequest=""){
        this.requests=new Set()
        var req=new RequestParser(url,rawRequest,undefined)
        this.requests.add(req)
        var pool=[]
        var expandPool = async ()=>{
            try{
                var response = await axios({
                    url:req.url,
                    method:req.request.request_line.method,
                    data:req.data,
                })
                var res=new ResponseParser(req.url,response.data)
                //console.log(res)
                pool=pool.concat(res.requests)
                while(pool.length!==0){
                    var tar=pool.pop()
                    if(!this.requests.has(tar)){
                        this.requests.add(tar)
                        try{
                            var response1 = await axios({
                                url:tar.url,
                                method:tar.request.request_line.method,
                                data:tar.data,
                            })
                            let res1=new ResponseParser(tar.url,response1.data)
                            pool.concat(res1.requests)
                        }catch(e){}
                        
                    }
                }
                this.requests=Array.from(this.requests)
                console.log(this)
            }catch(e){}
        }
        expandPool()
    }
}

// var spider=new WebSpider("http://127.0.0.1",undefined)
//var spider=new WebSpider("https://element-plus.org/zh-CN/",undefined)

module.exports=WebSpider