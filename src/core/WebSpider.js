'use strict'

const puppeteer = require('puppeteer');
const { default: axios } = require("axios")
const RequestParser = require("./RequestParser")
const ResponseParser = require("./ResponseParser")
const ignore_suffix=[".js",".css",".jpg",".jpeg",".png",".webp"]
const control_status=[true,false,true] //程序运行状态，扫描方式，渲染方式 {运行，全域扫描，静态渲染}
const controller = new AbortController()
var store_cookie=[""]
// async function setCookiesFromAxiosResponse(page, cookies,url) {
//     if(cookies==undefined)
//         return
//     for (const cookie of cookies) {
//       const cookieParts = cookie.split(';').map(part => part.trim());
//       const [name, value] = cookieParts[0].split('=');
  
//       // 创建一个包含必要参数的 cookie 对象
//       let puppeteerCookie = {
//         name,
//         value,
//         domain: url.split('/')[2], // 默认的域名
//         path: '/', // 默认的路径
//       };
  
//       // 解析 cookie 的可选参数
//       for (let i = 1; i < cookieParts.length; i++) {
//         const part = cookieParts[i];
//         const [key, val] = part.split('=');
  
//         if (key.toLowerCase() === 'expires') {
//           puppeteerCookie.expires = new Date(val).getTime() / 1000; // 转换为秒
//         } else if (key.toLowerCase() === 'max-age') {
//           puppeteerCookie.expires = Date.now() / 1000 + parseInt(val, 10); // 转换为秒
//         } else if (key.toLowerCase() === 'domain') {
//           puppeteerCookie.domain = val;
//         } else if (key.toLowerCase() === 'path') {
//           puppeteerCookie.path = val;
//         } else if (key.toLowerCase() === 'httponly') {
//           puppeteerCookie.httpOnly = true;
//         } else if (key.toLowerCase() === 'secure') {
//           puppeteerCookie.secure = true;
//         }
//         // 可以添加其他可选参数的处理
//       }
  
//       // 将 cookie 设置到 Puppeteer 页面中
//       console.log(puppeteerCookie)
//       await page.setCookie(puppeteerCookie);
//     }
//   }
function ComputePath(url){
    var tmp_url=new URL(url)
    var param=new URLSearchParams(tmp_url.searchParams)
    for( let [key,value] of param)
    {
        tmp_url.searchParams.set(key,"")
    }
    return tmp_url.href
}

