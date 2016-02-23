var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
host     : 'snapstyledatabase.cq8hu1db1bzh.us-west-2.rds.amazonaws.com',
user     : 'sampsonbryce',
password : 'Santacruz1',
database : 'snapstyle'
});
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

connection.connect(function(err){
    console.log("connecting");
        if(!err) {
        console.log("Database is connected ... nn");
        } else {
        console.log("Error connecting database ... " + err);
        }
        });

app.get("/",function(req,res){
        console.log("querying");
        connection.query('SELECT * FROM users',
            function(err, rows, fields) {
            if (!err){
                console.log('Request Completed');
                res.writeHead(200, {'content-type':'application/json'});
                res.write(JSON.stringify(rows));
                res.end();
            }
            else
                console.log('Error while performing Query. ' + err);
            });
        });

app.post("/create_account",function(req,res){
    console.log("querying");
    var name = req.body.Name;
    var email = req.body.Email;
    var username = req.body.Uname;
    var password = req.body.Pass;


    connection.query('INSERT INTO users VALUES (id, ?, ?, ?, ?, date_created)', [ name, email, username, password ],
            function(err, rows, fields) {
            if (!err){
                console.log('Account Created');
                res.writeHead(200, {'content-type':'application/json'});
                res.write(JSON.stringify(rows));
                res.end();
            }
            else
                console.log('Error while performing Query. ' + err);
            });
        });

app.listen(3000)
