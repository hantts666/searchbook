$(function(){
    // 折叠功能
    $('body').on('click', '#list i', function() {
        var $this = $(this);
        var len = $(this).parent('h3').next('ul').find('li').length;
        if(len !== 0){
            if ($this.hasClass('open')) {
                $this.removeClass('open').parent('h3').siblings('ul').hide();
            } else {
                $this.addClass('open').parent('h3').siblings('ul').show();
            }
        }
    });

    //子集显示
    $('#list>li,#list>li ul li').each(function () {
        var len = $(this).find('ul>li').length;
        if(len === 0){
            $(this).find('i').addClass('open');
        }
    });

    //data-index
    $('#stoolbarDir>li').each(function (i) {
        $(this).attr("data-index",i);
    });
    $('#list>li').each(function (i) {
        $(this).find('span').attr("name",i);
    });

    //mod-list-right高度
    function modListRightHeight() {
        var winH = $(window).height();
        var otherH = $('.mod-cover').outerHeight(true);
        if(otherH < (winH - 300)) {
            $('.mod-list-right').outerHeight(winH - 300);
        }else{
            $('.mod-list-right').outerHeight(otherH - 46);
        }
    }
    modListRightHeight();

    //重载footer位置
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
            modListRightHeight();
            footerPosition();
        });
    })();

    //左侧目录控制
    var listAnchor = $('.anchor');
    var stoolbarDir = $('#stoolbarDir');
    var mainDocument = $('.mod-list-right');
    var STOOLBAR_DIR_ITEM_HEIGHT = 34; // 导航项高度
    var stoolbarDirScrollStep = STOOLBAR_DIR_ITEM_HEIGHT * 4; // 按钮控制导航每次滚动距离

    // 导航滚动
    function stoolbarDirScroll(that, index) {
        if (index < 7) {
            stoolbarDir.stop().animate({
                'top': 0
            }, 'fast');
        } else {
            var stoolbarDirTop = that.position().top;
            stoolbarDir.stop().animate({
                'top': -stoolbarDirTop + STOOLBAR_DIR_ITEM_HEIGHT * 7
            }, 'fast');
        };
    };

    // 导航项点击
    stoolbarDir.delegate('li', 'click', function () {
        var elsIndex = $(this).index();
        var elsId = $(this).stop().attr('data-index');
        // var elsTop = $('span[name="' + elsId + '"]').offset().top; // 点击项对应的列表项到文档顶端的距离
        var elsTop = $('span[name="' + elsId + '"]').position().top;
        stoolbarDirScroll($(this), elsIndex);
        mainDocument.animate({
            scrollTop: elsTop + 14
        }, 'fast');
    });

    // 页面滚动
    $("#stoolbarDir").find('li').eq(0).addClass('current');
    mainDocument.scroll(function () {
        for (var i = listAnchor.length - 1; i >= 0; i--) {
            if (($(this).scrollTop()-14) >= listAnchor.eq(i).position().top) {
                var index = i;
//						console.log($(this).scrollTop());
//						console.log(listAnchor.eq(i).position().top);
                var curItem = stoolbarDir.find('li').eq(index);
//						console.log(curItem);
                curItem.addClass('current').siblings().removeClass('current');
                stoolbarDirScroll(curItem, index);
                return false;
            }
        }
    });

    // 按钮功能
    $('#stoolbarBtnUp').bind('click', function () {
        var stoolbarDirTop = stoolbarDir.position().top;
//				console.log(stoolbarDirTop);
        if (Math.abs(stoolbarDirTop) > stoolbarDirScrollStep) {
            stoolbarDir.stop().animate({
                'top': '+=' + stoolbarDirScrollStep
            }, 'fast');
        } else {
            stoolbarDir.stop().animate({
                'top': 0
            }, 'fast');
        }
    });
    $('#stoolBarBtnDown').bind('click', function () {
        var stoolbarDirTop = stoolbarDir.position().top;
//				console.log(stoolbarDirTop);
        if (Math.abs(stoolbarDirTop) >= listAnchor.length * STOOLBAR_DIR_ITEM_HEIGHT - STOOLBAR_DIR_ITEM_HEIGHT * 8 - stoolbarDirScrollStep) {
            stoolbarDir.stop().animate({
                'top': -(listAnchor.length * STOOLBAR_DIR_ITEM_HEIGHT - STOOLBAR_DIR_ITEM_HEIGHT * 8)
            }, 'fast');
        } else {
            stoolbarDir.stop().animate({
                'top': '-=' + stoolbarDirScrollStep
            }, 'fast');
        }
    });

    //书内检索
    $("#search-book").click(function () {
        var keywords = $.trim($("#search-input").val());
        var flag = $(this).data('flag');
        var hiddenId = $(this).prev().val();
        if(keywords != ''){
            if(flag === 'new'){
                location.href = "/insideSearch/newLocalchronicle.do?q=" + encodeURIComponent(keywords) + '&fq=' + encodeURIComponent(hiddenId);
            }
            else if(flag === 'old'){
                location.href = "/insideSearch/oldLocalchronicle.do?q=" + encodeURIComponent(keywords) + '&fq=' + encodeURIComponent(hiddenId);
            }
        }else{
            alert('请输入关键词')
        }
    });

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

    //书内检索回显
    (function () {
        var insideFlag = getQueryString('inside');
        if(insideFlag !== undefined){
            $('#search-input').val(decodeURIComponent(insideFlag));
            $('.inslideSearch ').show();
            $('.inslideSearch ').click(function () {
                $('#search-book').click();
            });
        }
    })();
});