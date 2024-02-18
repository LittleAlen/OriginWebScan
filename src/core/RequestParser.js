'use strict'
const fs = require('fs');
var request_headers=undefined
class  RequestParser{
    constructor(url="",rawRequest="",postData=""){
        
        if(rawRequest!==""){
            this.raw_request=rawRequest
          
            this.request=this.parseRawrequest()
            this.url="http://"+this.request.request_headers["Host"]+this.request.request_line.path
        }
        else if(url!==""){
           
            if(postData!==""){
                let data=""
                for(let i in postData){
                    data=data+i+"="+postData[i]+"&"
                }
                postData=data.slice(0,-1);
            }
            if(url.slice(0,4)!=="http"){
                // console.log(url.split("://"))
                // this.url=url.split("://")[1]
                url="http://"+url
            }
            var url_tmp=new URL(url)
            this.url=url_tmp.href

            
            // var tmp=url.split("://")[1].split("/")
            // var filepath="/"
            // for(let i=1;i<tmp.length;i++){
            //     filepath=filepath+tmp[i]+"/"
            // }
            // filepath=filepath.slice(0,filepath.length-1)
            var query=""
            if(url_tmp.searchParams.toString()!=="")
                query="?"+url_tmp.searchParams.toString()
            this.request={
                request_line:{
                    method:postData===""?"GET":"POST",
                    path:url_tmp.pathname+query,
                    protocol:"HTTP/1.1"
                },
                request_headers:{
                    'Host': url_tmp.origin.split("//")[1],
                    'Sec-Ch-Ua': '"-Not.A/Brand";v="8", "Chromium";v="102"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"macOS"',
                    'Upgrade-Insecure-Requests': '1',
                    'Cookie':'',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-User': '?1',
                    'Sec-Fetch-Dest': 'document',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Connection': 'close',
                    'Content-Length': postData.length
                },
                data:postData
            }
            this.raw_request=this.request.request_line.method+" "+this.request.request_line.path+" "+this.request.request_line.protocol+"\n";
            for(const key in this.request.request_headers){
                this.raw_request=this.raw_request+key+": "+this.request.request_headers[key]+"\n"
            }
            this.raw_request=this.raw_request+"\n"
            this.raw_request=this.raw_request+postData
        }
    }
    parseRawrequest(){
        //this.raw_request=fs.readFileSync('src/core/test/raw_request.txt', 'utf8')        
        //console.log(store_cookie)
        var obj={
            request_line:{
                method:"GET",
                path:"/Alenkz12",
                protocol:"HTTP/1.1"
            },
            request_headers:{
                'Cookie':'',
            },
            data:""
        }
        
        try{
            var result=this.raw_request.split("\n")
            var idx=0;
            while(result[idx]==="")
                idx++;
            var request_line=result[idx].split(" ")
            obj.request_line.method=request_line[0].toUpperCase() 
            obj.request_line.path=request_line[1]
            obj.request_line.protocol=request_line[2]
            
            for( idx=idx+1;result[idx]!=="";idx++){
                if(result[idx]===undefined)
                    break
                let tmp=result[idx].split(": ")
                obj.request_headers[tmp[0].trim()]=tmp[1].trim()
            }
            while(result[idx]==="")
                idx++;
            if(result[idx]!==undefined)
                obj.data=result[idx]
        }catch(error){
            console.log("ERROR: Unsupport Raw Request")
            //console.error(error)
        }
        request_headers=obj.request_headers
        return obj;    
    }
}

// var a = new RequestParser("https://alenkz12.com/kkk/index.html",undefined)
// console.log(a)


// export {
//     RequestParser
// }

module.exports=RequestParser
