var express = require('express');
var router = express.Router();
var connection = require('../DatabaseConn.js');
var stormpath = require('express-stormpath');

router.get('/', returnAllUsers);
router.get('/add_user', stormpath.loginRequired, addUser);
router.post('/post', stormpath.loginRequired, post);
router.post('/get_feed', stormpath.loginRequired, returnFeed);

var apiKey = process.env.STORMPATH_CLIENT_API_ID;


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

function returnFeed(req, res) {
    console.log("returning feed");
    console.log(req.user);
}


function addUser(req, res) {
    console.log("Getting Values");
    console.log("USER", req.user);
    email = req.user.email;
    console.log(email);
    if (email == undefined) {
        console.log("Error getting values for query");
        res.writeHead(500);
        res.write("A json value is undefined");
        res.end();
    }
    else {
        console.log("querying");
        //check email or username exists
        connection.query('SELECT * FROM users WHERE email=?', [email],
            function (err, rows, fields) {
                if (!err) {
                    //insert if none already exist in database
                    if (!rows.length) {
                        connection.query('INSERT INTO users VALUES (DEFAULT, ?)', [email],
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

function post(req, res) {
    console.log("POSTING");
    var img = req.body.image;
    var desc = req.body.desc;
    console.log("Image", img);
    console.log("Desc", desc);
    if (img) {
        connection.query("INSERT INTO posts VALUES (DEFAULT, 1, ?, DEFAULT, ?)", [desc, img],
            function (err, rows, fields) {
                if (err) {
                    res.writeHead(500);
                    res.write("Error while inserting post");
                    console.log('Error while inserting post. ' + err);
                    res.end();
                }
                else {
                    res.writeHead(200);
                    res.write("Sucess");
                    console.log('Sucess Inserting post.');
                    res.end();
                }
            });
    }
}

module.exports = router;

