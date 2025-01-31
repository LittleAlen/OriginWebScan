"use strict"
const fs = require('fs');
const path = require('path');
//var context = require.context('./../../src/scripts/', false, /\.js$/);
function getResourcePath() {
    if (process.env.NODE_ENV === 'development') {
      return process.cwd()
    } else {
      return process.resourcesPath
    }
  }
class Rule{
    constructor(id=1,name="VulnerabilityName",filepath="PathToScript",grade=5,method="TriggerWay",suggestion="Suggestion",status=true,filename){
        this.id=id
        this.name=name
        this.grade=grade
        this.method=method
        this.suggestion=suggestion
        this.path=path.join(getResourcePath(),"src","scripts",filename)   
        this.status=status
        this.filename=filename
       
        try{
            // console.log(`./../../src/scripts/${path}`)
            // var path=`./../../src/scripts/${path}`
            
        this.function = require(`../scripts/${filename}`)
            //this.loadModule()
        //this.function = context(`./${filename}`)
       
        }
        catch(E){
            console.log(E)
            console.log("INFO: Need to restart Origin to enable new script.  ",filepath)
            this.function=  (req)=>{return [false]}
        }
        // const kk='./../../src/core/xss.js'
        // var p="ore/xss.js"
        // this.function = require('./../../src/c'+p)
       
        

    }
    async loadModule() {
        try {
            this.function = await import(this.path)
        } catch (err) {
          console.error('Error loading module:', err);
        }
    }
   
}

// var a=new Rule(1,"xss","xss.js",5,"'\"/></text><script>alert('---Alenkz12---')</script>","对输入进行过滤，禁止类似分号的特殊字符出现；对输出进行编码，如用HTML编码左右尖括号",()=>{})
// var rules=[]
// rules.push(a)
// a.function()

// fs.writeFile('src/scripts/database.txt', JSON.stringify(rules), (err) => {
//     if (err) {
//       console.error('Error appending to file:', err);
//       return;
//     }
//   });


module.exports=Rule