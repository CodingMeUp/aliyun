/**
 * Created by Administrator on 2015/12/30.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var fs = require('fs');
var multer = require ('multer');//上传控件
var uploadMulter = multer({dest: './public/images/userImage'});
var xlsx = require('xlsx');   // 读取Excel 风格
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




//做主页
router.get('/index', function(req, res, next) {
  res.render('home', {
    'title'            :         '首页',
    'tips'             :         '系统主页',
    'user_name'        :         req.session.user_name
  });
});
//做主页页面测试
router.post('/page', function(req, res, next) {
  res.render('hometest', {
    'title'            :         '首页',
    'tips'             :         '系统主页',
    'user_name'        :         req.session.user_name
  });
});

//上传页面
router.get('/upload', function (req, res, next) {
  User.find({}, '-_id username regDate area', function (err, docs) {
    if (err) {
      console.log("出错了");
    }else{
      res.render('upload', {
        'title'            :         '上传首页',
        'jsonData'         :          docs
      });
    }
  });
});

//游戏页面
router.get('/game', function (req, res, next) {
      res.render('game', {
        'title'            :         '游戏首页',
      });
});

//上传接受文件
router.post('/uploadAction',  uploadMulter, function(req, res) {
  console.log('上传按钮调用');
  var json = {};
  var mimetype = req.files.upfile.mimetype;
  if (mimetype.indexOf('image') >= 0) {
    json.newname = req.files.upfile.name;
    json.type = 'image';
    json.success = 'true';
  }else if (mimetype.indexOf('sheet') >= 0){
    json.path = req.files.upfile.path;
    json.type = 'excel';
    json.success = 'true';
  }

  res.json(json);
});


//excel Ajax
router.post('/excelPostAjax',function(req, res) {
  var jsonData = {};
  var allSheets = new Array();
  var sheetNames = new Array();
  var sheetContent = new Array();
  path = req.body.path;

  //如果简单只取文件 使用 node-xlsx 就好  复杂的 就用 xlsx
  //var list = require("node-xlsx").parse(path);
  //console.log(list[0].data);
//////读出
//  var xlsx=require('node-xlsx');
//  var obj = xlsx.parse('fs.xlsx');
//  //第一个工作表的数据
//  var data = obj.worksheets[0].data;
//  //列数
//  var maxCol = obj.worksheets[0].maxCol;
//  //行数
//  var maxRow = obj.worksheets[0].maxRow;
//  for(var i=0;i<maxRow;i++) {
//    console.log("第"+(i+1)+"行的数据：");
//    for(var j=0;j<maxCol;j++) {
//      console.log(data[i][j].value);
//    }
//  }

  var excelFile = xlsx.readFile(path);
  var sheets = excelFile.Sheets;
  for(var s in sheets){
    sheetNames.push(s);
    sheetContent.push(sheets[s]);
  }
  jsonData.sheetNames = sheetNames;
  jsonData.sheetContent = sheetContent;
  res.json(jsonData);
});



//导出页面
router.get('/excelExport', function (req, res, next) {
  User.find({}, '-_id username regDate area', function (err, docs) {
    if (err) {
      console.log("出错了");
    } else {
      console.log(docs);
      var userName = ['用户名'];
      var userArea = ['用户地址'];
      var userDate = ['用户注册时间'];
      for(var  i = 0 ; i<docs.length;i++)
      {
        userName.push(docs[i].username);
        userArea.push(docs[i].area);
        userDate.push(docs[i].regDate);
      }
        var node_xlsx = require('node-xlsx');
        var obj = [{    //原来 name(sheetNames)  和 data（sheets） 是写死的  网上很多node-xlsx 都不符合规范都帖上来
          'name':'我',
          "data":[
                  ["索引1","索引2","c"],
                  ['第一','第二','第三']
                 ]
        },{
          'name':'你',
          "data":[
            ["sdf引1","ff引2","c"],
            ['ffdaf','fff二','dd三']
          ]
        },{
          'name':'用户',
          "data":[
            userName,
            userArea,
            userDate
          ]
        }];
      var fileBuf = node_xlsx.build(obj);
      fs.writeFile('usddfser.xlsx', fileBuf, 'binary',function callback(err){
          console.log(err);
      });
    }
  });
});
module.exports = router;