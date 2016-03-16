myApp.onPageInit('order', function (page) {
    //导航条切换
    $$(".orderRow .button").on('click',function(){
       var lineIndex = $$(this).index();
        $$(".orderRowLine").transform('translate3d('+(lineIndex-0)*$$(".orderRow .button").width()+'px,0,0)').transition(500);
    });
    //获取进行中的订单数目&获取订单列表
    var sid = 1110;  //默认状态为待发货
    var pagesize = 5;  //返回的记录数
    var pageno = 1;
    var hasMoreData = true;
    myApp.showIndicator();
    $$(".orderBox").children("a").remove();
    $$(".noData").remove();
    getOrderData();
    function getOrderData(){
        $$.ajax({
            url: getIPAndVirulPath()+'/app/order/showOrders.action',
            method:'POST',
            cache:false,
            headers:headersInfo,
            data: {"comID":localStorage.comID,"pageno":pageno,"pagesize":pagesize,"orderstatus":sid},
            error:function(){
                myApp.alert('未知错误','提醒');
            },
            success:function(data){
                myApp.hideIndicator();
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'提醒');
                }
                if(data.rc == 0) {
                    if (data.data.totalrow == undefined) {
                        $$('.moreData').hide();
                    }
                    $$('.orderNum').html(data.data.underwaynum);
                    $$('#pay1').html(data.data.waitnum);
                    $$('#pay2').html(data.data.alreadynum);
                    //待发货
                    var template = $$("#orderList").html();
                    var compiledTemplate = Template7.compile(template);
                    $$("#orderListMain").append(compiledTemplate(data.data));
                }
            }
        });
    }

    $$('.buttons-row .button').on('click', function () {   //切换TAB传参orderstatus
        sid = $$(this).attr("id");
        console.log(sid);
        pageno = 1;
        $$(".orderBox").children("a").remove();
        $$(".noData").remove();
        myApp.showIndicator();
        $$('.moreData').html("点击加载订单");
        getOrder();
    });

    function getOrder(){
        $$.ajax({
            url: getIPAndVirulPath()+'/app/order/showOrders.action',
            method:'POST',
            cache:false,
            headers:headersInfo,
            data: {"comID":localStorage.comID,"pageno":pageno,"pagesize":pagesize,"orderstatus":sid},
            error:function(){
                myApp.alert('未知错误','提醒');
            },
            success:function(data){
                myApp.hideIndicator();
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'提醒');
                }
                if(data.rc == 0) {
                    //已发货
                    console.log('pagesize' + pagesize);
                    console.log('totalrow' + data.data.totalrow);
                    if (data.data.totalrow > pagesize) {
                        $$('.moreData').show();
                    }
                    if (data.data.rows.length > 0) {
                        $$("#orderListMain2").html();
                        var template = $$("#orderList2").html();
                        var compiledTemplate = Template7.compile(template);
                        //$$(".orderBox").append(compiledTemplate(data.data));
                        if (sid == "1110") {
                            $$("#orderListMain").append(compiledTemplate(data.data));//待发货
                        }
                        if (sid == "1120") {
                            $$("#orderListMain2").append(compiledTemplate(data.data));//已发货
                        }
                        if (sid == "1130") {
                            $$("#orderListMain4").append(compiledTemplate(data.data));//已完成
                        }
                        if (sid == "1160") {
                            $$("#orderListMain5").append(compiledTemplate(data.data));//已关闭
                        }
                    } else {
                        hasMoreData = false;
                        $$('.moreData').html("没有更多订单了");
                    }
                }

            }
        });
    }
    $$('.moreData').on('click',function(){
        pageno++;
        console.log(pageno);
        getOrder();
    });
});