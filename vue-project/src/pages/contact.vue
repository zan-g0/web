<template>
        <section class="p-5">
        <div class="container">
            <div class="row align-items-center justify-content-between">
                <div class="col-md">
                    <img src="@/assets/images/door.png" alt="1" class="img-fluid" />
                </div>
                <div class="col-md" p-5>
                    <h1>联系我们</h1>
                    <p class="lead">公司电话：</p>
                    <p class="lead">销售服务热线：</p>
                    <p class="lead">传真：</p>
                    <p class="lead">邮箱：</p>
                    <p class="lead">邮编：</p>
                    <p class="lead">地址：</p>
                </div>
            </div>
            </div>
            <!-- 在线地图嵌入 -->
            <div class="map my-map">
              <div id="mapContainer"></div>
            </div>
    </section>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 动态加载高德地图JS
  const script = document.createElement('script')
  script.src = 'https://webapi.amap.com/maps?v=1.3&key=e07ffdf58c8e8672037bef0d6cae7d4a'
  script.onload = () => {
    // @ts-ignore
    const AMap = window.AMap
    if (!AMap) return

    const center = { lng: 120.56871, lat: 27.994735 }
    const features = [{
      icon: "cir", color: "red", name: "浙江科原种业有限公司",
      desc: "浙江省温州市瓯海区郭溪街道西陶路12号4幢",
      lnglat: { lng: 120.568349, lat: 27.99473 },
      offset: { x: -9, y: -31 }, type: "Marker"
    }]

    const map = new AMap.Map("mapContainer", {
      center: [center.lng, center.lat],
      level: 17,
      keyboardEnable: true,
      dragEnable: true,
      scrollWheel: true,
      doubleClickZoom: true
    })

    features.forEach(data => {
      if (data.type === "Marker") {
        const marker = new AMap.Marker({
          map,
          position: [data.lnglat.lng, data.lnglat.lat],
          zIndex: 3,
          extData: data,
          offset: new AMap.Pixel(data.offset.x, data.offset.y),
          title: data.name,
        })

        // 添加信息窗体
        const infoWindow = new AMap.InfoWindow({
          content: `<div style="font-size:15px;font-weight:bold;">${data.name}</div>
                    <div style="font-size:13px;">${data.desc}</div>`,
          offset: new AMap.Pixel(0, -30)
        })
        infoWindow.open(map, [data.lnglat.lng, data.lnglat.lat])

        // 点击marker也可弹窗
        marker.on('click', () => {
          infoWindow.open(map, [data.lnglat.lng, data.lnglat.lat])
        })
      }
    })
  }
  document.body.appendChild(script)
})
</script>
<style scoped>
.my-map {
  margin: 30px auto 0 auto;
  width: 100%;
  max-width: 1000px;
  height: 520px;
  min-height: 300px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative;
}
#mapContainer {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 10px;
}
</style>