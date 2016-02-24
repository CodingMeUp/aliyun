function showTime(){
  var today = new Date();
  var day;
  var date;
  if(today.getDay()==0) day = "星期日";
  if(today.getDay()==1) day = "星期一";
  if(today.getDay()==2) day = "星期二";
  if(today.getDay()==3) day = "星期三";
  if(today.getDay()==4) day = "星期四";
  if(today.getDay()==5) day = "星期五";
  if(today.getDay()==6) day = "星期六";
  var sec = today.getSeconds();
  var min = today.getMinutes();
  var hour = today.getHours();
  if (sec < 10)  sec = "0" + sec;
  if (min < 10)  min = "0" + min;
  if (hour < 10) hour = "0" + hour;
  date = (today.getFullYear()) + "年" + (today.getMonth() + 1 ) + "月" + today.getDate() + "日 " +
      day + " " + hour + ":" + min + ":" + sec;
  document.getElementById("time").innerHTML=date;
}

// 一个JS的通用函数，用来初始化这个上传文件插件控件的，
function initFileInput(ctrlName, uploadUrl) {
  var control = $('#' + ctrlName);

  control.fileinput({
    language: 'zh', //设置语言
    uploadUrl: uploadUrl, //上传的地址
    maxFileCount: 2,
    allowedFileExtensions : ['jpg', 'png','gif','docx','xls','xlsx','csv'], //后缀
    showUpload: true, //是否显示上传按钮
    showCaption: true,//是否显示标题
    browseClass: "btn btn-primary", //按钮样式
  });
}