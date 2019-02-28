'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const teamSchema = mongoose.Schema({
    members: {
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joiners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    sport: String,
    rules: String,
    title: String,
    membersLimit: Number,
    description: String,
    address: String,
    location: {
        lat: Number,
        long: Number
    }
    // gameDate: { type: Date, default: Date.now },
    // created: { type: Date, default: Date.now }
});

var Teams = mongoose.model('Teams', teamSchema);

module.exports = {Teams};

