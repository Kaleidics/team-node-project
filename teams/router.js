'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Teams } = require('./models');
const { User } = require('../users/models');
const passport = require('passport');
const router = express.Router();
const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });

//make a new post
router.post('/', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.user.username);
    User.findOne({ username: req.user.username})
        .then(user => {
            console.log(user);
            Teams.create({
                members: {
                    creator: user._id,
                    joiners: []
                },
                sport: req.body.sport,
                title: req.body.title,
                membersLimit: req.body.membersLimit,
                description: req.body.description,
                location: {
                    latitude: req.body.location.latitude,
                    longitude: req.body.location.longitude
                }
                // gameDate: req.body.gameDate,
                // created: { type: Date, default: Date.now }
            })
            .then(team => {
                return res.status(201).json(team);
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({message: 'Internal server error'});
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({message: 'Internal server error'});
        });
});

module.exports = {router};