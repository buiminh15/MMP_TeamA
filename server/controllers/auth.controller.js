const User = require('../models/user.model'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/config')

exports.register = (req, res) => {
    // Check if email was provided
    if (!req.body.name) {
        res.json({ success: false, message: 'You must provide a name' }); // Return error
    }
    // Check if username was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'You must provide a email' }); // Return error
    }
    // Check if password was provided
    if (!req.body.password) {
        res.json({ success: false, message: 'You must provide a password' }); // Return error
    }


    // Create new user object and apply user input
    let user = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: req.body.password
    });
    // Save user to database
    user.save((err) => {
        // Check if error occured
        if (err && err.code === 11000) {
            // Check if error is an error indicating duplicate account
            res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
        }
        // Check if error is a validation rror
        if (err) {
            res.json({ success: false, message: err }); // Return any other error not already covered
        }
        if (err && err.errors) {
            // Check if validation error is in the email field
            if (err.errors.email) {
                res.json({ success: false, message: err.errors.email.message }); // Return error
            }
            // Check if validation error is in the username field
            if (err.errors.name) {
                res.json({ success: false, message: err.errors.name.message }); // Return error
            }
            // Check if validation error is in the password field
            if (err.errors.password) {
                res.json({ success: false, message: err.errors.password.message }); // Return error
            }

        } 
        res.status(201).json({ success: true, message: 'Acount registered!' }); // Return success
    });
}

exports.login = (req, res) => {
    // Check if username was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'No email was provided' }); // Return error
    }
    // Check if password was provided
    if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
    }
   
    // Check if username exists in database
    User.findOne({ email: req.body.email }, (err, user) => {
        // Check if error was found
        if (err) {
            res.json({ success: false, message: err }); // Return error
        }
        // Check if username was found
        if (!user) {
            res.json({ success: false, message: 'Username not found.' }); // Return error
        }
        const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
        // Check if password is a match
        if (!validPassword) {
            res.json({ success: false, message: 'Password invalid' }); // Return error
        }
        const token = jwt.sign({ userId: user._id }, config.SECRET_KEY, { expiresIn: config.LIFE_TIME_TOKEN }); // Create a token for client
        res.json({
            success: true,
            message: 'Success!',
            token: token,
            user: {
                username: user.name
            }
        }); // Return success and token to frontend
    });
}

exports.profile = (req, res) => {
    // Search for user in database
    console.log(req.decoded.userId)
    User.findOne({ _id: req.decoded.userId }).select('name email').exec((err, user) => {
        // Check if error connecting
        if (err) {
            res.json({ success: false, message: err }); // Return error
        }
        // Check if user was found in database
        if (!user) {
            res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        }
        res.status(200).json({ success: true, user: user }); // Return success, send user object to frontend for profile
    });
}