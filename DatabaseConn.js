/**
 * Created by samps_000 on 2/27/2016.
 */
var creds = require('./_config.js');
var mysql = require("mysql");

//Database Credentials
var connection = mysql.createConnection(creds);

//Connect to Database
connection.connect(function (err) {
    console.log("connecting");
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... " + err);
    }
});

module.exports = connection;
