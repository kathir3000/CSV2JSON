const csvFilePath = './src/test.csv'
const csv = require('csvtojson')
var _ = require('lodash');

csv().fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonMapping(jsonObj);
    })

function jsonMapping(jsonFromCsv) {
    let jsonKeys = Object.keys(jsonFromCsv[0]);
    let columnNames = {};

    var map = jsonKeys.map((value, index) => {
        columnNames[value] = 'c' + (index + 1);
        return { [value]: 'c' + (index + 1) };
    });
    // jsonKeys.reduce((acc,cur,index)=>{ 
    //     value = {}       
    //     value[cur] = 'c'+(index+1) ;
    //     columnNames.push(value);

    // });
    // console.log(columnNames);
    // // console.log(map);
    // // console.log(jsonFromCsv);

    // var finalData = jsonFromCsv.map((data)=>{
    //     console.log(columnNames[data[0]])
    //     var data = _.mapKeys(data, (value, key) => {
    //         return columnNames[value];
    //       });
    //       console.log(data);
    // });
    // console.log(finalData);

    let tab = {
        abc: 1,
        def: 40,
        xyz: 50
    }

    const map1 = {
        abc: "newabc",
        def: "newdef",
        xyz: "newxyz"
    }

    // Change keys
    var x = _.mapKeys(tab, (value, key) => {
        return map1[value];
    });
    console.log(x);
}

