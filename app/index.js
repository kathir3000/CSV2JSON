
const config = require('./config.json');
const fs = require('fs');
const csvFilePath = config.csvFileLocation;

const csv = require('csvtojson');
var _ = require('lodash');

csv().fromFile(csvFilePath)
    .then((jsonObj) => {
        jsonMapping(jsonObj);
    })

function jsonMapping(jsonFromCsv) {
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
    fs.writeFile(config.jsonOutputFileLocation, JSON.stringify(finalJsonData, null, 2), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        } 
        console.log("CSV File converted successfully & Saved at '"+ config.jsonOutputFileLocation + "'");
    });


}
