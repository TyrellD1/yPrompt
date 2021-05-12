const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const axios = require('axios').default
const moment = require('moment')

const User = require('../models/users')
const Appt = require('../models/appt')

const { isLoggedIn } = require('../functions/middleware')

// Home Page
router.get('/y', catchAsync(async(req, res) => {
    if(req.user) {
        const currentUser = req.user
        const days =  [{}]
        for(let i = 0; i <= currentUser.availableDays; i++) {
            days.push(moment().add(i, 'days').format('dddd MMMM Do YYYY'))
        }
        console.log(days)
        if(currentUser.sameDay === 'no') {
        days.splice(1, 1)
        }
        days.splice(0, 1)
        const users = await User.find({})
        res.render('appts/home', { users, days })
        } else {
            const days = moment().format('dddd MMMM Do YYYY')
            const users = await User.find({})
            res.render('appts/home', { users, days })
        }
}))
//    

// Active Appointments
router.get('/appts', isLoggedIn, catchAsync(async(req, res) => {
    const appts = await Appt.find({})
    res.render('appts/appts', { appts })
}))
//

// Posts, Puts, Deletes

// Creates Appt
router.post('/createAppt', catchAsync(async(req, res) => {
    // const { apptTime, apptDate, apptLocation } = req.body;
    const appt = new Appt(req.body)
    await appt.save()
    req.flash('success', 'appt successfully scheduled')
    res.redirect('back')
}))
//

// Edits Appt
router.put('/editAppt/:id', catchAsync(async(req, res) =>{
    const { id } = req.params;
    const appt = await Appt.findByIdAndUpdate(id, req.body, { runValidators: true })
    req.flash('success', 'appt successfully updated')
    res.redirect('back')
}))
//

// Deletes Appt
router.delete('/deleteAppt/:id', catchAsync(async(req, res) =>{
    const { id } = req.params;
    const appt = await Appt.findByIdAndDelete(id)
    req.flash('success', 'appt successfully deleted')
    res.redirect('back')
}))
//

module.exports = router