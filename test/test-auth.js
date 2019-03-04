'use strict';
global.DATABASE_URL = 'mongodb://localhost/team-finder-app';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Auth endpoints', function () {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function () {
        return runServer();
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

   

    
});
