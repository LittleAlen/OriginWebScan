// const fs = require('fs')
// var responseData=fs.readFileSync('src/core/test/response.html', 'utf8')        
// const pattern_url_href=/<form\b([^>]*)>([\s\S]*?)<\/form>/gi
// var url_get=responseData.matchAll(pattern_url_href)
// // console.log(url_get)
// for(const i of url_get){
//     console.log(i[1])
//     console.log(i[2])
//     let pattern_filepath=/action=["']([^"']*)["']/i
//     let filepath=i[1].match(pattern_filepath)
//     console.log(filepath)
//     if(filepath==null)
//         filepath=""
//     else
//         filepath=filepath[1]
//     console.log(filepath)
// }

// async function f1(){
//     console.log("1")
//     for(let i=0;i<10;i++){
//         await f5()
//         console.log("hello")
//     }
    
//     console.log("3")
// }
// async function f2(){
//     console.log("2")
//     await f5()
// }
// async function f5(){
    
//     setTimeout(()=>{},20000)
//     console.log("5")
// }

// async function kk(){
//     await f1()
//     console.log("kk")
// }
// kk()

// const dynamicCode = '() => {  return "Dynamic string from eval"; }';

// const dynamicFunction = eval(`(${dynamicCode})`);

// console.log(dynamicFunction()); // 输出 "Dynamic string from eval"

function f(path){
    console.log(path)
    path = "124"+path
    console.log(path)
}
f("hello")