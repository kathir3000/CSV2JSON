"# CSV2JSON" 

#CD to app directory in command prompt or nodeJs
```
CD app
```
#Install dependencies from package.json
```
npm Install
```
#Edit Config file for input csv location & output json location

"csvFileLocation":"./src/input.csv"

"outputSameFileName": <true|false> 

"jsonOutputFileLocation":"./src/output.json"



#Command Line Arguments
#output json format; default 'grid'
-f or --format [ grid | heatmap | line | tree | bar | pie | dropdown] 
#input file location; default taken from config file
-i or -c or --csvFileLocation <input csv file path>
#output file location;  default taken from config file
-o or -j or --jsonOutputFileLocation <output Json file path>
#csv Header; Indicating csv data has no header row and first row is data row. Default is false
-h or --noHeader < true | false >

#run NodeJs
node index.js [options]

#File will be saved to the output location given in config file
-T.Eezhakathir
