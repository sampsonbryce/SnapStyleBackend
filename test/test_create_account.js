var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../Server.js');
var should = chai.should();
var connection = require('../DatabaseConn.js');


chai.use(chaiHttp);

describe('Testing Create Account ->', function () {
    before(clearDatabase);
    after(clearDatabase);
    it('should create account', testCreateAccount);
    it('should fail to create duplicate', testCreateAccountDuplicate);
    it('should fail create account from invalid values', testInvalidCreateAccountValues);
    it('should return all users', testUsers);
});


function clearDatabase(done) {
    connection.query("DELETE from users", function (err, rows, fields) {
        if (!err) {
            console.log("deleted");
        }
    });
    done();
}

function testUsers(done) {
    chai.request(server)
        .get('/')
        .end(function (err, res) {
            res.should.have.status(200);
            res.body[0].should.have.property('id');
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('email');
            res.body[0].should.have.property('username');
            res.body[0].should.have.property('password');
            res.body[0].should.have.property('date_created');
            done();
        });
}
function testCreateAccount(done) {
    console.log("first request");
    chai.request(server)
        .post('/create_account')
        .send({"Name": "John Doe", "Email": "johndoe@aol.com", "Uname": "johnthedon", "Pass": "secretword"})
        .end(function (err, res) {
            res.should.have.status(200);
            done();
        });
}

function testCreateAccountDuplicate(done) {
    console.log("second request");
    chai.request(server)
        .post('/create_account')
        .send({"Name": "John Doe", "Email": "johndoe@aol.com", "Uname": "johnthedon", "Pass": "secretword"})
        .end(function (err, res) {
            res.should.have.status(406);
            done();
        });
}

function testInvalidCreateAccountValues(done) {
    chai.request(server)
        .post('/create_account')
        .end(function (err, res) {
            res.should.have.status(500);
            done()
        });
}
