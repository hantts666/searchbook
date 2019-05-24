//获取basic url
function getInitUrl(id) {
    var urlHeader = location.href.split('/search/');
    return urlHeader[0] + $(id).val();
}

//判断多选框是否选中
function isChecked(ele, type) {
    for(var i = 0; i < ele.length; i++){
        if(!ele[i].checked){
            if(i == ele.length-1){
                return false;
            }
        }else{
            return true;
        }
    }
}

//替换指定位置字符串
function  replaceStr(str, newStr, allStr) {
    var index = allStr.indexOf(str);
    var arr = allStr.split('');
    arr[index] = newStr;
    return arr.join('');
}

$(function () {
    var width = $('.wf-pagination').width();
    $('.wf-pagination').css('marginLeft',-width/2+'px');

    // 折叠功能
    $('body').on('click', '#classify .mod i', function() {
        var $this = $(this);
        var len = $(this).parent().next('ul').find('li').length;
        if(len !== 0){
            if ($this.hasClass('open')) {
                $this.removeClass('open').parent('h3').siblings('ul').hide();
            } else {
                $this.addClass('open').parent('h3').siblings('ul').show();
            }
        }
    });

    /*    // 下载
     $('body').on('click', '.handle-download', function() {
     var id = $("#Id").val();

     var resourceTitle = $("#BookTitle").val();
     var DBID1 = $("#DBID").val();

     console.log(id+ " "+ resourceTitle+" "+ DBID1);
     window.open('/GetResources/readingOrDownloadFz_New.do?language=chi&resourceType=local chronicles&source=WF&resourceId='
     + id + '&resourceTitle=' + resourceTitle + '&isoa=false'  + '&DBID=' + DBID1 + '&ROD=0' + '&userId=null&PageCount=null');

     });*/

    // 阅读
    /*  $('body').on('click', '.handle-view', function() {
     var href = $(".zs_title").attr("href");
     window.location.href = href;
     });*/

    //翻页跳转
    (function () {
        var getPager = function (url,$container) {
            $.get(url,function (html) {
                $container.replaceWith(html);
            });
        };
        //page-form同步跳转
        $(document).on('submit','.no-sync .page form',function () {
            var action = $(this).attr('data-action');
            var inputPage = parseInt($(this).find('.laypage_skip').val());
            var allPage = $(this).attr('data-all');
            if(inputPage> 0 &&　inputPage <= allPage ){
                window.location.href = action + encodeURIComponent(inputPage);
            }else{
                alert('请输入正确页码');
            }
            return false;
        });
    })();

    //解析url
    function getQueryString(args) {
        var url = location.search;
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
            return theRequest[args];
        }
    }

    // 排序
    (function () {
        var date = getQueryString('sort');
        if(date === 'date'){
            $("#sortDate").attr('checked',true);
        }else{
            $("#sortRelate").attr('checked',true);
        }
    })();

    // 初始化
    $('#classify').find('.mod').each(function() {
        var $this = $(this);
        var $item = $this.find('.bd>li');
        // 超出5条
        if ($item.length > 5) {
            $this.find('.ft').show(); // 显示控制按钮
            $item.each(function(i) {
                if (i >= 5) {
                    $(this).hide(); // 隐藏多余条目
                };
            });
        };
    });

    //mod显示隐藏
    function modShowOrHide(ele,type) {
        if(type === 'show'){
            ele.parents('.mod').css({
                'max-height':'inherit',
                'overflow':'inherit'
            });
        }
        if(type === 'hide'){
            ele.parents('.mod').css({
                'max-height':'auto',
                'overflow':'inherit'
            });
        }
    }

    // 折叠功能
    $('body').on('click', '#classify .bd i', function() {
        var $this = $(this);
        if ($this.hasClass('open')) {
            modShowOrHide($this, 'hide');
            $this.removeClass('open').siblings('ul').hide();
        } else {
            modShowOrHide($this, 'show');
            $this.addClass('open').siblings('ul').show();
        };
    });

    // 折叠功能.ft
    $('body').on('click', '#classify .ft', function() {
        var $this = $(this);
        $this.css('bottom','14px');
        if ($this.hasClass('open')) {
            modShowOrHide($this, 'hide');
            $this.removeClass('open').siblings('.bd').children('li').each(function(i) {
                if (i >= 5) {
                    $(this).hide(); // 隐藏多余条目
                };
            });
        } else {
            modShowOrHide($this, 'show');
            $this.addClass('open').siblings('.bd').children('li').show();
        };
    });

    // var url = getInitUrl();
    var url = $('#initUrl').val(); //当前url

    //截取省市名
    $(".mod ul a").each(function () {
        var areaname = $(this).text().replace(/\([^\)]*\)/g,"");
        $(this).attr('data-area',areaname);
    });

    //左侧聚类跳转
    //全选和反选
    /*// var firstFlag = true;
     // $('.first_item').click(function () {
     //     var secondUl = $(this).siblings('.bd_province_list');
     //     var secondItem = secondUl.find('.second_item');
     //     if(secondUl){
     //         if(firstFlag) {
     //             secondItem.prop('checked', true);
     //             firstFlag = false;
     //         }else{
     //             secondItem.prop('checked', false);
     //             firstFlag = true;
     //         }
     //     }
     // });
     // $('.second_item').click(function () {
     //     var secondUl = $(this).siblings('.bd_province_list');
     //     var firstItem = $(this).parents('.bd_province_list').siblings('.first_item');
     //     console.log(firstItem.prop('checked'));
     //     if(firstItem.prop('checked')){
     //         firstItem.prop('checked', false);
     //     }else{
     //         return;
     //     }
     // });*/

    /*$('.allSelect').click(function(){
     var $this = $(this);
     var checkboxs = $this.parents('.mod').find('.first_item');
     var checkedLength = $this.parents('.mod').find('.first_item:checked').length;
     var secondCheckboxsFlag = $this.parents('.mod').find('.second_item:checked');
     var typeFlag = $(this).prev().data('type');
     var modIndex = $this.parents('.mod').index()-2;
     var ftFlag = $this.parents('.hd').siblings('.ft').hasClass('open');
     var ftFlagStr = '';
     (ftFlag == true) ? ftFlagStr = '&slide=true&index='+modIndex+'' : ftFlagStr = '&slide=false&index='+modIndex+'';
     //全选或全空
     // if((!isChecked(checkboxs) || (checkedLength === checkboxs.length)) && (secondCheckboxsFlag.length === 0)){
     if(!isChecked(checkboxs) && (secondCheckboxsFlag.length === 0)){
     // alert("请至少选择一项")
     // checkboxs.attr('checked', true);
     location.href = url;
     }else{
     if(typeFlag === "地区分布"){
     var f_checkboxs = $this.parents('.mod').find('.first_item');
     var provinceTemp = [];
     var urlParaN = "&facets=";
     var urlPara1 = '!!1';
     var urlParaProvince = '';
     var urlPara2 = '';
     var cityStr ='';
     var cityTemp = [];
     f_checkboxs.each(function (i) {
     if($(this).prop('checked')){
     var link_f = '-Province:'+ $(this).next().attr('data-area');
     urlPara1 += (link_f + '//City:all');
     }else{
     var s_checkboxsChecked = $(this).siblings('.bd_province_list').find('.second_item:checked');
     if(s_checkboxsChecked.length > 0){
     var proTempVal = $(this).next().attr('data-area');
     urlPara2 = '//City';
     urlParaProvince = '-Province:'+ proTempVal;
     provinceTemp.push(urlParaProvince);
     s_checkboxsChecked.each(function (i) {
     var link_s = ';'+ $(this).next().attr('data-area');
     urlPara2 += link_s;
     });
     urlPara2 = replaceStr(';', ':',urlPara2); //替换每一项城市前的
     cityTemp.push(urlParaProvince+urlPara2);
     }
     }
     });
     // console.log(cityTemp);
     if(provinceTemp.length === 0){
     urlPara2 = '';
     }else{
     cityStr = cityTemp.join('');
     }
     var urlParas = urlParaN + encodeURIComponent(replaceStr('-', '', urlPara1+cityStr));
     console.log(urlParas);
     // location.href = url + urlParas;
     $('#urlTemp').val(urlParas);
     $('#areaForm').attr('action', url).submit();
     }
     if(typeFlag === "年代分布"){
     var f_checkboxs = $this.parents('.mod').find('.first_item');
     var f_checkboxsLen = $this.parents('.mod').find('.first_item:checked').length;
     console.log(f_checkboxsLen);
     var provinceTemp1 = [];
     var urlParaN = "&facets=";
     var urlPara1 = '!!1';
     var urlPara2 = '//DBID:FZ_New';
     var urlPara3 = '!!1';
     if(f_checkboxsLen == 2){
     //location.href = url+'&selType=all'; //如果年代分布全部勾选则刷新页面
     location.href = url+urlParaN+'!!1Dynasty:all//DBID:FZ_Old-Dynasty:all//DBID:FZ_New';
     }
     else{
     f_checkboxs.each(function () {
     if($(this).prop('checked')){
     if($(this).next().attr('data-area') === '1949年前'){
     urlPara1 = '!!1Dynasty:all//DBID:FZ_Old';
     }else{
     var s_checkboxsChecked = $(this).parent().prev().find('.second_item:checked');
     if(s_checkboxsChecked.length === 0){
     urlPara1 = '!!1Dynasty:all//DBID:FZ_New';
     }else{
     return;
     }
     }
     }else{
     var s_checkboxsChecked = $(this).siblings('.bd_province_list').find('.second_item:checked');
     s_checkboxsChecked.each(function () {
     var link_s = '-Dynasty:'+ $(this).next().attr('data-area') + '//DBID:all';
     urlPara1 += link_s;
     var _self = $(this);
     $this.parents('.mod').find('.first_item:checked').each(function () {
     if($(this).next().attr('data-area') === '1949年后'){
     provinceTemp1.push(urlPara2);
     var link_s = '-Dynasty:'+ _self.next().attr('data-area') + '//DBID:FZ_New';
     urlPara3 += link_s;
     }
     });
     });
     }
     });
     console.log(provinceTemp1);
     urlPara1 = replaceStr('-', '', urlPara1);
     urlPara3 = replaceStr('-', '', urlPara3);
     var urlPara = '';
     if(provinceTemp1.length === 0){
     urlPara = urlPara1;
     }else{
     urlPara = urlPara3;
     }
     // console.log(urlPara);
     location.href = url + urlParaN + encodeURIComponent(urlPara);
     }
     }
     if((typeFlag === "分类级别") || (typeFlag === "地区级别") || (typeFlag === "专辑分类") || (typeFlag === "条目类型") || (typeFlag === "专题类型")){  //其他情况
     var f_checkboxsChecked = $this.parents('.mod').find('.first_item:checked');
     var urlParaN = "&facets=";
     var typeTemp = ["RegionLevel", "AlbumCategory", "CategoryLevel", "Type", "CategoryCode_ForSearch"];
     var urlPara2 = "";
     if(typeFlag === "分类级别"){
     urlPara2 = typeTemp[2];
     }
     if(typeFlag === "地区级别"){
     urlPara2 = typeTemp[0];
     }
     if(typeFlag === "专辑分类"){
     urlPara2 = typeTemp[1];
     }
     if(typeFlag === "条目类型"){
     urlPara2 = typeTemp[3];
     }
     if(typeFlag === "专题类型"){
     urlPara2 = typeTemp[4];
     }
     f_checkboxsChecked.each(function () {
     var link_s = ';'+ $(this).next().attr('data-area');
     urlPara2 += link_s;
     });
     urlPara2 = replaceStr(';', ':', urlPara2);
     location.href = url + urlParaN + encodeURIComponent(urlPara2);
     }
     }
     });*/

    /*筛选结果提交*/
    var res_len=$('.regin-classify').find('.result').length;
    if(res_len>20){
        $('.select-btn ').click(function(){
            alert('最多只能选择20个条件！请重置后重新选择！')
        })
    }else{
        $('.select-btn ').click(function(){
            var $this = $(this);
            var checkboxs = $this.parent().siblings('.mod').find('.first_item');
            var checkedLength = $this.parent().siblings('.mod').find('.first_item:checked').length;
            var secondCheckboxsFlag = $this.parent().siblings('.mod').find('.second_item:checked');
            var modIndex = $this.parent().siblings('.mod').index()-2;
            var ftFlag = $this.parent().siblings('.hd').siblings('.ft').hasClass('open');
            var ftFlagStr = '';

            (ftFlag == true) ? ftFlagStr = '&slide=true&index='+modIndex+'' : ftFlagStr = '&slide=false&index='+modIndex+'';
            //全选或全空

            if(!isChecked(checkboxs) && (secondCheckboxsFlag.length === 0)){
                alert("请至少选择一项")
                // checkboxs.attr('checked', true);
                location.href = url;
            }else{
                if(selectedType === "地区分布"){
                    var f_checkboxs = $this.parent().siblings('.mod').find('.first_item');
                    var provinceTemp = [];
                    var urlParaN = "&facets=";
                    var urlPara1 = '!!1';
                    var urlParaProvince = '';
                    var urlPara2 = '';
                    var cityStr ='';
                    var cityTemp = [];
                    f_checkboxs.each(function (i) {
                        if($(this).prop('checked')){

                            /*如果省市都选*/
                            var s_checkboxsChecked = $(this).siblings('.bd_province_list').find('.second_item:checked');
                            if(s_checkboxsChecked.length > 0){
                                var link_f = '-Province:'+ $(this).next().attr('data-area');
                                urlPara1 += (link_f);
                                var proTempVal = $(this).next().attr('data-area');
                                urlPara2 = '//City';
                                provinceTemp.push(urlParaProvince);
                                s_checkboxsChecked.each(function (i) {
                                    var link_s = ';'+ $(this).next().attr('data-area');
                                    urlPara2 += link_s;
                                });
                                urlPara2 = replaceStr(';', ':',urlPara2); //替换每一项城市前的
                                cityTemp.push(urlPara2);

                            }else{var link_f = '-Province:'+ $(this).next().attr('data-area');
                                urlPara1 += (link_f + '//City:all');

                            }
                        }else {
                            var s_checkboxsChecked = $(this).siblings('.bd_province_list').find('.second_item:checked');
                            if(s_checkboxsChecked.length > 0){
                                var proTempVal = $(this).next().attr('data-area');
                                urlPara2 = '//City';
                                urlParaProvince = '-Province:'+ proTempVal;
                                provinceTemp.push(urlParaProvince);
                                s_checkboxsChecked.each(function (i) {
                                    var link_s = ';'+ $(this).next().attr('data-area');
                                    urlPara2 += link_s;
                                });
                                urlPara2 = replaceStr(';', ':',urlPara2); //替换每一项城市前的
                                cityTemp.push(urlParaProvince+urlPara2);

                            }
                        }
                    });
                    // console.log(cityTemp);
                    if(provinceTemp.length === 0){
                        urlPara2 = '';
                    }else{
                        cityStr = cityTemp.join('');
                    }
                    var urlParas = urlParaN + encodeURIComponent(replaceStr('-', '', urlPara1+cityStr));

                    // location.href = url + urlParas;
                    $('#urlTemp').val(urlParas);
                    $('#areaForm').attr('action', url).submit();

                }
                if(selectedType === "年代分布"){
                    var f_checkboxs = $this.parent().siblings('.mod').find('.first_item');
                    var f_checkboxsLen = $this.parent().siblings('.mod').find('.first_item:checked').length;
                    var provinceTemp1 = [];
                    var urlParaN = "&facets=";
                    var urlPara1 = '!!1';
                    var urlPara2 = '//DBID:FZ_New';
                    var urlPara3 = '!!1';
                    if(f_checkboxsLen == 2){
                        //location.href = url+'&selType=all'; //如果年代分布全部勾选则刷新页面
                        // location.href = url+urlParaN+'!!1Dynasty:all//DBID:FZ_Old-Dynasty:all//DBID:FZ_New';
                        urlParas  = urlParaN +  encodeURIComponent('!!1Dynasty:all//DBID:FZ_Old-Dynasty:all//DBID:FZ_New');
                        $('#urlTemp').val(urlParas);
                        $('#areaForm').attr('action', url).submit();

                    }
                    else{
                        f_checkboxs.each(function () {
                            if($(this).prop('checked')){
                                if($(this).next().attr('data-area') === '1949年前'){

                                    var s_checkboxsChecked = $(this).siblings('.bd_province_list').find('.second_item:checked');

                                    if(s_checkboxsChecked.length>0){
                                        s_checkboxsChecked.each(function () {
                                            var link_s = '-Dynasty:'+ $(this).next().attr('data-area') + '//DBID:all';
                                            urlPara1 += link_s;
                                            var _self = $(this);
                                            $this.parent().siblings('.mod').find('.first_item:checked').each(function () {
                                                if($(this).next().attr('data-area') === '1949年后'){
                                                    provinceTemp1.push(urlPara2);
                                                    var link_s = '-Dynasty:'+ _self.next().attr('data-area') + '//DBID:FZ_New';
                                                    urlPara3 += link_s;
                                                }
                                            });

                                        });

                                    }else{
                                        urlPara1 = '!!1Dynasty:all//DBID:FZ_Old';
                                    }


                                }else{
                                    var s_checkboxsChecked = $(this).parent().prev().find('.second_item:checked');
                                    if(s_checkboxsChecked.length === 0){
                                        urlPara1 = '!!1Dynasty:all//DBID:FZ_New';
                                    }else{
                                        return;
                                    }

                                }
                            }else{
                                var s_checkboxsChecked = $(this).siblings('.bd_province_list').find('.second_item:checked');
                                s_checkboxsChecked.each(function () {
                                    var link_s = '-Dynasty:'+ $(this).next().attr('data-area') + '//DBID:all';
                                    urlPara1 += link_s;
                                    var _self = $(this);
                                    $this.parent().siblings('.mod').find('.first_item:checked').each(function () {
                                        if($(this).next().attr('data-area') === '1949年后'){
                                            provinceTemp1.push(urlPara2);
                                            var link_s = '-Dynasty:'+ _self.next().attr('data-area') + '//DBID:FZ_New';
                                            urlPara3 += link_s;
                                        }
                                    });
                                });
                            }
                        });
                        urlPara1 = replaceStr('-', '', urlPara1);
                        urlPara3 = replaceStr('-', '', urlPara3);
                        var urlPara = '';
                        if(provinceTemp1.length === 0){
                            urlPara = urlPara1;
                        }else{
                            urlPara = urlPara3;
                        }
                        //  console.log(urlPara);
                        // location.href = url + urlParaN + encodeURIComponent(urlPara);
                        // var factss=$('#newUrl').val();
                        // if(factss==null ){
                        //     alert(factss);
                        //     factss="";
                        // }
                        urlParas  = urlParaN +  encodeURIComponent(urlPara);
                        $('#urlTemp').val(urlParas);
                        $('#areaForm').attr('action', url).submit();
                    }
                }
                if((selectedType === "分类级别") || (selectedType === "地区级别") || (selectedType === "专辑分类") || (selectedType === "条目类型") || (selectedType === "专题类型")){  //其他情况
                    var f_checkboxsChecked = $this.parent().siblings('.mod').find('.first_item:checked');
                    var urlParaN = "&facets=";
                    var typeTemp = ["RegionLevel", "AlbumCategory", "CategoryLevel", "Type", "CategoryCode_ForSearch"];
                    var urlPara2 = "";
                    if(selectedType === "分类级别"){
                        urlPara2 = typeTemp[2];
                    }
                    if(selectedType === "地区级别"){
                        urlPara2 = typeTemp[0];
                    }
                    if(selectedType === "专辑分类"){
                        urlPara2 = typeTemp[1];
                    }
                    if(selectedType === "条目类型"){
                        urlPara2 = typeTemp[3];
                    }
                    if(selectedType === "专题类型"){
                        urlPara2 = typeTemp[4];
                    }
                    f_checkboxsChecked.each(function () {
                        var link_s = ';'+ $(this).next().attr('data-area');
                        urlPara2 += link_s;
                    });
                    urlPara2 = replaceStr(';', ':', urlPara2);
                    // location.href = url + urlParaN + encodeURIComponent(urlPara2);
                    urlParas  = urlParaN +  encodeURIComponent(urlPara2);
                    $('#urlTemp').val(urlParas);
                    $('#areaForm').attr('action', url).submit();
                }
            }


            text_len = typeTabsArr.join('');

            switch(selectedType) {
                case '地区分布':
                    $(".regin-classify").append(text_len);break;
                case '年代分布':
                    $(".date-classify").append(text_len);break;
                case '地区级别':
                    $(".state-classify").append(text_len);break;
                case '专辑分类':
                    $(".album-classify").append(text_len);break;
                case '分类级别':
                    $(".rank-classify").append(text_len);break;
            }
            /*$('.search-classify').find('.select-box').each(function() {
             var min_len= $(this).find(".result").length;
             if(min_len>0){
             $(this).css({"display":"inline"});
             }else{
             $(this).css({"display":"none"});
             }

             });*/
            /*$('.remove-btn').click(function () {
             $(this).parent().remove();

             });*/

            typeTabsArr = [];
        });
    }

    //checkbox回显
    /*(function () {

     var newUrl = $("#newUrl").val();
     var curUrl = location.href;
     var arr1 = [];
     var arr2 = [];
     var arr3 = [];
     var select_text=[];
     select_text.push(newUrl);
     console.log(newUrl);
     console.log(curUrl);
     console.log(select_text);
     if(curUrl.indexOf('selType=all') !== -1){
     // $('.mod').eq(1).find('.first_item').prop('checked',true);
     $('.mod').eq(1).find('.first_item').prop('checked',true);
     }
     if(newUrl !== ''){
     if(newUrl.indexOf('//') !== -1){
     // console.log('年代组合')
     if(newUrl.indexOf('Dynasty') !== -1){
     if(newUrl === '!!1Dynasty:all//DBID:FZ_Old'){
     $('.mod').eq(1).find('.first_item').each(function () {
     if($(this).next().text().replace(/\([^\)]*\)/g,"") === '1949年前'){
     $(this).prop('disabled','disabled');
     }
     });
     $('.mod').eq(1).find('.second_item').prop('checked',false);
     }
     else if(newUrl === '!!1Dynasty:all//DBID:FZ_New'){
     $('.mod').eq(1).find('.first_item').each(function () {
     if($(this).next().text().replace(/\([^\)]*\)/g,"") === '1949年后'){
     $(this).prop('disabled','disabled');
     }
     });
     $('.mod').eq(1).find('.second_item').prop('disabled','disabled');
     }
     else if(newUrl === '!!1Dynasty:all//DBID:FZ_Old-Dynasty:all//DBID:FZ_New'){
     $('.mod').eq(1).find('.first_item').each(function () {
     if($(this).next().text().replace(/\([^\)]*\)/g,"") === '1949年前'){
     $(this).prop('disabled','disabled');

     }
     if($(this).next().text().replace(/\([^\)]*\)/g,"") === '1949年后'){
     $(this).prop('disabled','disabled');
     }
     });
     $('.mod').eq(1).find('.second_item').prop('disabled','disabled');

     }
     else if(newUrl.indexOf('DBID:all') !== -1){
     var dyArr1 = newUrl.split('-');
     var dyArr2 = [];
     var dyArr3 = [];
     for(var i=0; i<dyArr1.length; i++){
     dyArr2.push(dyArr1[i].split('//')[0]);
     }
     for(var i=0; i<dyArr2.length; i++){
     dyArr3.push(dyArr2[i].split(':')[1]);
     }
     // console.log(dyArr3);
     arr2 = dyArr3;
     $('.mod').eq(1).find('.first_item').eq(0).prop('disabled','disabled'); //49年前选中
     }
     else if(newUrl.indexOf('DBID:FZ_New') !== -1){
     var dyArr1 = newUrl.split('-');
     var dyArr2 = [];
     var dyArr3 = [];
     for(var i=0; i<dyArr1.length; i++){
     dyArr2.push(dyArr1[i].split('//')[0]);
     }
     for(var i=0; i<dyArr2.length; i++){
     dyArr3.push(dyArr2[i].split(':')[1]);
     }
     // console.log(dyArr3);
     arr2 = dyArr3;
     $('.mod').eq(1).find('.first_item').eq(0).prop('disabled','disabled'); //49年后选中
     }
     }else{
     //省市组合
     var proArr1 = newUrl.split('-');
     var proArr2 = [];
     var proArr3 = [];
     for(var i=0; i<proArr1.length; i++){
     if(proArr1[i].indexOf('City:all') !== -1){
     arr1.push(proArr1[i].split('//')[0].split(':')[1]);
     }else{
     var obj = {};
     obj.province = proArr1[i].split('//City:')[0].split(':')[1];
     obj.city = proArr1[i].split('//City:')[1].split(';');
     arr3.push(obj);
     }
     }
     // console.log(arr3);
     }
     }
     else{
     // console.log('单独组合');
     if(newUrl.indexOf('Dynasty') !== -1){
     arr2 = newUrl.split(':')[1].split(';');
     }else{
     arr1 = newUrl.split(':')[1].split(';');
     }
     }
     }else{
     return;
     }

     //一级赋值防止‘其他’重复
     function checkboxUniqe() {
     var areaDistribution,itemType;
     $('.mod').each(function () {
     var text = $(this).find('.hd>h3').text();
     if(text === '地区分布'){
     areaDistribution = $(this);
     }else if(text === '条目类型'){
     itemType = $(this);
     }
     });
     if(newUrl.indexOf('//') !== -1){  //如果为地区分布或者年代分布
     if(itemType){
     itemType.find('.first_item').each(function () {
     if($(this).next().data('area') === '其他'){
     $(this).prop('checked',false);
     }
     });
     }
     }else{
     if(areaDistribution){
     areaDistribution.find('.first_item').each(function () {
     if($(this).next().data('area') === '其他'){
     $(this).prop('checked',false);
     }
     });
     }
     }
     }

     //第一级赋值
     $('.first_item').each(function () {
     var _self = $(this);
     var selfText = _self.next().text().replace(/\([^\)]*\)/g,"");
     $.each(arr1, function (i, self) {
     if(self === selfText){
     _self.prop('disabled','disabled');
     }
     });
     checkboxUniqe();
     // console.log(arr1);
     // console.log(arr3);
     //省市组合赋值
     for(var i = 0; i < arr3.length; i++){
     if(arr3[i].province === selfText){
     var city = arr3[i].city;
     _self.siblings('.bd_province_list').find('.second_item').each(function () {
     var selfText2 = $(this).next().text().replace(/\([^\)]*\)/g,"");
     for(var i = 0; i < city.length; i++){
     if(city[i] === selfText2){
     $(this).prop('disabled','disabled');
     $(this).parents('.bd').find('.first_item').prop('disabled','disabled');
     }
     }
     });
     }
     }
     });

     //第二级赋值
     $('.second_item').each(function () {
     var _self = $(this);
     var selfText = _self.next().text().replace(/\([^\)]*\)/g,"");
     $.each(arr2, function (i, self) {
     if(self === selfText){
     _self.prop('disabled','disabled');
     }
     });
     if(_self.prop('checked')){
     modShowOrHide(_self, 'show');
     _self.parents('.bd_province_list').siblings('i').addClass('open');
     _self.parents('.bd_province_list').show();
     _self.parents('.bd_province_list').siblings('.first_item').prop('disabled','disabled');
     }
     });
     var i=0;
     $(".classify input[type='checkbox']").each(function () {
     var flag=$(this).attr("disabled");
     i++;
     });
     if(i!=0){
     $(".classify input[type='checkbox']").each(function () {
     var flag=$(this).attr("disabled");
     if(!flag){
     $(this).attr("disabled",true);
     }else{
     return false;
     }

     });
     }
     })();*/

    (function () {
        //选择字体高亮
        /*  $('.bd a').click(function () {
         if($(this).prev().prop('checked')){
         $(this).css('color','#999');
         /!*$(this).prev().prop('checked',false);*!/
         }else{
         $(this).css('color','#333');
         /!*$(this).prev().prop('checked',true);*!/
         }
         });*/
        $('.first_item,.second_item').click(function () {
            if($(this).prop('checked')){
                $(this).next().css('color','#333');
            }else{
                $(this).next().css('color','#999');
            }
        });
        $('.first_item,.second_item').each(function () {
            if($(this).prop('checked')){
                $(this).next().css('color','#333');
            }else{
                $(this).next().css('color','#999');
            }
        });
    })();

    //限制字数及格式化
    function limitCount(ele, maxVal) {
        var len = 0;
        var temp = [];
        $(ele).each(function () {
            var self = $.trim($(this).text());
            var newText = '';
            len = self.length;
            temp = self.split('');
            if(len > maxVal){
                for(var i = 0; i < maxVal-1; i++){
                    newText += temp[i];
                }
                $(this).text(newText+'...');
            }
        });
    }
    limitCount('.classify .bd_province_list li a', 10);
    limitCount('.mod .bd>li>a', 11);


    $('.alreadychecked').find('input').attr("disabled",true);
    $('.alreadychecked').parent().parent().find('.first_item').attr("disabled",true);
    $('.alreadychecked').siblings('li').find('input').attr("disabled",true);
    var $allLinks = $(".mod input:checkbox"),
        selectedType = "",
        typeTabsArr = [];
    $allLinks.click(function () {

        /* $allLinks.not(this).attr("disabled","disabled");*/
        var $this = $(this),
            $checkedParent = $(this).parents('.mod'),
            $checkedBox = $checkedParent.find('input:checkbox:checked'),
            checkLen = $checkedBox.length,
            checkedVal = '<div class=\'result\'>'+ $this.next().attr('data-area') + '<a class="remove-btn" href="javascript:">X</a></div>';

        if($this[0].checked) {
            typeTabsArr.push(checkedVal);
        }else {
            typeTabsArr.splice(typeTabsArr.indexOf(checkedVal),1);
        }
        var cluster_btn = $('.cluster-btn button');
        if (checkLen > 0) {
            $this.parents('.mod').siblings().find('input:checkbox').attr("disabled", true);//给BUTTON按钮的disabled属性赋值
            cluster_btn.css("background", "#2ba276");
            cluster_btn.removeAttr("disabled");
            selectedType = $checkedParent.find(".hd h3").text();
            selectedType= selectedType.tranTosimple();
        } else if($('.mod').find('.bd').find('li').hasClass('alreadychecked')){

            $('alreadychecked').find('input:checkbox').attr("disabled", true);
            $this.parents('.mod').siblings().find('li').not('.alreadychecked').find('input:checkbox').removeAttr("disabled");
            cluster_btn.css("background", "#999");
            cluster_btn.attr("disabled", true);


        }else{

            $this.parents('.mod').siblings().find('input:checkbox').removeAttr("disabled");
            cluster_btn.css("background", "#999");
            cluster_btn.attr("disabled", true);
        };

        if($('.mod').find('.bd').find('li').hasClass('alreadychecked'))
        {
            $('alreadychecked').find('input:checkbox').attr("disabled", true);
        }

        $('.clear-btn').click(function(){
            if($('input:checkbox:checked')){
                $('input:checkbox').removeAttr('checked');
                //$('input:checkbox').removeAttr("disabled");
                $('.mod').siblings().find('li').not('.alreadychecked').find('input:checkbox').removeAttr("disabled");
                $('.cluster-btn button').css("background", "#999");
                $('.cluster-btn button').attr("disabled", true);
                typeTabsArr = [];
            }

        });


        /*点击标签位置跟随变动*/
        mTop = $this.offset().top;
        m_top = $('.cluster-btn').offset().top;
        m_top = mTop;
        $('.cluster-btn').animate({top: m_top - 110}, 200);

    });



    $('.turn-btn').click(function () {
        $(this).parent().parent('.search-classify').toggleClass('auto-height');
        $(this).toggleClass('turn-down')
    });
    $('.reset-btn').click(function(){
        $("#filterQurey").attr("value","");
        var url = $('#initUrl').val(); //当前url
        var urlParas  =  "&facets="; ;
        $('#urlTemp').val(urlParas);
        $('#areaForm').attr('action', url).submit();
    });
    $(window).scroll(function () {
        if ($(window).scrollTop() < 600) {
            $('.cluster-btn').animate({
                top: $(window).scrollTop() + 100
            }, 5)
        }
    });


});

