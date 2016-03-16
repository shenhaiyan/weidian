myApp.onPageInit('wares', function (page) {
    var prostatus = 3;     //商品状态显示默认为上架
    var ordermode = "DESC"; //商品排序默认为降序
    var proorder = 1;       //商品排序方式 1：上架时间；2：销量；3：库存。
    var pagesize = 5;
    var proorder_old = proorder;
    var pageno = 1;
    //商品排序
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

    //载入先获取第一次数据
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
                myApp.alert('未知错误','提醒');
            },
            success:function(data) {
                myApp.hideIndicator();
                //debugger;
                data = JSON.parse(data);
                if(data.rc == -1){
                    myApp.alert(data.msg,'提醒');
                }
                if(data.rc == 0) {
                    if (data.data.rows.length > 0) {
                        var template = $$("#waresSellList").html();
                        var compiledTemplate = Template7.compile(template);
                        $$(".waresSellLi").append(compiledTemplate(data.data.rows));
                        editState();
                    } else {
                        hasMoreData = false;
                        $$('#sell .moreData').html("没有更多商品了");
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
                myApp.alert('未知错误','提醒');
            },
            success: function (data) {
                data = JSON.parse(data);
                if (data.rc == -1) {
                    myApp.alert(data.msg, '提醒');
                }
                if (data.rc == 0) {
                    if (data.data.rows.length > 0) {
                        var template = $$("#waresSellOutList").html();
                        var compiledTemplate = Template7.compile(template);
                        $$(".waresSellOutLi").append(compiledTemplate(data.data.rows));
                        editState();
                    } else {
                        hasMoreData = false;
                        $$('#sellOut .moreData').html("没有更多商品了");
                    }
                }
            }
        });
    }


    $$('.waresNav a').on('click',function(){
        pageno = 1;
        //切换TAB显示商品上下架状态列表
        $$('.waresSellOutLi').children('li').remove();
        prostatus = $$(this).attr('data-id');
        getSellOutData();
    });
    //更改商品上下架状态
    function editState(){
        $$('.edit').on('click',function(){
            var state = $$(this).attr('data-state');
            var skuid = $$(this).attr('id');
            var communityid = $$(this).attr('data-communityid');
            var succDel = $$(this).parents('li');

            if(state == "3"){
                stateString = "下架";
                state1 = "4"
            }
            if(state == "4"){
                stateString = "上架";
                state1 = "3"
            }
            myApp.confirm('你要'+stateString+'这个商品吗?',stateString+'?', function () {
                $$.ajax({
                    url: getIPAndVirulPath()+'/app/product/editProduct.action',
                    method:'POST',
                    cache:false,
                    headers:headersInfo,
                    data: {"comID":localStorage.comID,"ordermode":"ASC","operate":state1,"skuid":skuid,"communityid":communityid},
                    error:function(){
                        myApp.alert('未知错误','提醒');
                    },
                    success:function(data){
                        myApp.hideIndicator();
                        data = JSON.parse(data);
                       //alert(data);
                        if(data.rc == 0){
                            myApp.alert(stateString+'成功','操作提示');
                            myApp.swipeoutDelete(succDel);
                        }
                        if(data.rc == -1){
                            myApp.alert(data.msg,'操作提示');
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
    //绑定滚动到底部加载更多
    //$$('.infinite-scroll').on('infinite', function () {
    //    // 如果正在加载，则退出
    //    if (loading) return;
    //    // 设置flag
    //    loading = true;
    //    // 模拟1s的加载过程
    //    setTimeout(function () {
    //        // 重置加载flag
    //        loading = false;
    //        // 添加新条目
    //        pageno++;
    //        waresList();
    //    }, 1000);
    //});
});

