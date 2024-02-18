'use strict'
//import { RequestParser } from "./RequestParser"
const fs =require('fs')
const RequestParser = require('./RequestParser')
class ResponseParser{
    constructor(baseUrl="",responseData=""){
        if(baseUrl[-1]==="/")
            baseUrl=baseUrl.slice(0,baseUrl.length-1)
        this.requests=[]
        this.baseurl=baseUrl
        // if(baseUrl.includes("://"))
        //     baseUrl=baseUrl.split("://")[1]
        var url=new URL(this.baseurl)

        //parse the Get request
        const pattern_url_href=/href=["']([^"']*)["']/ig
        const url_get=responseData.matchAll(pattern_url_href)
        for(const tmp of url_get)
        {   
            // console.log("tmp= "+tmp[1])
            //here process the absolute path and relative path
            let path=tmp[1].split("#")[0]
            if(tmp[1].split("?")[0].match(/http[s]{0,1}:\/\//)!==null){ 
                if(path.includes(url.origin))
                    this.requests.push(new RequestParser(path))
                
            }else{
                this.requests.push(new RequestParser(new URL(path,baseUrl).href))
            }
        }

        //parse the POST and Get request
        const pattern_url_from=/<form\b([^>]*)>([\s\S]*?)<\/form>/ig
        const url_from=responseData.matchAll(pattern_url_from)
        for(const tmp of url_from){
            let pattern_filepath=/action=["']([^"']*)["']/i
            let filepath=tmp[1].match(pattern_filepath)
            if(filepath==null)
                filepath=""
            else
                filepath=filepath[1]
            
            // if(filepath[0]!='/')
            //     filepath='/'+filepath
            filepath=filepath.split("#")[0]
            var obj={};
            //tag which have default value
            const pattern_default=/name=["']([^"']*)["'].*value=["']([^"']*)["']/ig
            const default_value=tmp[2].matchAll(pattern_default)
            for(const tmp1 of default_value){
                obj[tmp1[1]]=tmp1[2]
            }
            //tag which need input
            const pattern_input=/name=["']([^"']*)["']/ig
            const input_value=tmp[2].matchAll(pattern_input)
            for(const tmp1 of input_value){
                if(obj[tmp1[1]]===undefined){
                    obj[tmp1[1]]="__DefaultValue__"
                }
            }
            //tag to test fileupload vulnerability
            const pattern_file=/type=["']file["'].*name=["']([^"']*)["']/ig
            const file_value=tmp[2].matchAll(pattern_file)
            for(const tmp1 of file_value){    
                    obj[tmp1[1]]="__File__"
            }
            
            //create GET request or POST Request
            let is_post=/post/i
            if(tmp[1].match(is_post)!==null){
                // if(filepath===""){
                //     this.requests.push(new RequestParser(baseUrl,undefined,obj))
                // }else{
                //     if(filepath[0]==="/")
                //         this.requests.push(new RequestParser(url.origin+filepath,undefined,obj))
                //     else if(filepath[0]==="."){
                //         if(baseUrl.includes("."))
                //             this.requests.push(new RequestParser(baseUrl+filepath+parameter))
                //     }
                //     else 
                //         this.requests.push(new RequestParser(baseUrl.includes(filepath)?baseUrl:(baseUrl+filepath),undefined,obj))
                
                // }
                this.requests.push(new RequestParser(new URL(filepath,baseUrl).href,undefined,obj))
            }else{
                var parameter="?"
                for(const key in obj){
                    parameter=parameter+key+"="+obj[key]+"&"
                }
                parameter=parameter.slice(0,parameter.length-1)

                // if(filepath===""){
                //     this.requests.push(new RequestParser(baseUrl+parameter))
                // }else{
                //     if(filepath[0]==="/")
                //         this.requests.push(new RequestParser(url.origin+filepath+parameter))
                //     else if(filepath[0]==="."){
                //         if(baseUrl.includes("."))
                //             this.requests.push(new RequestParser(baseUrl+filepath+parameter))
                //     }
                //     else 
                //         this.requests.push(new RequestParser(baseUrl.includes(filepath)?baseUrl:(baseUrl+filepath)+parameter))
                // }
                this.requests.push(new RequestParser(new URL(filepath,baseUrl).href+parameter))

            }
        }


    }
}



// var raw_response=fs.readFileSync('src/core/test/test1.html', 'utf8')        
// var a=new ResponseParser("https://alenkz12.cn.com",raw_response)
// console.log(a)
// console.log(JSON.stringify(a))
module.exports=ResponseParser
