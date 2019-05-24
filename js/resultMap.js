/**
 * Created by yanglilong on 2017/6/19.
 */
var map = new BMap.Map('mod-map', {enableMapClick:false}); // 创建Map实例，关闭默认地图POI事件
// map.centerAndZoom(new BMap.Point('107.6442270867326','35.72680075452996'), 14); // 地图中心、级别
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT});  //左上角，添加默认缩放平移控件
map.disableDoubleClickZoom(); //禁止双击缩放
// map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

// //控制序号显示
// $('.zs_count').each(function () {
//     var selfVal = $.trim($(this).text());
//     var len = selfVal.length;
//     if (len === 1){
//         $(this).text('0' + selfVal);
//     }
// });

//页面初始化数据
var initMapData = [];
$('.zs_title').each(function (i) {
    var itemMapdata = {};
    if($(this).data('city') != ''){
        var cityName = $(this).data('city');
        var lng = $(this).data('lng');
        var lat = $(this).data('lat');
        var order = $(this).prev().text();
        var title = $(this).text();
        var link = $(this).attr('href');
        itemMapdata.cityName = cityName;
        itemMapdata.lng = lng;
        itemMapdata.lat = lat;
        itemMapdata.order = order;
        itemMapdata.title = title;
        itemMapdata.link = link;
        initMapData.push(itemMapdata);
    }
});

//多种数据类型数组去重 删除重复坐标，防止重复渲染
Array.prototype.arrUniq = function() {
    var temp,arrVal,
        array = this,
        arrClone = array.concat(),//克隆数组
        typeArr = {//数组原型
            'obj' : '[object Object]',
            'fun' : '[object Function]',
            'arr' : '[object Array]',
            'num' : '[object Number]'
        },
        ent = /(\u3000|\s|\t)*(\n)+(\u3000|\s|\t)*/gi;//空白字符正则
    //把数组中的object和function转换为字符串形式
    for(var i = arrClone.length; i--;){
        arrVal = arrClone[i];
        temp = Object.prototype.toString.call(arrVal);

        if(temp == typeArr['num'] && arrVal.toString() == 'NaN'){
            arrClone[i] = arrVal.toString();
        }
        if(temp == typeArr['obj']){
            arrClone[i] = JSON.stringify(arrVal);
        }

        if(temp == typeArr['fun']){
            arrClone[i] = arrVal.toString().replace(ent,'');
        }
    }
    //去重关键步骤
    for (var i = arrClone.length; i--;) {
        arrVal = arrClone[i];
        temp = Object.prototype.toString.call(arrVal);

        if(temp == typeArr['arr']) arrVal.arrUniq();//如果数组中有数组，则递归
        if (arrClone.indexOf(arrVal) != arrClone.lastIndexOf(arrVal)) {//如果有重复的，则去重
            array.splice(i,1);
            arrClone.splice(i, 1);
        }
        else{
            if(Object.prototype.toString.call(array[i]) != temp){
                //检查现在数组和原始数组的值类型是否相同，如果不同则用原数组中的替换，原因是原数组经过了字符串变换
                arrClone[i] = array[i];
            }
        }
    }
    return arrClone;
};
// initMapData = initMapData.arrUniq();
// console.log(initMapData);

//根据经纬极值计算绽放级别。
function getZoom (maxLng, minLng, maxLat, minLat) {
    var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。
    var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A
    var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B
    var distance = map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位
    for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
        if(zoom[i] - distance > 0){
            // return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
            return 18-i+2;
        }
    };
}

//根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别。
function setZoom(points){
    if(points.length>0){
        var maxLng = points[0].lng;
        var minLng = points[0].lng;
        var maxLat = points[0].lat;
        var minLat = points[0].lat;
        var res;
        for (var i = points.length - 1; i >= 0; i--) {
            res = points[i];
            if(res.lng > maxLng) maxLng = res.lng;
            if(res.lng < minLng) minLng = res.lng;
            if(res.lat > maxLat) maxLat = res.lat;
            if(res.lat < minLat) minLat = res.lat;
        };
        var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;
        var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;
        var zoom = getZoom(maxLng, minLng, maxLat, minLat);
        map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom);
    }else{
        //没有坐标，显示全中国
        map.centerAndZoom(new BMap.Point(103.388611,35.563611), 5);
    }
}
// setZoom(initMapData);
//让所有覆盖物显示在可视区域
function allPointsShowViewport(data) {
    if(data.length > 0){
        var view = map.getViewport(eval(data));
        var mapZoom = view.zoom;
        var centerPoint = view.center;
        (mapZoom > 12) ? mapZoom = 12 : mapZoom;
        // console.log('当前缩放级别：'+mapZoom);
        map.centerAndZoom(centerPoint,mapZoom);
    }else{
        map.centerAndZoom(new BMap.Point(103.388611,35.563611), 3);
    }
}
allPointsShowViewport(initMapData);

