const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
    id: {type: Number, index: true},
    timestamp: { type: Number, required: true, default: 1 }, 
});

module.exports = mongoose.model('settings', SettingSchema);
