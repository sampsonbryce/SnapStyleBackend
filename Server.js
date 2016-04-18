var express = require("express");
var mysql = require("mysql");
var body_parser = require('body-parser');
var routes = require('./routes/routes.js');


var app = express();

app.use(body_parser.json({limit: '50mb'}));
app.use(body_parser.urlencoded({extended: true, limit: '50mb'}));

app.use('/', routes);

app.listen(3000, function () {
    console.log("Node server running on port 3000")
});

module.exports = app;
