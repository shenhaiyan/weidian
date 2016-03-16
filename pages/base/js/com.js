// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Framework7.$;
var myApp = new Framework7({
    precompileTemplates: true, // �Ƿ��Զ��������е� Template7 ģ��
    swipeBackPage: true
});


// Add view
var mainView = myApp.addView('.view-main', {
    preloadPreviousPage: true, //��/�ر�Ԥ������һҳ
    dynamicNavbar: true, //�ڵ�ǰView���Ƿ�ʹ�ö�̬������
    modalButtonOk : "ȷ��" , //ȷ����ť��Ĭ���İ�
    modalButtonCancel : "ȡ��",//ȡ����ť��Ĭ���İ�
    domCache: true , //�������Ϊtrue����������һ����ҳ�涼�����DOM�б�ɾ��
    activeState : false , //�����������ʱ�������ǰ�����Ԫ������һ�� 'active-state' class
    modalCloseByOutside : true //���modal(Alert, Confirm, Prompt)����ر�����
});


//��ȡ��ַ������
//function GetQueryString(name) {
//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//    var r = window.location.search.substr(1).match(reg);
//    if (r != null) return unescape(r[2]);
//    return null;
//}



//��ȡ����·��
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



//�鿴�ƶ��豸��Ϣ
var device = Framework7.prototype.device;
//if (device.iphone) {
//    console.log('this is iPhone')
//}
console.log("android:"+device.android+
        "   " +
        "ios:"+device.ios+
        "   " +
    "����ϵͳ�汾��"+device.osVersion

);

//������¼ҳ��

$$('.wdPanel').on('click', function () {
    myApp.confirm('��Ҫ�˳���¼��?','�˳���¼', function () {
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

//��¼
$$('#btnLogin').on('click',function(){
    var userId = $$('#userName').val();
    var userPw = $$('#userPwd').val();
    if(!userId){
        myApp.alert("�������˺�",'��ʾ');
        return false;
    }
    if(!userPw){
        myApp.alert("����������",'��ʾ');
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
            myApp.alert('δ֪����','΢���¼����');
        },
        success:function(data){
            myApp.hideIndicator();
            data = JSON.parse(data);
            if(data.rc == -1){
                myApp.alert(data.msg,'΢���¼����');
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
                        myApp.alert('δ֪����','����');
                    },
                    success: function (data) {
                        myApp.hideIndicator();
                        data = JSON.parse(data);
                        if(data.rc == -1){
                            myApp.alert(data.msg,'����');
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

//���ش������ѱ�������ݣ���Ϊ��¼״̬
if(token){
    $$('#userName').val(localStorage.userID);
    $$('#userPwd').val(localStorage.userID);
    headersInfo = {"userID":localStorage.userID,"token":localStorage.token};
}

//����״̬�ж�
Template7.registerHelper('rdStaHelper', function (orderstatus){
    if(orderstatus == "1110"){
        return "������";
    }else if(orderstatus == "1100"){
        return "��ȷ��";
    }else if(orderstatus == "1120"){
        return "�ѷ���";
    }else if(orderstatus == "1160"){
        return "����ȡ��";
    }else if(orderstatus == "1130"){
        return "��ǩ��";
    }
});

//��������
Template7.registerHelper('payTypeHelper', function (payType){
    if(payType == "0"){
        return "����֧��";
    }else if(payType == "1"){
        return "��������";
    }
});

//�۸��Է�Ϊ��λ
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



//�ж�TOKEN�Ƿ����
$$(document).on('ajaxSuccess',function(data){
    var temp = JSON.parse(data.detail.xhr.responseText);
    var rc = temp.rc;
    var msg = temp.msg;
    if(rc == -2){
        myApp.confirm('���µ�¼', msg, function () {
            myApp.loginScreen();
        });
    }
});