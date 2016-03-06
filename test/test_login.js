var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../Server.js');
var should = chai.should();
var connection = require('../DatabaseConn.js');


chai.use(chaiHttp);

describe('Testing login ->', function () {
    before(populateDatabase);
    it('should login', testLogin);
});

function populateDatabase(done) {
    var name = "John Doe";
    var username = "johnthedon";
    var email = "johndoe@aol.com";
    var password = "secretword";

    connection.query('SELECT * FROM users WHERE email=? AND password=?', [email, password],
        function (err, rows) {
            console.log("Rows: " + rows);
            if (!err) {
                if (rows == undefined || rows.length < 1) {
                    connection.query('INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?, DEFAULT)', [email, name, username, password],
                        function (err, rows, fields) {
                            if (err) {
                                console.log("Could not populate database");
                            }
                        });
                }
            }
            else {
                console.log("Problem checking if John Doe is a member yet. " + err);
            }
            done();
        });
}

function testLogin(done) {
    chai.request(server)
        .get('/login')
        .send({"Email": "johndoe@aol.com", "Pass": "secretword"})
        .end(function (err, res) {
            res.should.have.status(200);
            done();
        });
}


