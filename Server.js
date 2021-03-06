var express = require("express");
var mysql = require("mysql");
var body_parser = require('body-parser');
var routes = require('./routes/routes.js');
var stormpath = require('express-stormpath');

var app = express();

app.use(body_parser.json({limit: '50mb'}));
app.use(body_parser.urlencoded({extended: true, limit: '50mb'}));
app.use('/', routes);
app.get('/stormpath', stormpath.loginRequired, function(req, res){
    console.log("USERS", req.user);
});
app.use(stormpath.init(app, {
    web: {
        register: {
            nextUri: '/add_user'
        }
    }
}
));

app.on('stormpath.ready', function () {
    app.listen(3000, function () {
        console.log("Node server running on port 3000")
    });
});

module.exports = app;