//自定义地图标注
function ComplexCustomOverlay(point, text, titleText, cityName, link){
    this._point = point;
    this._text = text;
    this._titleText = titleText;
    this._city = cityName;
    this._link = link;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map){
    this._map = map;
    var div = this._div = document.createElement("div");
    div.setAttribute('class', 'titleMapShowLeft');
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.background = "url(/page/img/result-icon.png) no-repeat 1px 0";
    div.style.color = "#fff";
    div.style.width = "28px";
    div.style.height = "34px";
    div.style.lineHeight = "26px";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "14px";
    div.style.textAlign = "center";
    //显示序号容器
    var span = this._span = document.createElement("span");
    div.appendChild(span);
    span.appendChild(document.createTextNode(this._text));
    var that = this;
    //显示标题容器
    var arrow = this._arrow = document.createElement("div");
    arrow.setAttribute('class', 'titleMapShowRight');
    arrow.setAttribute('data-city', this._city);
    arrow.setAttribute('data-link', this._link);
    arrow.style.top = "2px";
    arrow.style.left = "26px";
    div.appendChild(arrow);
    arrow.appendChild(document.createTextNode(this._titleText));
    div.onmouseover = function(){
        this.style.background = "url(/page/img/result-icon.png) no-repeat -26px 0";
        this.style.zIndex = '9999';
        arrow.style.color = "#2d78bd";
        // this.getElementsByTagName("span")[0].innerHTML = that._overText;
        // arrow.style.backgroundPosition = "0px -20px";
    }
    div.onmouseout = function(){
        this.style.background = "url(/page/img/result-icon.png) no-repeat 1px 0";
        this.style.zIndex = BMap.Overlay.getZIndex(that._point.lat);
        arrow.style.color = "#2ba276";
        // this.getElementsByTagName("span")[0].innerHTML = that._text;
        // arrow.style.backgroundPosition = "0px 0px";
    }
    map.getPanes().labelPane.appendChild(div);
    return div;
}
ComplexCustomOverlay.prototype.draw = function(){
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top  = pixel.y - 30 + "px";
}

//把所有点添加到地图上
function setAllOverlay() {
    for (var i = initMapData.length-1; i >= 0; i--) {
        var conText = initMapData[i]['order'];
        var titleText = initMapData[i]['title'];
        var cityName = initMapData[i]['cityName'];
        var dataLink = initMapData[i]['link'];
        var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(initMapData[i]['lng'],initMapData[i]['lat']), conText, titleText, cityName, dataLink);
        // console.log(myCompOverlay);
        map.addOverlay(myCompOverlay);
    }
    //控制序号显示
    $('.titleMapShowLeft span').each(function () {
        var selfVal = $.trim($(this).text());
        var len = selfVal.length;
        if (len === 1){
            $(this).text('0' + selfVal);
        }
    });
}
setAllOverlay();

//JS事件兼容性写法
var eventUtil={
    addHandler: function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on" + type, handler);
        }else{
            element["on" + type] = handler;
        }
    },
    getEvent:function(event){
        return event ? event : window.event;
    },

    getTarget:function(event){
        return event.target || event.srcElement;
    },
    getPageX : function(event) {
        var result = event.pageX,
            doc = document;
        if (!result && result !== 0) {
            result = (event.clientX || 0)
                + (doc.documentElement.scrollLeft
                || doc.body.scrollLeft);
        }
        return result;
    },
    getPageY :function (event) {
        var result = event.pageY,
            doc = document;
        if (!result && result !== 0) {
            result = (event.clientY || 0)
                + (doc.documentElement.scrollTop
                || doc.body.scrollTop);
        }
        return result;
    },
    removeHandler: function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on" + type,handler);
        }else{
            element["on" + type] = null;
        }
    }
};

