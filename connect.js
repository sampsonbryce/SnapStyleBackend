
var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : 'snapstyledatabase.cq8hu1db1bzh.us-west-2.rds.amazonaws.com',
user     : 'sampsonbryce',
password : 'Santacruz1',
database : 'snapstyle'
});

var app = express();

connection.connect(function(err){
    console.log("connecting");
        if(!err) {
        console.log("Database is connected ... nn");
        } else {
        console.log("Error connecting database ... " + err);
        }
});

