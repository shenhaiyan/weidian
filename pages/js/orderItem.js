myApp.onPageInit('orderItem', function (page) {
    //���Ҳ鿴��������
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
            myApp.alert('δ֪����','����');
        },
        success:function(data){
            myApp.hideIndicator();
            data = JSON.parse(data);
            if(data.rc == -1){
                myApp.alert(data.msg,'����');
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
                        + "<p>�۸�:<span>" + "<i class='fen'>" + data.data.skuList[i].unitprice + "</i>" + " x " + data.data.skuList[i].number + "</span></p>"
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
    //�򿪶���״̬
    $$('.orderDo').on('click',function(e){
        $$('.orderDoBox').show();
    });
    //���Ķ���״̬(���ҽ��з�����ǩ�ա�ȡ�������Ȳ���)
    $$(".orderDoBox ul li").on('click',function(){
        var id = $$(this).attr('id');
        var text = $$(this).text();
        myApp.confirm('��ȷ��Ҫ'+text,'������������', function () {
            $$.ajax({
                url: getIPAndVirulPath()+'/app/order/editOrders.action',
                method:'POST',
                cache:false,
                headers:headersInfo,
                data: {"oid":oid,"operate":id},
                error:function(){
                    myApp.alert('δ֪����','����');
                },
                success:function(data){
                    myApp.hideIndicator();
                    data = JSON.parse(data);
                    if(data.rc == 0){
                        myApp.alert(text+'�ɹ�','������ʾ');
                        $$("#orderstatus").html(text);
                        mainView.router.refreshPreviousPage(); //ˢ����ͼ����һ��ҳ��
                        $$('.orderDoBox').hide();
                    }
                    if(data.rc == -1){
                        myApp.alert(data.msg,'������ʾ');
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