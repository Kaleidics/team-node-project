'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Teams } = require('./models');
const { User } = require('../users/models');
const passport = require('passport');
const router = express.Router();
const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });

//view all posts
router.get('/', (req, res) => {
    return Teams.find()
        .then(teams => res.status(200).json(teams))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.get('/:id', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.params.id);
    return Teams.find({'members.creator': req.params.id})
        .then(teams => res.status(200).json(teams))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.get('/post/:id', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.params.id);
    return Teams.findOne({_id: req.params.id})
        .then(teams => res.status(200).json(teams))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//make a new post
router.post('/', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.user.username);
    User.findOne({ username: req.user.username})
        .then(user => {
            console.log(req.body);
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
                    lat: req.body.location.lat,
                    long: req.body.location.long
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