// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Framework7.$;
var myApp = new Framework7({
    precompileTemplates: true, // 是否自动编译所有的 Template7 模板
    swipeBackPage: true
});


// Add view
var mainView = myApp.addView('.view-main', {
    preloadPreviousPage: true, //打开/关闭预加载下一页
    dynamicNavbar: true, //在当前View中是否使用动态导航栏
    modalButtonOk : "确认" , //确定按钮的默认文案
    modalButtonCancel : "取消",//取消按钮的默认文案
    domCache: true , //如果设置为true，则所有上一步的页面都不会从DOM中被删除
    activeState : false , //启用这个设置时，会给当前点击的元素增加一个 'active-state' class
    modalCloseByOutside : true //点击modal(Alert, Confirm, Prompt)外面关闭她。
});


//获取地址栏参数
//function GetQueryString(name) {
//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//    var r = window.location.search.substr(1).match(reg);
//    if (r != null) return unescape(r[2]);
//    return null;
//}



//获取虚拟路径
function getIPAndVirulPath(){
    var hostPort=document.location.host;
    //var strFullPath=window.document.location.href;
    var strPath=window.document.location.pathname;
    //var pos=strFullPath.indexOf(strPath);
    //var prePath=strFullPath.substring(0,pos);
    var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
    //alert(strFullPath+"."+strPath+"."+pos+"."+prePath+"."+postPath);
    return 'http://'+hostPort+postPath;
}



//查看移动设备信息
var device = Framework7.prototype.device;
//if (device.iphone) {
//    console.log('this is iPhone')
//}
console.log("android:"+device.android+
        "   " +
        "ios:"+device.ios+
        "   " +
    "操作系统版本号"+device.osVersion

);

//弹出登录页面

$$('.wdPanel').on('click', function () {
    myApp.confirm('你要退出登录吗?','退出登录', function () {
        localStorage.removeItem("userID");
        localStorage.removeItem("token");
        localStorage.removeItem("comID");
        localStorage.removeItem("userName");
        //$$('#userName').val("");
        //$$('#userPwd').val("");
        myApp.loginScreen();
    },function(){
        myApp.closePanel();
    });
});
var headersInfo = "";
window.token = localStorage.token;

//登录
$$('#btnLogin').on('click',function(){
    var userId = $$('#userName').val();
    var userPw = $$('#userPwd').val();
    if(!userId){
        myApp.alert("请输入账号",'提示');
        return false;
    }
    if(!userPw){
        myApp.alert("请输入密码",'提示');
        return false;
    }
    userInfo = {userID:userId,password:userPw};
    myApp.showIndicator();
    $$.ajax({
        url: getIPAndVirulPath()+'/appentrance/entrance/entry.action',
        method:'POST',
        cache:false,
        data: userInfo,
        complete:function(){

        },
        error:function(){
            myApp.alert('未知错误','微店登录提醒');
        },
        success:function(data){
            myApp.hideIndicator();
            data = JSON.parse(data);
            if(data.rc == -1){
                myApp.alert(data.msg,'微店登录提醒');
            }
            if(data.rc == 0){
                for (key in data.data) {
                    val = data.data[key];
                    window.localStorage[key] = val;
                }
                headersInfo = {"userID":localStorage.userID,"token":localStorage.token};
                myApp.closeModal(".login-screen");
                myApp.showIndicator();
                $$('.weiDianUserName').html(localStorage.userName);
                $$.ajax({
                    url: getIPAndVirulPath()+'/app/order/showOrderNum.action',
                    method: 'POST',
                    cache: false,
                    headers: headersInfo,
                    data: {"comID": localStorage.comID},
                    error:function(){
                        myApp.alert('未知错误','提醒');
                    },
                    success: function (data) {
                        myApp.hideIndicator();
                        data = JSON.parse(data);
                        if(data.rc == -1){
                            myApp.alert(data.msg,'提醒');
                        }
                        if(data.rc == 0) {
                            $$('.indexShowNum').html(data.data.underwaynum);
                        }

                    }
                });

            }
        }
    });

});

//本地储存有已保存的数据，已为登录状态
if(token){
    $$('#userName').val(localStorage.userID);
    $$('#userPwd').val(localStorage.userID);
    headersInfo = {"userID":localStorage.userID,"token":localStorage.token};
}

//订单状态判断
Template7.registerHelper('rdStaHelper', function (orderstatus){
    if(orderstatus == "1110"){
        return "待发货";
    }else if(orderstatus == "1100"){
        return "待确认";
    }else if(orderstatus == "1120"){
        return "已发货";
    }else if(orderstatus == "1160"){
        return "交易取消";
    }else if(orderstatus == "1130"){
        return "已签收";
    }
});

//订单类型
Template7.registerHelper('payTypeHelper', function (payType){
    if(payType == "0"){
        return "在线支付";
    }else if(payType == "1"){
        return "货到付款";
    }
});

//价格以分为单位
Template7.registerHelper('fyHelper', function (obj){
    var type = typeof obj;
    if(type == "number"){
        obj = parseInt(obj) + "";
    }else if(type != "string"){
        return false;
    }
    if(obj.length==1){
        return "0.0" + obj;
    }else if(obj.length==2){
        return "0." + obj;
    }else{
        var tmp_pre = obj.substr(0,obj.length-2);
        var tmp_suf = obj.substr(obj.length-2);
        return tmp_pre + "." + tmp_suf;
    }
});
function fen_to_yuan(obj){
    var type = typeof obj;
    if(type == "number"){
        obj = parseInt(obj) + "";
    }else if(type != "string"){
        return false;
    }
    if(obj.length==1){
        return "0.0" + obj;
    }else if(obj.length==2){
        return "0." + obj;
    }else{
        var tmp_pre = obj.substr(0,obj.length-2);
        var tmp_suf = obj.substr(obj.length-2);
        return tmp_pre + "." + tmp_suf;
    }
}

function goback(){
    console.log(mainView.activePage);
    var pageName = mainView.activePage.name;
    mainView.router.back();
    if(pageName == 'appIndex'){
        if(window.mall_app != undefined){
            window.mall_app.exit();
        }
    }
}



//判断TOKEN是否过期
$$(document).on('ajaxSuccess',function(data){
    var temp = JSON.parse(data.detail.xhr.responseText);
    var rc = temp.rc;
    var msg = temp.msg;
    if(rc == -2){
        myApp.confirm('重新登录', msg, function () {
            myApp.loginScreen();
        });
    }
});