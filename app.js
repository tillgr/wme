// DO NOT CHANGE!
//init app with express, util, body-parser, csv2json
const express = require('express');
const app = express();
const sys = require('util');
const path = require('path');
const bodyParser = require('body-parser');
const csvConverter = require("csvtojson").Converter;

//register body-parser to handle json from res / req
app.use(bodyParser.json());

//register public dir to serve static files (html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// END DO NOT CHANGE!

/**************************************************************************
 ****************************** csv2json *********************************
 **************************************************************************/
const csvFilePath = './world_data.csv';
const csv = require('csvtojson');
let jsonArray;
let properties = [];
let highestId = 26;

// Async / await usage
async function createArray() {
	jsonArray = await csv().fromFile(csvFilePath);

	for (let key in jsonArray[0]) {
		properties.push(key);
	}
}

createArray();

/**************************************************************************
 ********************** handle HTTP METHODS ***********************
 **************************************************************************/
//---------------GET--------------//
//get all data json
app.get('/items', (req, res) => {
	res.json(jsonArray);
});

//get all properties
app.get('/properties', function (req, res) {
	res.json(properties);
});

// DO NOT CHANGE!
// bind server localhost to port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
