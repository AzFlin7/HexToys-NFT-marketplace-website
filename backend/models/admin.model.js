const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: false
    }, 
});

module.exports = mongoose.model('admins', AdminSchema);
