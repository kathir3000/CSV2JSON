
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
        default: config.format
    },
    noHeader: {
        type: 'string',
        alias: 'h',
        default: config.noHeader
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
let csvOptions = {};

if (args.format.toLowerCase() != 'line') {
    csvOptions = { noheader: args.noHeader, output: "json" };
} else if (args.format.toLowerCase() == 'line') {
    csvOptions = { noheader: true, output: "csv" };
}


csv(csvOptions).fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonMapping(jsonObj);
    })

function jsonMapping(jsonFromCsv) {
    var finalJsonData = {};
    if (args.format.toLowerCase() == 'grid') {
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
        for (i = 0; i < yAxis.length; i++) {
            for (j = 0; j < xAxis.length; j++) {
                heatMapData.push([yAxis[i], xAxis[j], data[index]]);
                index++;
            }
        }
        heatMapData = heatMapData.map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        });
        var sales = [], margin = [], units = [];
        heatMapData = heatMapData.filter(item => {
            if (item[0].toLowerCase() == 'sales') {
                sales.push(item);
            } else if (item[0].toLowerCase() == 'margin') {
                margin.push(item);
            } else if (item[0].toLowerCase() == 'units') {
                units.push(item);
            }
            return item;
        });

        finalJsonData = {
            xAxis, yAxis, heatMapData, sales, margin, units
        }
    }
    else if (args.format.toLowerCase() == 'line') {
        let legendData = jsonFromCsv[0];
        let xAxisData = jsonFromCsv[1];
        let lineGraphData = jsonFromCsv.slice(2);
        for (i = 0; i < lineGraphData.length; i++) {
            console.log(String.fromCharCode(97 + i));

        }
        // https://stackoverflow.com/questions/35939289/how-to-destructure-into-dynamically-named-variables-in-es6
        let v = [a, b, c];
        v = lineGraphData;
        console.log(a);
        // finalJsonData = {
        //     legendData, xAxisData,lineGraphData
        // }

    }

    if (finalJsonData) {
        fs.writeFile(jsonFilePath, JSON.stringify(finalJsonData, null, 2), 'utf8',
            function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(finalJsonData);
                console.log("CSV File converted successfully & Saved at '" + jsonFilePath + "'");
            });
    }
    else {
        console.log("No data to process. Please check the input data in command line/config file");
    }


}
