require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const DB_URL = process.env.DB_URL;

const db = mongoose.connect(DB_URL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('connected to db');
    })
    .catch(e => console.log('error connecting to db'));

/*
const newUser = new User({
    name: 'jack',
    email: 'jack@example.com',
    password: 'jack',
});

newUser.save()
    .then(d => console.log(d))
    .catch(e => console.log(e));
*/

User
.find({})
.then(r => {
    console.log(r);
    mongoose.connection.close();
});



