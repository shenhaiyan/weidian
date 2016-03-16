myApp.onPageInit('wares', function (page) {
    var prostatus = 3;     //��Ʒ״̬��ʾĬ��Ϊ�ϼ�
    var ordermode = "DESC"; //��Ʒ����Ĭ��Ϊ����
    var proorder = 1;       //��Ʒ����ʽ 1���ϼ�ʱ�䣻2��������3����档
    var pagesize = 5;
    var proorder_old = proorder;
    var pageno = 1;
    //��Ʒ����
      $$(".waresSort .item").on('click', function(){
          $$('.waresSellLi').children('li').remove();
          proorder = $$(this).index()+1;
          if(proorder == proorder_old) {
              if (ordermode == "ASC") {
                  ordermode = "DESC";
                  $$(this).removeClass('on2');
              } else {
                  ordermode = "ASC";
                  $$(this).addClass('on2');
              }
          }else{
              ordermode = "DESC";
              proorder_old = proorder;
              $$(this).removeClass('on2');
          }
        $$(this).addClass('on').each(
            function(){
                if($$(this).hasClass('on')){
                    $$(this).prevAll().removeClass('on');
                    $$(this).nextAll().removeClass('on');
                }
            }
        );
          pageno = 0;
          waresList();
    });

    //�����Ȼ�ȡ��һ������
    waresList();

    myApp.showIndicator();
    var hasMoreData = true;
    function waresList(){
        $$.ajax({
            url: getIPAndVirulPath()+'/app/product/showProducts.action',
            method:'POST',
            cache:false,
            headers:headersInfo,
            data: {"comID":localStorage.comID,"pageno":pageno,"pagesize":pagesize,"prostatus":prostatus,"ordermode":ordermode,"proorder":proorder},
            error:function(){
                myApp.alert('δ֪����','����');
            },
            success:function(data) {
                myApp.hideIndicator();
                //debugger;
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'����');
                }
                if(data.rc == 0) {
                    if (data.data.rows.length > 0) {
                        var template = $$("#waresSellList").html();
                        var compiledTemplate = Template7.compile(template);
                        $$(".waresSellLi").append(compiledTemplate(data.data.rows));
                        editState();
                    } else {
                        hasMoreData = false;
                        $$('#sell .moreData').html("û�и�����Ʒ��");
                    }
                }

            }
        });
    }
    //var sellOutData = "";

    var prostatus;
    function getSellOutData(){
        $$.ajax({
            url: getIPAndVirulPath() + '/app/product/showProducts.action',
            method: 'POST',
            cache: false,
            headers: headersInfo,
            data: {
                "comID": localStorage.comID,
                "pageno": pageno++,
                "pagesize": pagesize,
                "prostatus": prostatus,
                "ordermode": ordermode,
                "proorder": proorder
            },
            error:function(){
                myApp.alert('δ֪����','����');
            },
            success: function (data) {
                data = JSON.parse(data);
                if (data.rc == -1) {
                    myApp.alert(data.msg, '����');
                }
                if (data.rc == 0) {
                    if (data.data.rows.length > 0) {
                        var template = $$("#waresSellOutList").html();
                        var compiledTemplate = Template7.compile(template);
                        $$(".waresSellOutLi").append(compiledTemplate(data.data.rows));
                        editState();
                    } else {
                        hasMoreData = false;
                        $$('#sellOut .moreData').html("û�и�����Ʒ��");
                    }
                }
            }
        });
    }


    $$('.waresNav a').on('click',function(){
        pageno = 1;
        //�л�TAB��ʾ��Ʒ���¼�״̬�б�
        $$('.waresSellOutLi').children('li').remove();
        prostatus = $$(this).attr('data-id');
        getSellOutData();
    });
    //������Ʒ���¼�״̬
    function editState(){
        $$('.edit').on('click',function(){
            var state = $$(this).attr('data-state');
            var skuid = $$(this).attr('id');
            var communityid = $$(this).attr('data-communityid');
            var succDel = $$(this).parents('li');

            if(state == "3"){
                stateString = "�¼�";
                state1 = "4"
            }
            if(state == "4"){
                stateString = "�ϼ�";
                state1 = "3"
            }
            myApp.confirm('��Ҫ'+stateString+'�����Ʒ��?',stateString+'?', function () {
                $$.ajax({
                    url: getIPAndVirulPath()+'/app/product/editProduct.action',
                    method:'POST',
                    cache:false,
                    headers:headersInfo,
                    data: {"comID":localStorage.comID,"ordermode":"ASC","operate":state1,"skuid":skuid,"communityid":communityid},
                    error:function(){
                        myApp.alert('δ֪����','����');
                    },
                    success:function(data){
                        myApp.hideIndicator();
                        data = JSON.parse(data);
                       //alert(data);
                        if(data.rc == 0){
                            myApp.alert(stateString+'�ɹ�','������ʾ');
                            myApp.swipeoutDelete(succDel);
                        }
                        if(data.rc == -1){
                            myApp.alert(data.msg,'������ʾ');
                        }
                    }
                });
            },function(){
                myApp.swipeoutClose(succDel);
            });
        });
    }

    $$('#sell .moreData').on('click',function(){
        pageno++;
        waresList();
    });
    $$('#sellOut .moreData').on('click',function(){
        pageno++;
        getSellOutData();
    });
    //�󶨹������ײ����ظ���
    //$$('.infinite-scroll').on('infinite', function () {
    //    // ������ڼ��أ����˳�
    //    if (loading) return;
    //    // ����flag
    //    loading = true;
    //    // ģ��1s�ļ��ع���
    //    setTimeout(function () {
    //        // ���ü���flag
    //        loading = false;
    //        // �������Ŀ
    //        pageno++;
    //        waresList();
    //    }, 1000);
    //});
});

