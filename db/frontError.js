var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testuser');

var Schema = mongoose.Schema;

var errorSchema = new Schema({
    errorData   :  Schema.Types.Mixed,
    userAgent   :  String,
    IP          :  String,
    errorDate   :  String
});

var Error = mongoose.model('front_error', errorSchema,'front_error');
module.exports = Error;