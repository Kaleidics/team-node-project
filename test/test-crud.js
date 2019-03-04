'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

const post = {
    sport: 'sport',
                rules: 'rules',
                title: 'title',
                membersLimit: 12,
                description: 'description',
                address: 'address',
                location: {
                    lat: 75,
                    long: 75
                }
}

describe('CRUD operations', function () {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password,
                firstName,
                lastName
            })
        );
    });

    afterEach(function () {
        return User.remove({});
    });

    it('Should let you see everyones posts', function() {
        return chai
            .request(app)
            .get('/api/teams/')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
            });
    });

    it('Should fail if not valid token', function() {
        return chai
            .request(app)
            .post('/api/teams')
            .set('Authorization', '')
            .send(post)
            .then(res => {
                expect(res).to.have.status(401);
            });
    });
});