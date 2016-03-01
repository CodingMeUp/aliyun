var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testuser');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username    :  String,
    password    :  String,
    area        :  String,
    regDate     :  String,
    orgPwd      :  String,
    userAgent   :  String
});

var User = mongoose.model('user', userSchema,'user');
module.exports = User;