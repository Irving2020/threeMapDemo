<template>
    <div id="container1">
      <div class="btn-line">
        <el-button type="text" @click="logMapInfos">层级与中心点</el-button>
<!--        <el-button type="text" @click="add">添加Marker</el-button>-->
<!--        <el-button type="text" @click="del">删除Marker</el-button>-->
<!--        <el-button type="text" class="btn" value="开始动画" id="start" onclick="startAnimation()"/>-->
        <el-input placeholder="搜索城市与天气" @input="gotoCity" v-model="goto"></el-input>
      </div>
      <div class="pop_zoom_move">
        <div class="transition-box">
          <span>地图级别:{{ zoom }}</span>
          <br>
          <span>{{ center }}</span>
          <br>
          <span>坐标: {{ curLngLat }}</span>
          <br>
          <span>地区: {{ city }}</span>
          <br>
          <span>温度: {{ this.colo.temperature }}</span>
          <br>
          <span>天气: {{ this.colo.weather }}</span>
          <br>
          <span>风力: {{ this.colo.windPower }}</span>
        </div>
      </div>
  </div>
</template>

<script>


import * as AMapLoader from "@amap/amap-jsapi-loader";

window._AMapSecurityConfig = {
  securityJsCode: '2deb97c955047c77a94086653c7acbb9'
}

export default {
  data() {
    return {
      show: false,
      map: null,
      center: null,
      goto: null,
      zoom: null,
      curLngLat: null,
      marker: {},
      city: {},
      colo: {},
      key: '8d8fab1d10638b5ef4dfd2aa22383c90',
    }
  },
  created() {
    this.initMap();
  },
  mounted() {
  },
  beforeDestroy() {
    this.map && this.map.destroy();
    console.log("地图已销毁");
  },
  methods: {
    add() {
      this.marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: [116.397428, 39.90923],
        anchor: 'bottom-center'
      });
      this.map.add(this.marker);
    },
    del() {
      this.map.remove(this.marker);
    },
    async initMap() {
      let AMap = await AMapLoader.load({
        key: this.key,             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      });
      this.map = new AMap.Map('container1', {
        rotateEnable:true,
        pitchEnable:true,
        zoom: 17,
        pitch: 50,
        rotation: -15,
        viewMode:'3D', //开启3D视图,默认为关闭
        zooms:[2,20],
        center:[116.333926,39.997245]
      });
      this.map.on("complete", function () {
        console.log("地图加载完成！");
      });
      this.map.on('click', (e) => {
        this.curLngLat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        console.log(this.curLngLat)
      });
      //绑定地图移动与缩放事件
      this.map.on('moveend', this.logMapinfo1);
      this.map.on('zoomend', this.logMapinfo);
    },
    logMapinfo1() {
      this.map.getCity((info) => {
        this.city = info
        console.log(info)
      })
    },
    logMapinfo() {
      this.show = true
      let zoom = this.map.getZoom(); //获取当前地图级别
      let center = this.map.getCenter(); //获取当前地图中心位置
      this.zoom = zoom;
      this.center = '经度: ' + center.lng + '\n' + '纬度: ' + center.lat
      console.log('地图级别: ', zoom)
      console.log('中心位置: ', center)
    },
    logMapInfos() {
      //绑定按钮事件，改变地图层级与中心点
      let zoom = Math.floor(Math.random() * 7) + 11;
      let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6;
      let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6;
      this.map.setZoomAndCenter(zoom, [lng, lat]); //同时设置地图层级与中心点
      console.log(`当前层级已设为${zoom}级，中心点已设为 ${lng.toFixed(6)},${lat.toFixed(6)}`);
    },
    gotoCity() {
      this.map.setCity(this.goto)
      //加载天气查询插件
      AMap.plugin("AMap.Weather",  ()=> {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive(this.goto,  (err, data)=> {
          console.log('天气');
          console.log(err, data);
          this.colo={temperature:data.temperature,weather:data.weather,windPower:data.windPower}
          //err 正确时返回 null
          //data 返回实时天气数据，返回数据见下表
        });
      });
    }

  },


}
</script>


<style lang="scss" scoped>
#container1 {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  position: relative;

  .btn-line {
    display: flex;
    z-index: 91;
    left: 1vw;
    top: 1vh;
    position: absolute;
    border-radius: 4px;
  }

  .transition-box {
    top: 1vh;
    right: 10vw;
    position: absolute;
    width: 300px;
    height: 200px;
    border-radius: 4px;
    background-color: #dce3ea;
    text-align: left;
    color: #151414;
    box-sizing: border-box;
    margin-right: 20px;
    z-index: 9;

    span {
      font-size: 12px;
    }
  }
}
</style>
