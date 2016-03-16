myApp.onPageInit('orderItem', function (page) {
    //卖家查看订单详情
    var loading = false;
    var oid = page.query.oid;
    myApp.showIndicator();
    $$.ajax({
        url: getIPAndVirulPath()+'/app/order/showOrderDetail.action',
        method:'POST',
        cache:false,
        headers:headersInfo,
        data: {"oid":oid,"comID": localStorage.comID},
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
                var template = $$('#shopMb').html();
                var compiledTemplate = Template7.compile(template);
                html = compiledTemplate(data.data);
                $$(".shopMb").append(html);
                var skuList = [];
                for (var i = 0; i < data.data.skuList.length; i++) {
                    $$(".skuList").prepend(
                        "<li class='waresInfo'>"
                        + "<div class='imgBox'><img src='" + data.data.skuList[i].url + "'></div>"
                        + "<div class='txt'>"
                        + "<p>" + data.data.skuList[i].skuname + "</p>"
                        + "<p>价格:<span>" + "<i class='fen'>" + data.data.skuList[i].unitprice + "</i>" + " x " + data.data.skuList[i].number + "</span></p>"
                        + "</div>"
                        + "</li>"
                    )
                }
                $$(".fen").each(function () {
                    var fen = $$(this).text();
                    $$(this).html(fen_to_yuan(fen));
                });
            }
        }
    });
    //打开订单状态
    $$('.orderDo').on('click',function(e){
        $$('.orderDoBox').show();
    });
    //更改订单状态(卖家进行发货、签收、取消订单等操作)
    $$(".orderDoBox ul li").on('click',function(){
        var id = $$(this).attr('id');
        var text = $$(this).text();
        myApp.confirm('你确定要'+text,'订单操作提醒', function () {
            $$.ajax({
                url: getIPAndVirulPath()+'/app/order/editOrders.action',
                method:'POST',
                cache:false,
                headers:headersInfo,
                data: {"oid":oid,"operate":id},
                error:function(){
                    myApp.alert('未知错误','提醒');
                },
                success:function(data){
                    myApp.hideIndicator();
                    data = JSON.parse(data);
                    if(data.rc == 0){
                        myApp.alert(text+'成功','操作提示');
                        $$("#orderstatus").html(text);
                        mainView.router.refreshPreviousPage(); //刷新视图的上一个页面
                        $$('.orderDoBox').hide();
                    }
                    if(data.rc == -1){
                        myApp.alert(data.msg,'操作提示');
                        $$('.orderDoBox').hide();
                    }
                }
            });
        },
        function(){
            $$('.orderDoBox').hide();
        });
    });


});