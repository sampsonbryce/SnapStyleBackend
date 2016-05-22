var express = require('express');
var router = express.Router();
var connection = require('../DatabaseConn.js');
var stormpath = require('express-stormpath');
var squel = require('squel');
var util = require('util');

router.get('/', returnAllUsers);
router.get('/add_user', stormpath.loginRequired, addUser);
router.post('/post', stormpath.loginRequired, post);
router.get('/get_feed', stormpath.loginRequired, returnFeed);
router.post('/yes_clicked', stormpath.loginRequired, yesPost);

var apiKey = process.env.STORMPATH_CLIENT_API_ID;


function returnAllUsers(req, res) {
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

function yesPost(req, res) {
    console.log('adding yes');
    var post_id = req.body.post_id;
    var query = squel.update()
            .table('posts', 'p')
            .set('p.yes_count = p.yes_count + 1')
            .where(util.format('p.id = %s', post_id))
            .toString();
    console.log(query);
    connection.query(query,
        function (err, rows, fields) {
            if (!err) {
                res.writeHead(200);
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

function returnFeed(req, res) {
    connection.query('SELECT posts.id AS post_id, users.id, first_name, last_name, posts.user_id, description, location, image, date_created, email, posts.tips_count, posts.yes_count FROM posts ' +
        'INNER JOIN users ON users.id = posts.user_id ' +
        'INNER JOIN photos ON photos.id = posts.photo_id ' +
        'WHERE users.email = ? ORDER BY date_created DESC', [req.user.email],
        function (err, rows, fields) {
            if (!err) {
                console.log('Request Completed');
                res.writeHead(200, {'content-type': 'application/json'});
                console.log(rows[0].date_created);
                res.write(JSON.stringify(rows));
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


function addUser(req, res) {
    var email = req.user.email;
    var first_name = req.user.givenName;
    var last_name = req.user.surname;
    if (email == undefined) {
        console.log("Error getting values for query");
        res.writeHead(500);
        res.write("A json value is undefined");
        res.end();
    }
    else {
        //check email or username exists
        connection.query('SELECT * FROM users WHERE email=?', [email],
            function (err, rows, fields) {
                if (!err) {
                    //insert if none already exist in database
                    if (!rows.length) {
                        connection.query('INSERT INTO users VALUES (DEFAULT, ?, ?, ?, NULL)', [email, first_name, last_name],
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
    var img = req.body.image;
    var desc = req.body.desc;
    var location = req.body.location;
    //get user id
    var user_id = null;
    connection.query("Select id from users WHERE users.email = ?", [req.user.email],
        function (err, rows, fields) {
            if (err) {
                res.writeHead(500);
                res.write("Error while getting user id");
                console.log('Error while getting user id. ' + err);
                res.end();
            }
            else {
                user_id = rows[0].id;

                //insert photo
                var photo_id = null;
                connection.query("INSERT INTO photos VALUES (DEFAULT, ?, ?)", [user_id, img],
                    function (err, rows, fields) {
                        if (err) {
                            res.writeHead(500);
                            res.write("Error while getting user id");
                            console.log('Error while getting user id. ' + err);
                            res.end();
                        }
                        else {
                            photo_id = rows.insertId;

                            if (photo_id != null) {
                                connection.query("INSERT INTO posts VALUES (DEFAULT, ?, ?, ?, DEFAULT, ?, DEFAULT, DEFAULT)", [user_id, desc, location, photo_id],
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
                    });
            }
        });
}

module.exports = router;

