var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var peopleCount = new Schema({
    userAgent   :  String,
    IP          :  String,
    enterDate   :  String
});

var Count = mongoose.model('count', peopleCount,'count');
module.exports = Count;