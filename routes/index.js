var express = require('express');
var moment = require ('moment');//日期转换控件
var router = express.Router();
var crypto = require('crypto');
var User = require('./../db/user_schema.js');
//加密
function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}
//解密
function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}


//访问根 直接转到登录页面
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express'});
  res.redirect('userLogin');
});

//访问登录页
router.get('/userLogin', function(req, res, next) {
  res.render('login', {
        'title'        :         '登录页面'
      });
});

//做注册功能
router.get('/register', function(req, res, next) {
  res.render('register', { title: '注册页面'});
});
router.post('/register/regAction/', function(req, res, next) {
    var jsonData = {};
    var uname = req.body.username.trim();
    var query = {username: uname};
    User.count(query, function (err, doc) {
      if (doc == 1) {
          jsonData.regFlag = 'false';
          jsonData.message = '已存在同名账户';
      }else{
          var pwd = req.body.password;
          var dbData = new User({
             username     :     uname,
             password     :     encrypt(pwd,'chenyunong-secret'), //加密后
             orgPwd       :     pwd,
             area         :     req.body.area,
             regDate      :     moment().format("YYYY-MM-DD HH:mm:ss"),
             userAgent    :     req.body.userAgent
          });
          User.create(dbData,function(err){
            if(err){
             jsonData.regFlag = 'false';
             jsonData.message = '数据库有问题';
            }else{
             jsonData.regFlag = 'true';
            }
          });
       }
      res.json(jsonData);
    });
});

//做登录转发
router.post('/loginAction/', function(req, res, next) {
  var uname = req.body.username.trim();
  var pwd = req.body.password;
  var encryPwd = encrypt(pwd,'chenyunong-secret'); //加密后
 // var decryPwd = decrypt(encryPwd,'chenyunong-secret'); //解密后
  var query = {username: uname, password: encryPwd};
  User.count(query, function (err, doc) {
    if (doc == 1) {
      req.session.user_name = query.username;
      var checked = req.body.checkbox;
      if (checked == 1) {
        res.cookie('remember', '1', {maxAge:1*7*24*60*60*1000, httpOnly: true,signed:true});
        res.cookie('uname', uname,  {maxAge:1*7*24*60*60*1000, httpOnly: true,signed:true});
        res.cookie('encryPwd', encryPwd,  {maxAge:1*7*24*60*60*1000, httpOnly: true,signed:true});
      } else {
        res.cookie('remember', '0', {maxAge:1*7*24*60*60*1000, httpOnly: true,signed:true});
      }
      res.redirect('home/index');
    } else {
      res.render('login', { title: '登录页面'});
    }
  });
});

//注销退出
router.get('/loginOut', function(req, res, next) {
  res.clearCookie('remember');   //清除cookie 免登录的
  res.clearCookie('uname');     //清除cookie 免登录的
  res.clearCookie('encryPwd');   //清除cookie 免登录的
  req.session.destroy();        //清除session
  res.render('login', {
    'title'            :         '登录页面'
  });
});

module.exports = router;