class WebSpider{
    constructor(){}
    set(url="",rawRequest=""){
        this.requests=[]
        this.valid_requests=[]
        this.requests_url=new Set()
        this.url=url
        this.rawRequest=rawRequest
    }
    async start(){
        var req0=new RequestParser(this.url,this.rawRequest,undefined)
        const browser = await puppeteer.launch()
        const context = await browser.createIncognitoBrowserContext();
        
        // 获取 rawRequest中的所有 cookie
        //console.log(req0)
        var cookies = req0.request.request_headers['Cookie'];
        if(cookies!==""&&cookies!==undefined){
            store_cookie[0]=cookies
            const page = await browser.newPage();
            //page.goto(req0.url)
            cookies=cookies.trim().split(";").map(part => part.trim())
            for(let item of cookies){
                item=item.split("=")
                let cookie_one = {
                    name:item[0],
                    value:item[1],
                    domain: req0.request.request_headers["Host"].split(":")[0], // 默认的域名
                    path: '/', // 默认的路径
                  }
                // console.log(cookie_one)
                //cookie check unwriteable
                //所以支持带cookie 扫描，但如果后续网页重新写入cookie会失效，cookie无法写入
                await page.setCookie(cookie_one);
            }
            // const allCookies = await page.cookies();
            // console.log(cookies)
        }
        // var GetCookie=async (req) => {
        //     const page = await browser.newPage();
        //     // 获取所有cookies
        //     page.goto(req.url)
        //     const allCookies = await page.cookies();
        //     console.log(allCookies)
        //     // 筛选特定域名的cookies
        //     const domainCookies = allCookies.filter(cookie => cookie.domain.includes(req0.request.request_headers["Host"]));
        //     console.log(domainCookies)
        //     // 将筛选后的cookies转换为请求头中的Cookie格式
        //     const cookiesHeader = domainCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
          
        //     return cookiesHeader // 输出HTTP请求中的Cookie头部格式
        //   }
        // store_cookie= await GetCookie(req0)
        // console.log(store_cookie)
        var SearchLink = async (req)=>{
            // console.log("----",req.url)
            // console.log(control_status)
            if(!control_status[0])
            {
                // 使用原生的 AbortController
                controller.abort()
                return
            }
            
            if(this.requests_url.has(ComputePath(req.url)+req.request.request_line.method))
            {
                return
            }else{

                this.requests.push(req)
                this.requests_url.add(ComputePath(req.url)+req.request.request_line.method)
            }

            try{
                let response= await axios({
                    url:req.url,
                    method:req.request.request_line.method,
                    data:req.request.data,
                    signal: controller.signal,
                    timeout:0,
                    headers:{
                        "Cookie":store_cookie[0]
                    },
                })
                // console.log("++++",req.url)
                // var response =await axios.get(req.url)
                //console.log(response)
               
                const contentType = response.headers['content-type'];
             
                if (contentType && contentType.includes('html')) {
                    // 响应的 Content-Type 是 text/html，说明是 HTML 内容,进行浏览器渲染
                    // const htmlContent = response.data;
                    //只检测返回html页面的网址下的漏洞
                    this.valid_requests.push(req)
                    var res=""
                    
                    if(control_status[2]===false){
                        //创建页面
                        const page = await browser.newPage();
                        //await setCookiesFromAxiosResponse(page,cookies,req.url)
                        // 使用 Puppeteer 进行渲染
                        //await page.setContent(htmlContent);//由于cookie加载顺序的原因弃用，提前插入好后，但是无法计算校验码
                        await page.goto(req.url)
                        // 等待一些时间以确保页面加载完成
                        await page.waitForTimeout(3000);
                        // 获取渲染后的页面内容
                        const renderedContent = await page.content();
                        res=new ResponseParser(req.url,renderedContent)
                    }else{
                        res=new ResponseParser(req.url,response.data)
                    }
                   
                    //删除响应的html页面的无关资源文件链接
                    var function_result=[]
                    for(let i of res.requests){
                        var tag=false
                       
                        for(let j of ignore_suffix)
                        {
                            if(new URL(i.url).pathname.includes(j)){
                                tag=true
                                break
                            }
                        }
                        if(tag===true){
                            continue
                        }
                        //这段代码会扫描该站点下的所有同域名界面，会产生递归扫描   全域检索和单页面检索的关键
                        if(!this.requests_url.has(ComputePath(i.url)+i.request.request_line.method)){
                            //console.log(control_status)
                            if(control_status[1]){
                                // if(i.url.includes("/vul/unsafedownload/execdownload.php?filename="))
                                //     console.log("~~~~",i.url)
                                function_result.push(SearchLink(i))   //全域检索
                            }
                            else{
                                // this.requests_url.add(i.url+i.request.request_line.method)
                                // console.log(new URL(i.url).pathname)
                                // console.log(new URL(req.url).pathname)
                                // if(new URL(i.url).pathname===new URL(req.url).pathname){
                                //     this.requests.push(i)    //单页面检索
                                // }
                                if(this.requests_url.has(ComputePath(i.url)+i.request.request_line.method))
                                {
                                    this.requests_url.add(ComputePath(i.url)+i.request.request_line.method)
                                    this.requests.push(i)    //单页面检索
                                }
                                
                            }
                        }
                    }
                    await Promise.all(function_result)
                } else {
                // 响应的 Content-Type 不是 text/html，可能是其他类型的内容
                //console.log(`Response Content-Type: ${contentType}`);
                if(contentType.includes("stream")){
                    this.valid_requests.push(req)
                }
                }
            }catch(e){
               console.log("Error: "+req.url)
               //console.log(e)
            }
        }
        await SearchLink(req0)
        // 关闭 Puppeteer 浏览器
       
        await browser.close();
        // this.requests=Array.from(this.requests)
        //console.log("INFO: Spider result  ")
        //console.log(this)
    }
    result(){
       
        if(control_status[1])
            return Array.from(this.valid_requests) //全域扫描只扫描返回html文件的请求
        else
            return Array.from(this.requests) //单页扫描只扫描当前同域名和同路径下的文件
    }
    
}

// var spider=new WebSpider("http://127.0.0.1/index.html",undefined)
// // var spider=new WebSpider("https://element-plus.org/zh-CN/",undefined)
// spider.start()
// setTimeout(()=>{console.log(spider)},3000)
// console.log(spider)

module.exports.WebSpider=WebSpider
module.exports.control_status=control_status
module.exports.store_cookie=store_cookie
module.exports.controller=controller