$(function () {
    //标题hover的时候地图高亮
    $('.zs_title').hover(function () {
        var self = $(this);
        var count = self.prev().text();
        var titleText = self.text();
        $('.titleMapShowRight').each(function () {
           if(self.data('city') === $(this).data('city')){
               $(this).parent().addClass('currentMapTitle');
               $(this).text(titleText);
               $(this).prev().text(count);
           }
        });
        allPointsShowViewport(initMapData);
    },function () {
        $('.titleMapShowLeft').removeClass('currentMapTitle');
    });

    //点击标题跳转详情页
    function linkToDetailPage() {
        $('.titleMapShowLeft').on('click',function () {
            var self = $(this);
            var selfLink = self.find('.titleMapShowRight').data('link');
            $('.zs_title').each(function () {
                var link = $(this).attr('href');
                if(link.indexOf(selfLink) != -1){
                    // location.href = link;
                    window.open(link);
                }
            });
        });
    }

    //地图标题显示动态宽度计算
    function titleMapMaxWidth(ele,mapWrap) {
        $(ele).each(function () {
            var left = $(this).position().left;
            var selfWid = $(this).width();
            var right = mapWrap-(left + selfWid);
            if(left > mapWrap/2){
                $(this).find('.titleMapShowRight').css({
                    right:'26px',
                    left:'',
                    maxWidth:left-5
                });
            } else{
                $(this).find('.titleMapShowRight').css({
                    left:'26',
                    maxWidth:right-5
                });
            }
        });
    }
    titleMapMaxWidth('.titleMapShowLeft',240);

    //页面添加mask
    function addMask() {
        var mask = "<div class='mapMask'>123456789</div>"
        $("body").append(mask).css('overflow','hidden');
    }

    //删除mask
    function removeMask() {
        $("body").css('overflow','auto');
        $('.mapMask').remove();
    }

    //添加控件和比例尺
    function add_controlSize(controlName){
        controlName.addControl(top_left_control);
        controlName.addControl(top_left_navigation);
    }

    //移除控件和比例尺
    function delete_controlSize(controlName){
        controlName.removeControl(top_left_control);
        controlName.removeControl(top_left_navigation);
    }
    
    //自定义关闭大图控件
    // 定义一个控件类,即function
    function ZoomControl(){
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(10, 10);
    }
    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();
    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function(map){
        // 创建一个DOM元素
        var div = document.createElement("div");
        // 添加文字说明
        div.appendChild(document.createTextNode("×"));
        div.setAttribute('class', 'closeNewMap');
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
    }

    //添加关闭控件到地图种
    function add_controlClose(controlName){
        // 创建控件
        var closeCtrl = new ZoomControl();
        controlName.addControl(closeCtrl);
    }
    //删除关闭控件
    function delete_controlClose(controlName){
        var closeCtrl = new ZoomControl();
        controlName.removeControl(closeCtrl);
    }
    
    //创建新地图实例
    function newBmap() {
        map = new BMap.Map('mod-map', {enableMapClick:false}); //重新创建地图
        map.setMaxZoom(11);//设置地图允许的最大级别
        map.setMinZoom(5);//设置地图允许的最小级别
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        setAllOverlay(); //打点
        allPointsShowViewport(initMapData); //可视区自适应
        add_controlSize(map); //添加比例尺控件
        add_controlClose(map); //添加关闭控件
        linkToDetailPage(); //点击标题跳转
    }

    //右侧map点击放大地图
    function changeMapContainer() {
        $('.mod-rank').hide(); //隐藏右侧sidebar
        $("#mod-map").addClass('mod-map-zoom');
        if($('.sidebar').hasClass('sidebarResultFixd')){ //点击地图时判断右侧是否固定
            $('.sidebar').removeClass('sidebarResultFixd');
            $('#mod-map').addClass('mod-map-fixed');
        }
        newBmap(); //创建新地图实例
        titleMapMaxWidth('.titleMapShowLeft',1200); //标题显示宽度
        addMask();
        eventUtil.addHandler(map,'zoomend',function(){ //地图缩放的时候重新打点
            this.clearOverlays();
            setAllOverlay(); //打点
            linkToDetailPage(); //点击标题跳转
        });
    }
    // console.log(map.Va);
    eventUtil.addHandler(map,'click', changeMapContainer);

    //点击关闭控件关闭大图
    $('#mod-map').on('click','.closeNewMap',function () {
        $('.mod-rank').show(); //隐藏右侧sidebar
        if($('#mod-map').hasClass('mod-map-fixed')){ //点击关闭的时候判断是否固定
            $('.sidebar').addClass('sidebarResultFixd');
            $('#mod-map').removeClass('mod-map-fixed');
        }
        $("#mod-map").removeClass('mod-map-zoom');
        map = new BMap.Map('mod-map', {enableMapClick:false}); //重新创建地图
        setAllOverlay(); //打点
        allPointsShowViewport(initMapData); //可视区自适应
        delete_controlSize(map); //添加比例尺控件
        delete_controlClose(map); //添加关闭控件
        titleMapMaxWidth('.titleMapShowLeft',240); //标题显示宽度
        eventUtil.addHandler(map,'click', changeMapContainer);//重新注册map事件
        removeMask();
    });

    //滚动右侧固定
    var curWinHeight = $(window).height();
    $(window).resize(function () {
        curWinHeight = $(window).height();
    });
    $(window).scroll(function () {
        var isShow = $('#mod-map').hasClass('mod-map-zoom');
        if(!isShow){
            if($(this).scrollTop() > 133 && curWinHeight > 720){
                $('.sidebar').addClass('sidebarResultFixd');
            } else{
                $('.sidebar').removeClass('sidebarResultFixd');
            }
        } else{
            if($(this).scrollTop() > 133){
                $('#mod-map').addClass('mod-map-fixed');
            }else{
                $('#mod-map').removeClass('mod-map-fixed');
            }
        }
    });

});
