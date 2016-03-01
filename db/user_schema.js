var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username    :  String,
    password    :  String,
    area        :  String,
    regDate     :  String,
    orgPwd      :  String,
    userAgent   :  String,
    IP          :  String
});

var User = mongoose.model('user', userSchema,'user');
module.exports = User;