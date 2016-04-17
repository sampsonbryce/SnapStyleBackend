var express = require('express');
var router = express.Router();
var connection = require('../DatabaseConn.js');

router.get('/', returnAllUsers);
router.post('/create_account', createAccount);
router.post('/login', login);


function returnAllUsers(req, res) {
    console.log("querying");
    connection.query('SELECT * FROM users',
        function (err, rows, fields) {
            if (!err) {
                console.log('Request Completed');
                res.writeHead(200, {'content-type': 'application/json'});
                res.write(JSON.stringify(rows));
                res.end();
            }
            else
                console.log('Error while performing Query. ' + err);
        });
}

function createAccount(req, res) {
    console.log("Getting Values");
    var name = req.body.Name;
    var email = req.body.Email;
    var username = req.body.Uname;
    var password = req.body.Pass;
    console.log(name, email, username, password);
    if (name == undefined || email == undefined || username == undefined || password == undefined) {
        console.log("Error getting values for query");
        res.writeHead(500);
        res.write("A json value is undefined");
        res.end();
    }
    else {

        console.log("querying");
        //check email or username exists

        connection.query('SELECT * FROM users WHERE email=? OR username=?', [email, username],
            function (err, rows, fields) {
                if (!err) {

                    //insert if none already exist in database
                    if (!rows.length) {
                        connection.query('INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?, DEFAULT)', [email, name, username, password],
                            function (err, rows, fields) {
                                if (!err) {
                                    console.log('Account Created');
                                    res.writeHead(200);
                                    res.write("Account Logged in Database");
                                    res.end();
                                }
                                else {
                                    console.log('Error while performing Query. ' + err);
                                    res.writeHead(500);
                                    res.write("Error while performing query");
                                    res.end();
                                }
                            });
                    }
                    else {
                        console.log('Account already exists');
                        res.writeHead(406);
                        res.write("Invalid data: Account already exists");
                        res.end();
                    }
                }
                else {
                    console.log('Error while checking if account exists' + err);
                    res.writeHead(500);
                    res.write("Error checking if account exists query");
                    res.end();
                }
            });
    }
}

function login(req, res) {
    console.log("IN LOGIN");
    var email = req.body.Email;
    var password = req.body.Pass;
    console.log(email, password);
    if (email == undefined || password == undefined) {
        console.log("Error getting values for query");
        res.writeHead(500);
        res.write("A json value is undefined");
        res.end();
    }
    else {
        connection.query('SELECT * FROM users WHERE email=? AND password=?', [email, password],
            function (err, rows, fields) {
                console.log(rows);
                if (!err) {
                    if (rows.length) {
                        res.writeHead(200);
                        res.write("Account Exists");
                        console.log('Account Exists');
                        res.end();
                    }
                    else
                    {
                        res.writeHead(406);
                        res.write("Account Does Not Exist");
                        console.log("Account Does Not Exist");
                        res.end();
                    }
                }
                else {
                    res.writeHead(500);
                    res.write("Error while performing query");
                    console.log('Error while performing Query. ' + err);
                    res.end();
                }
            });
    }
}


module.exports = router;

