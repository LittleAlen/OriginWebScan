"use strict"
const fs = require('fs');
const Rule=require("./Rule");
// constructor(id=1,name="VulnerabilityName",path="PathToScript",grade=5,method="TriggerWay",suggestion="Suggestion")

async function readRules(){

  var rules=[]
  var data=  fs.readFileSync('./src/scripts/database.txt', { encoding: 'utf8' });
  
    data=JSON.parse(data)
    // console.log(data)
    for(let i=0;i<data.length;i++){
        rules.push(new Rule(data[i].id,data[i].name ,data[i].path ,data[i].grade,data[i].method ,data[i].suggestion,data[i].status,data[i].filename))
    }
    //console.log(rules)
    // rules[0].function()
  
 return rules
  
}
// async function s(){
//   var rules= await readRules()
//   console.log(rules)
// }

// s()


module.exports=readRules