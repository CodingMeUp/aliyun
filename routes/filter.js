/**
 * Created by Administrator on 2015/12/30.
 */
var express = require('express');
var router = express.Router();
var User = require('./../db/user_schema.js');

router.all('/home/*', function (req, res, next) {
  //res.locals.contextPath= "/";
console.log('过滤器使用');
  if (req.session.user_name == null) {
    console.log("session User_name为空");
    if (req.signedCookies.remember == '1') {      // 加密的COOkie用 req.signedCookies.username
      var query = {username: req.signedCookies.uname, password: req.signedCookies.encryPwd};
      console.log("一周免登录");
      User.count(query, function (err, doc) {  //COOKIE中的用户和密码 还要到MONgo再次校验
        if (doc == 1) {
          req.session.user_name = query.username;
          next();
        } else {
          res.redirect('/loginOut');
        }
      });
    } else {
      res.redirect('/loginOut');
    }
  } else {
    next();
  }
});

module.exports = router;