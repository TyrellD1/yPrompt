const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appts = new Schema({
    first: {
        type: String,
        required: true,
    },
    last : {
        type: String
    },
    apptTime: {
        type: String,
        required: true,
    },
    apptDate: {
        type: String,
        required: true,
    },
    apptLocation: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    }
})

const Appt = mongoose.model('Appt', appts)

module.exports = Appt;  