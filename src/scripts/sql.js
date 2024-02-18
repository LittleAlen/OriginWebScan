//SQL注入的检测是高耗时操作，建议单页面检索用，人工筛选出可能存在sql数据库交互的页面
'use strict'
const RequestParser=require("../core/RequestParser.js")
const ResponseParser=require("../core/ResponseParser.js")
const { default: axios } = require("axios")
const { exec } = require('child_process');
const util = require('util');
const {store_cookie,controller} = require("../core/WebSpider.js");
// var response = await axios({
//     url:req.url,
//     method:req.request.request_line.method,
//     data:req.data,
//     timeout:0,
//     headers:{
//       "Cookie":store_cookie[0]
//     },
// })
const execAsync = util.promisify(exec);
async function Check(req=new RequestParser("http://127.0.0.1")){
   // console.log(req.url)
   var keyword=new URL(req.url).searchParams.toString()+req.request.data;
   if(keyword==="")
       return [false]
    var result=[]
   
    try{
        // const command=`source ~/.zshrc ;conda activate hacker; cd /tmp ; echo "${req.raw_request}" >WebScanTool_Origin_Request_Tmp.txt; sqlmap -r WebScanTool_Origin_Request_Tmp.txt --risk=1 --level=1 --batch --threads=10>123.txt`
        const get_command=`source ~/.zshrc ;conda activate hacker; sqlmap -u "${req.url}" --risk=1 --level=1 --batch --threads=10 --cookie="${store_cookie[0]}"`
        const post_command=`source ~/.zshrc ;conda activate hacker; sqlmap -u "${req.url}" --risk=1 --level=1 --batch --threads=10 --cookie="${store_cookie[0]}" --data="${req.request.data}"`
        
        // const command2="source ~/.zshrc ;conda activate hacker;  cd /tmp ;cat WebScanTool_Origin_Request_Tmp.txt ;sqlmap -r /tmp/WebScanTool_Origin_Request_Tmp.txt --risk=1 --level=1 --batch >123.txt"
        // const command3="source ~/.zshrc ;echo hello;conda activate hacker;  cd /tmp ;cat WebScanTool_Origin_Request_Tmp.txt ; sqlmap -r /tmp/WebScanTool_Origin_Request_Tmp.txt --risk=1 --level=1 --batch --threads=10 --fresh-queries"
        
        const { stdout, stderr } = await execAsync(req.request.request_line.method==="GET"?get_command:post_command,{shell: true,   signal:controller.signal});

       
        // console.log(stdout)
        // console.log(stderr)
        var output=stdout.match(/---\n([\s\S]+?)---\n/)
        if(output!==null){
            result.push([output[1],""])
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






