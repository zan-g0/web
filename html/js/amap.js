function initMap() {
    // 双重验证
    if (typeof AMap === 'undefined') {
        console.error('高德地图 API 未加载');
        return;
    }

    // 地图初始化代码
    var map = new AMap.Map('mapContainer', {
        viewMode: '2D',
        zoom: 16,
        center: [120.699516, 27.922431],
        showIndoorMap: false
    });

    // 添加控件
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
    });

    // 添加标记点
    var marker = new AMap.Marker({
        position: [120.699516, 27.922431],
        title: "公司位置"
    });
    map.add(marker);
}

// 暴露初始化方法
window.initAMap = function() {
    initMap();
};