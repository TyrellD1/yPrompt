const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const axios = require('axios').default

const User = require('./models/users')

// functions

const catchAsync = require('./functions/catchAsync')
const ExpressError = require('./functions/expressError')
const mongooseConnect = require('./functions/mongooseConnect')

const { isLoggedIn } = require('./functions/middleware')

//

// Routes

const apptRoutes = require('./routes/appt')
const userRoutes = require('./routes/users')

//

mongooseConnect()

app.set('views', path.join(__dirname, 'views')); // Connects to Views more effecively
app.set('models', path.join(__dirname, 'models')); // Connects to Models more effecively
app.set('view engine', 'ejs'); // Makes EJS Work

// Express Stuff

app.use(cookieParser('puppy'))
app.use(session({secret: 'pafs;lfj'}))
app.use(flash())

// Passport

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

//  Passport Serialize User

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Locals

app.use( catchAsync(async(req, res, next) => {
    if(req.user) {
        const user = req.user
        const userId = await user._id
        res.locals.currentUser = await User.findById(userId)
    } else if (!req.user) {
        res.locals.currentUser = req.user
    }
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
}))

//

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'))) // Serving css __dirname is best practice
app.use(express.urlencoded({ extended: true}))


// Imported Routes

app.use('/', apptRoutes)
app.use('/', userRoutes)

//

app.all('*', (req, res, next) => {
    next(new ExpressError(`Page Not Found ||| Lorem ipsum dolor sit amet consectetur
     adipisicing elit. Ad aperiam molestias sunt, asperiores omnis, 
     hic architecto cupiditate iure cumque expedita aspernatur explicabo! 
     Nemo, qui pariatur? Aspernatur molestiae cumque ad error.`, 404))
})

app.use(( err, req, res, next ) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "We've come accrosed an error!"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('App is listening!!!')
})