(function () {
    var filter=$("#filterQurey").val();
    // filter= decodeURI(filter);
    filter=filter.replace(/\(|\)|AND|OR/g,"");
    filter=filter.split("  ");
    if(filter!=null&&filter.length!=0) {
        var regionsearchcondition = "";
        var yearsearchcondition = "";
        var levelsearchcondition = "";
        var albumsearchcondition = "";
        var categorysearchcondition = "";
        var categoryCode_ForSearch = "";
        var item_type = "";
        for (var i = 0; i < filter.length; i++) {
            var str = filter[i];
            if (str.indexOf("Province:") != -1) {
                str = str.replace("Province:", "");
                if (regionsearchcondition.indexOf(str) == -1) {
                    regionsearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
                }
            }
            if (str.indexOf("City:") != -1) {
                str = str.replace("City:", "");
                regionsearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
            if (str.indexOf("DBID:") != -1) {
                str = str.replace("DBID:", "");
                if (str == "FZ_New") {
                    str = "1949年后";
                }
                if (str == "FZ_Old") {
                    str = "1949年前";
                }
                if (yearsearchcondition.indexOf(str) == -1) {
                    yearsearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
                }
            }
            if (str.indexOf("Dynasty:") != -1) {
                str = str.replace("Dynasty:", "");
                yearsearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
            if (str.indexOf("RegionLevel:") != -1) {
                str = str.replace("RegionLevel:", "");
                levelsearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
            if (str.indexOf("AlbumCategory:") != -1) {
                str = str.replace("AlbumCategory:", "");
                albumsearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
            if (str.indexOf("CategoryLevel:") != -1) {
                str = str.replace("CategoryLevel:", "");
                categorysearchcondition += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
            if (str.indexOf("CategoryCode_ForSearch:") != -1) {
                str = str.replace("CategoryCode_ForSearch:", "");
                categoryCode_ForSearch += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
            if (str.indexOf("Type:") != -1) {
                str = str.replace("Type:", "");
                item_type += "<div class=\"result\">" + str + "<a class=\"remove-btn\" href=\"javascript:\">X</a></div>";
            }
        }
        var newhtml = ""
        if (regionsearchcondition != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>地区分布</span>" + regionsearchcondition + "</div>";
        }
        if (yearsearchcondition != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>年代分布</span>" + yearsearchcondition + "</div>";
        }
        if (levelsearchcondition != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>地区级别</span>" + levelsearchcondition + "</div>";
        }
        if (albumsearchcondition != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>专辑分类</span>" + albumsearchcondition + "</div>";
        }
        if (categorysearchcondition != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>分类级别</span>" + categorysearchcondition + "</div>";
        }
        if (categoryCode_ForSearch != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>专题类型</span>" + categoryCode_ForSearch + "</div>";
        }
        if (item_type != "") {
            newhtml += " <div class=\"regin-classify select-box\"><span>条目类型</span>" + item_type + "</div>";
        }
        if (newhtml != "") {
            newhtml += "<div class=\"reset-box\"><a href=\"javascript:\" class=\"reset-btn\"></a><a href=\"javascript:\" class=\"turn-btn\"></a></div>";
        }
        if (newhtml!="") {
            $("#searchcondition").html(newhtml);
            $("#searchcondition").show();
        }
    }
})();
$('.remove-btn').click(function () {
    var htmlval= $(this).parent().html();//已经删除的条件
    var value=htmlval.substr(0,htmlval.indexOf("<"));
    //样式修改


    //重新组织检索条件
    var filter=$("#filterQurey").val();
    // filter= decodeURI(filter);
    filter=filter.replace(/\(|\)|AND|OR/g,"");
    filter=filter.split("  ");

    if(filter!=null&&filter.length!=0){
        var regionsearchcondition="";
        var citysearchcondition="";
        var yearsearchcondition="";
        var levelsearchcondition="";
        var albumsearchcondition="";
        var categorysearchcondition="";
        var categoryCode_ForSearch="";
        var item_type="";
        for(var i=0;i<filter.length;i++) {
            var str = filter[i];

            if(value.indexOf("1949")!=-1){
                var temp="";
                if(value.indexOf("1949年前")!=-1){
                    temp="FZ_Old";
                }else{
                    temp="FZ_New";
                }
                if(str.indexOf(temp)!=-1){
                    continue;//跳过删除的查询条件
                }
            }
            if(str.indexOf(value)!=-1){
                continue;//跳过删除的查询条件
            }
            if(str.indexOf("Province:")!=-1){
                if(str.indexOf(value)!=-1){//删除的省
                    continue;
                }
                var citysearchcondition="";
                for(var j=i+1;j<filter.length;j++){
                    var str0 = filter[j];
                    if(str0.indexOf("Province:")!=-1){//省节点
                        break;
                    }
                    if(str0.indexOf(value)!=-1){//删除的市
                        continue;
                    }
                    if(str0.indexOf("City:")!=-1){
                        if(citysearchcondition==""){
                            citysearchcondition=str0;
                        }else{
                            citysearchcondition+=(" OR "+str0);
                        }

                    }

                }
                if(regionsearchcondition==""){
                    regionsearchcondition+=str;
                    if(citysearchcondition!=""){
                        regionsearchcondition+=( " AND ("+citysearchcondition+")");
                    }
                }else{
                    if(citysearchcondition!=""){
                        regionsearchcondition+=( " OR (" +str+ " AND ("+citysearchcondition+"))");
                    }else{
                        regionsearchcondition+=( " OR " +str);
                    }
                }
            }
            if(str.indexOf("DBID:")!=-1){
                if(yearsearchcondition==""){

                    yearsearchcondition+=str;
                }else{
                    yearsearchcondition+=(" OR "+str);
                }

            }
            if(str.indexOf("Dynasty:")!=-1){
                if(yearsearchcondition==""){
                    yearsearchcondition+=str;
                }else{
                    yearsearchcondition+=(" OR "+str);
                }
            }

            if(str.indexOf("RegionLevel:")!=-1){
                if(levelsearchcondition==""){
                    levelsearchcondition=str;
                }else{
                    levelsearchcondition+=(" OR "+str);
                }
            }
            if(str.indexOf("AlbumCategory:")!=-1){
                if(albumsearchcondition==""){
                    albumsearchcondition=str;
                }else{
                    albumsearchcondition+=(" OR "+str);
                }
            }
            if(str.indexOf("CategoryLevel:")!=-1){
                if(categorysearchcondition==""){
                    categorysearchcondition=str;
                }else{
                    categorysearchcondition+=(" OR "+str);
                }
            }
            if(str.indexOf("CategoryCode_ForSearch:")!=-1){
                if(categoryCode_ForSearch==""){
                    categoryCode_ForSearch=str;
                }else{
                    categoryCode_ForSearch+=(" OR "+str);
                }
            }
            if(str.indexOf("Type:")!=-1){
                if(item_type==""){
                    item_type=str;
                }else{
                    item_type+=(" OR "+str);
                }
            }
        }
    }

    var filter="";
    if(regionsearchcondition!=""){
        filter+=(" AND ("+regionsearchcondition+")");
    }
    if(yearsearchcondition!=""){
        filter+=(" AND ("+yearsearchcondition+")");
    }
    if(levelsearchcondition!=""){
        filter+=(" AND ("+levelsearchcondition+")");
    }
    if(albumsearchcondition!=""){
        filter+=(" AND ("+albumsearchcondition+")");
    }
    if(categorysearchcondition!=""){
        filter+=(" AND ("+categorysearchcondition+")");
    }
    if(categoryCode_ForSearch!=""){
        filter+=(" AND ("+categoryCode_ForSearch+")");
    }
    if(item_type!=""){
        filter+=(" AND ("+item_type+")");
    }
    $("#filterQurey").attr("value",filter);
    var url = $('#initUrl').val(); //当前url
    var urlParas  =  "&facets="; ;
    $('#urlTemp').val(urlParas);
    $('#areaForm').attr('action', url).submit();
});

$(function () {
    $('input[name="sort"]').click(function() {
        var $this = $(this);
        var sort = $this.data('sort');
        if (sort == 'relate') {
            var sort="&sort=relate";
            var url = $('#initUrl').val(); //当前url
            if(url.indexOf("sort=date")!=-1){
                url=url.replace("&sort=date","")
                $('#initUrl').attr("value",url);
            }
            var urlParas  =  "&facets="; ;
            $('#urlTemp').val(urlParas);
            $('#areaForm').attr('action', url).submit();
        };
        if (sort == 'date') {
            var sort="&sort=date";
            var url = $('#initUrl').val(); //当前url
            var urlParas  =  "&facets="; ;
            $('#urlTemp').val(urlParas);
            $('#areaForm').attr('action', url+sort).submit();

        };
    });
});

function nextpage(page) {
    var url = $('#initUrl').val(); //当前url
    url+="&page="+page;
    var newUrl=$("#newUrl").val();
    $("#urlTemp").attr("value","&facets=");
    $('#areaForm').attr('action', url).submit();

}



