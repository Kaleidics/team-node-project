// 'use strict';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const jwt = require('jsonwebtoken');

// const { app, runServer, closeServer } = require('../server');
// const { User } = require('../users');
// const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('Auth endpoints', function () {
//     const username = 'exampleUser';
//     const password = 'examplePass';
//     const firstName = 'Example';
//     const lastName = 'User';

//     before(function () {
//         return runServer(TEST_DATABASE_URL);
//     });

//     after(function () {
//         return closeServer();
//     });

//     beforeEach(function () {
//         return User.hashPassword(password).then(password =>
//             User.create({
//                 username,
//                 password,
//                 firstName,
//                 lastName
//             })
//         );
//     });

//     afterEach(function () {
//         return User.remove({});
//     });

//     it('Logging in should return a valid auth token', function() {
//         return chai
//             .request(app)
//             .post('/api/auth/login')
//             .send({ username, password })
//             .then(res => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 const token = res.body.authtoken;
//                 expect(token).to.be.a('string');
//                 const payload = jwt.verify(token, JWT_SECRET, {
//                     algorithm: ['HS256']
//                 });
//                 expect(payload.user).to.deep.equal({
//                     username,
//                     firstName,
//                     lastName
//                 });
//             });
//     });

//     it('Signing up should add a new instance to the database', function() {
//         return chai
//             .request(app)
//             .post('/api/users/register')
//             .send({ username: 'mochatest', password: '123456', firstName: 'test', lastName: 'test'})
//             .then(res => {
//                 expect(res).to.have.status(201);
//                 expect(res.body).to.be.an('object');
//                 expect(res.body).to.deep.equal({
//                     username: 'mochatest',
//                     firstName: 'test',
//                     lastName: 'test'
//                 });
//             });
//     });
// });