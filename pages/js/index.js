myApp.onPageInit('index', function (page) {
    if(!token){
        myApp.loginScreen();
    }
    if(token){
        myApp.showIndicator();
        $$('.weiDianUserName').html(localStorage.userName);
        $$.ajax({
            url: getIPAndVirulPath()+'/app/order/showOrderNum.action',
            method: 'POST',
            cache: false,
            headers: headersInfo,
            data: {"comID": localStorage.comID},
            error:function(){
                myApp.alert('Œ¥÷™¥ÌŒÛ','Ã·–—');
            },
            success: function (data) {
                myApp.hideIndicator();
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'Ã·–—');
                }
                if(data.rc == 0) {
                    $$('.indexShowNum').html(data.data.underwaynum);
                }
            }
        });
    }
}).trigger();

