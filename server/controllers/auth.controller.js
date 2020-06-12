const User = require('../models/user.model'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/config')
const sendmail = require('sendmail')();
const helper = require('../helpers/mail.helper')

exports.register = (req, res, next) => {
    // Check if email was provided
    if (!req.body.name) {
        res.json({ success: false, message: 'You must provide a name' }); // Return error
        return
    }
    // Check if username was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'You must provide a email' }); // Return error
        return
    }
    // Check if password was provided
    if (!req.body.password) {
        res.json({ success: false, message: 'You must provide a password' }); // Return error
        return
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
            return
        }
        // Check if error is a validation rror
        if (err) {
            res.json({ success: false, message: err }); // Return any other error not already covered
            return
        }
        if (err && err.errors) {
            // Check if validation error is in the email field
            if (err.errors.email) {
                res.json({ success: false, message: err.errors.email.message }); // Return error
                return
            }
            // Check if validation error is in the username field
            if (err.errors.name) {
                res.json({ success: false, message: err.errors.name.message }); // Return error
                return
            }
            // Check if validation error is in the password field
            if (err.errors.password) {
                res.json({ success: false, message: err.errors.password.message }); // Return error
                return
            }

        }

        if (!err) {
            sendmail({
                from: 'no-reply@yourdomain.com',
                to: 'risece2509@nedrk.com',
                subject: 'test sendmail',
                html: `${helper.registerMailReply}`,
            }, function (err, reply) {
                if (err)
                    res.json({ status: 'send mail fail' })
            });

            res.status(201).json({ success: true, message: 'Acount registered!' }); // Return success
        }
    });
}

exports.login = (req, res) => {
    // Check if username was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'No email was provided' }); // Return error
        return
    }
    // Check if password was provided
    if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
        return
    }

    // Check if username exists in database
    User.findOne({ email: req.body.email }, (err, user) => {
        // Check if error was found
        if (err) {
            res.json({ success: false, message: err }); // Return error
            return
        }
        // Check if username was found
        if (!user) {
            res.json({ success: false, message: 'Username not found.' }); // Return error
            return
        }
        const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
        // Check if password is a match
        if (!validPassword) {
            res.json({ success: false, message: 'Password invalid' }); // Return error
            return
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
    User.findOne({ _id: req.decoded.userId }).select('name email').exec((err, user) => {
        // Check if error connecting
        if (err) {
            res.json({ success: false, message: err }); // Return error
            return
        }
        // Check if user was found in database
        if (!user) {
            res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
            return
        }
        res.status(200).json({ success: true, user: user }); // Return success, send user object to frontend for profile
    });
}

exports.sendmail = (req, res) => {
    sendmail({
        from: 'no-reply@yourdomain.com',
        to: 'risece2509@nedrk.com',
        subject: 'test sendmail',
        html: 'Mail of test sendmail sex and the city',
    }, function (err, reply) {
        if (err)
            res.json({ status: 'send mail fail' })
    });
}