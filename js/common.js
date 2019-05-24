//页面公用JS
$(function () {
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

    //分页
    (function () {
        $('.wf-pagination').each(function () {
            var width = $(this).width();
            $(this).css('marginLeft',-width/2+'px');
        });
    })();

    //限制字数及格式化
    // function limitCount(ele, maxVal) {
    //     var len = 0;
    //     var temp = [];
    //     $(ele).each(function () {
    //         var self = $.trim($(this).text());
    //         var newText = '';
    //         len = self.length;
    //         temp = self.split('');
    //         if(len > maxVal){
    //             for(var i = 0; i < maxVal-1; i++){
    //                 newText += temp[i];
    //             }
    //             $(this).text(newText+'...');
    //         }
    //     });
    // }
    // limitCount('.classify .bd_province_list li a', 10);
    // limitCount('.zs_detail_title', 20, 'zs-title');
    //limitCount('.item-limit-len', 15, 'zs-title');
    // limitCount('.item_content', 200, 'content');
    //limitCount('.new-zs-list .item_content', 100, 'content');

    //导航页左侧选中状态
    function navLeftCurrentState(ele, currentClass, type) {
        var selfVal = '';
        var keywords = $.trim($(ele).val());
        $('.navPage li').each(function () {
            selfVal = $.trim($(this).find('a').text());
            var newSelfVal =selfVal .replace(/\([^\)]*\)/g,"");
            if (keywords === $.trim(newSelfVal)){
                if(type == 'parent'){
                    $(this).addClass(currentClass);
                }else{
                    $(this).find('a').addClass(currentClass);
                }
            }
        });
    }
    navLeftCurrentState('#key','current','parent');
    navLeftCurrentState('#key1','currentLink','child');

    //删除与父级同名的class
    (function () {
        var firstKeywords = $.trim($('.sidebarLinkVal').eq(0).val());
        var secondKeywords = $.trim($('.sidebarLinkVal').eq(1).val());
        if((firstKeywords !== secondKeywords)){
            $('.DynastyChildren').removeClass('current');
        }
    })();

    //监听enter事件
    function listenKeyEvent(keyNum, delegateEle, focusEle){
        $('html').bind('keydown',function(e){
            if($(focusEle).is(":focus")){
                if(e.keyCode === keyNum){
                    $(delegateEle).click();
                    e.stopPropagation();
                }
            }
        });
    }
    listenKeyEvent(13, '#search-btn2' , 'textarea.wf-input');//首页
    listenKeyEvent(13, '#search-btn1' , 'input.wf-input');//高级检索
    listenKeyEvent(13, '#search-book' , '#search-input');//书内检索

    //检索页当前目录高亮
    (function () {
        var mainTitle = $('.mod-info h2').text();
        $('.mod-catalog dd p[class^= lv]').each(function () {
           if($(this).text() === mainTitle){
               $(this).css('color','#f05e4f');
           }
        });
    })();

    //鼠标悬停志书显示标题
    (function () {
        $('.mod-list-b .item').each(function () {
            var titleText = $(this).find('.zs_title').text();
            $(this).find('img').attr('title',titleText);
        });
    })();

    //控制序号显示
    $('.zs_count').each(function () {
        var selfVal = $.trim($(this).text());
        var len = selfVal.length;
        if (len === 1){
            $(this).text('0' + selfVal);
        }
    });

    //控制footer显示位置
    (function () {
        function footerPosition() {
            var winH = $(window).height();
            var docH = $(document).height();
            if(docH <= winH) {
                $('.footer').addClass('footerFix');
            }
            else{
                $('.footer').removeClass('footerFix');
            }
        }
        footerPosition();
        $(window).resize(function () {
            footerPosition();
        });
    })();

    //控制footer简繁体
    $('.zh_click').click(function () {
        $(this).hide().siblings('.zh_click').show();
    });
    (function () {
        zh_init();
    });
    (function () {
        //控制小屏幕下导航显示
        $('.nav-toggle').click(function () {
            var offsetLeft = $('.nav-toggle').position().left-53;
            $('.nav-collapse').css('left',offsetLeft).slideToggle();
            $('#usergroups').hide();
        });

        //控制多用户下拉显示
        var userLength = $('.usershow').length;
        if(userLength > 1){
            $('.usergroup').hide();
            $('.userslidedown').show();
            $('.userslidedown').click(function () {
                var str = "";
                $('.usershow').each(function () {
                    var href = $(this).attr('href');
                    var userName = $(this).text();
                    str += '<a target="_blank" href='+href+'>'+userName+'</a>';
                });
                $('#usergroups').html(str);
                $('#usergroups').slideToggle();
                $('.nav-collapse').hide();
            });
        }

        $(window).resize(function () {
            var offsetLeft = $('.nav-toggle').position().left-53;
            $('.nav-collapse').css('left',offsetLeft);
            if($(window).width() >= 1350){
                $('.nav-collapse').hide();
            }
        });
    })();
});