myApp.onPageInit('order', function (page) {
    //�������л�
    $$(".orderRow .button").on('click',function(){
       var lineIndex = $$(this).index();
        $$(".orderRowLine").transform('translate3d('+(lineIndex-0)*$$(".orderRow .button").width()+'px,0,0)').transition(500);
    });
    //��ȡ�����еĶ�����Ŀ&��ȡ�����б�
    var sid = 1110;  //Ĭ��״̬Ϊ������
    var pagesize = 5;  //���صļ�¼��
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
                myApp.alert('δ֪����','����');
            },
            success:function(data){
                myApp.hideIndicator();
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'����');
                }
                if(data.rc == 0) {
                    if (data.data.totalrow == undefined) {
                        $$('.moreData').hide();
                    }
                    $$('.orderNum').html(data.data.underwaynum);
                    $$('#pay1').html(data.data.waitnum);
                    $$('#pay2').html(data.data.alreadynum);
                    //������
                    var template = $$("#orderList").html();
                    var compiledTemplate = Template7.compile(template);
                    $$("#orderListMain").append(compiledTemplate(data.data));
                }
            }
        });
    }

    $$('.buttons-row .button').on('click', function () {   //�л�TAB����orderstatus
        sid = $$(this).attr("id");
        console.log(sid);
        pageno = 1;
        $$(".orderBox").children("a").remove();
        $$(".noData").remove();
        myApp.showIndicator();
        $$('.moreData').html("������ض���");
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
                myApp.alert('δ֪����','����');
            },
            success:function(data){
                myApp.hideIndicator();
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'����');
                }
                if(data.rc == 0) {
                    //�ѷ���
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
                            $$("#orderListMain").append(compiledTemplate(data.data));//������
                        }
                        if (sid == "1120") {
                            $$("#orderListMain2").append(compiledTemplate(data.data));//�ѷ���
                        }
                        if (sid == "1130") {
                            $$("#orderListMain4").append(compiledTemplate(data.data));//�����
                        }
                        if (sid == "1160") {
                            $$("#orderListMain5").append(compiledTemplate(data.data));//�ѹر�
                        }
                    } else {
                        hasMoreData = false;
                        $$('.moreData').html("û�и��ඩ����");
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