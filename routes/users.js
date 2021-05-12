const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const axios = require('axios').default

const User = require('../models/users')
const Appt = require('../models/appt')

const { isLoggedIn } = require('../functions/middleware')

// Register Route
router.get('/registerUser', (req, res) => {
    res.render('users/registerUser')
})
//

// Login Route
router.get('/login', (req, res) => {
    res.render('users/login')
})
//

// Posts, Puts, Deletes

// Register User Post
router.post('/newUser', catchAsync(async (req, res, next) => {
    const { username, companyName, password } = req.body;
    const user = new User({ username, companyName });
    const newUser = await User.register(user, password)
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to yPrompt');
        res.redirect('/y');
    })
}))
//

// Logout
router.post('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'goodbye!')
    res.redirect('/y')
})
//

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    try {
        req.flash('success', 'welcome back')
        res.redirect('/y')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('login')
    }
})
//

// Updates User
router.put('/user/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    user.availableTime = [  ]
    const { availableTime } = req.body;
    console.log(availableTime)
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { runValidators: true })
    req.flash('success', 'User Updated!')
    res.redirect(`/y`) 
}))
//

// Deletes User
router.delete('/user/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)
    res.redirect('/y') 
}))
//

module.exports = router;