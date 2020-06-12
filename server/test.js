const mongoose = require('mongoose');
const uriMongo = 'mongodb+srv://teama:1234@cluster0-jj3mr.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(uriMongo, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MongoDB connection open!');
});

module.exports = mongoose;