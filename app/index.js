
const config = require('./config.json');
const fs = require('fs');
const csv = require('csvtojson');
var _ = require('lodash');
const buildOptions = require('minimist-options');
var minimist = require('minimist');


// Command Line arguments options
const options = buildOptions({
    format: {
        type: 'string',
        alias: 'f',
        default: 'grid'
    },
    data: {
        type: 'string',
        alias: 'd',
        default: ''
    },
    csvFileLocation: {
        type: 'string',
        alias: ['c', 'i'],
        default: config.csvFileLocation
    },
    jsonOutputFileLocation: {
        type: 'string',
        alias: ['j', 'o'],
        default: config.jsonOutputFileLocation
    },

    // special option for positional arguments (`_` in minimist)
    arguments: 'string'
});

const args = minimist(process.argv.slice(2), options);
const csvFilePath = args.csvFileLocation;
const jsonFilePath = args.jsonOutputFileLocation;


csv().fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonMapping(jsonObj);
    })

function jsonMapping(jsonFromCsv) {
    if (args.format.toLowerCase() == 'grid') {
        var finalJsonData = {};
        let jsonKeys = Object.keys(jsonFromCsv[0]);
        let columnNames = {};

        var finalGridColumn = jsonKeys.map((value, index) => {
            columnNames[value] = config.colName + (index + 1);
            var attrib = {
                "defaultF": "Y",
                "attributeName": value,
                "width": 150,
                "attributeOrder": 1,
                "colName": config.colName + (index + 1),
                "dbColumn": "BETA_PLAN_ID",
                "dbColumnType": "Varchar"
            }
            return attrib;
        });

        var finalGridData = jsonFromCsv.map((data) => {
            var data = _.mapKeys(data, (value, key) => {
                return columnNames[key];
            });
            return data;
        });

        finalJsonData.colConf = {}
        finalJsonData.colConf.gridId = 1;
        finalJsonData.colConf.gridName = "";
        finalJsonData.colConf.attributes = finalGridColumn

        finalJsonData.data = finalGridData;
    }
    else if (args.format.toLowerCase() == 'heatmap') {
        let xAxis = Object.keys(jsonFromCsv[0]).slice(1); //xAxis
        let yAxis = jsonFromCsv.map(item => item.field1); //yAxis
        let data = jsonFromCsv.map(item => { 
            delete item.field1
            return Object.values(item);
        });
        data = _.flatten(data);
        let heatMapData = [];
        index = 0;
        for (i=0;i<yAxis.length;i++){
            for(j=0;j<xAxis.length;j++){
               heatMapData.push([i,j,data[index]]);
               index++;
            }
        }
        finalJsonData = {
            xAxis,yAxis,heatMapData
        }
        console.log(finalJsonData);
        

    }

    if (finalJsonData) {
        fs.writeFile(jsonFilePath, JSON.stringify(finalJsonData, null, 2), 'utf8',
            function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("CSV File converted successfully & Saved at '" + jsonFilePath + "'");
            });
    }
    else {
        console.log("No data to process. Please check the input data in command line/config file");
    }


}
