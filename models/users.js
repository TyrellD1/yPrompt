const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
// const Post = require('../models/posts')

const users = new Schema({
    username: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    availableTime: [{
        type: String,
    }],
    availableDays: {
        type: Number,
    },
    sameDay: {
        type: String,
    },
})

users.plugin(passportLocalMongoose)

const User = mongoose.model('User', users)

module.exports = User;