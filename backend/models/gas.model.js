const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GasSchema = new Schema({    
    timestamp: Number,
    total: Number 
});

module.exports = mongoose.model('gases', GasSchema);
