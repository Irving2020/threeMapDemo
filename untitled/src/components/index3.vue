<template>
    <div id="container2">
      <div class="btn-line1">
        <el-button type="text" @click="logMapInfos">层级与中心点</el-button>
        <el-button type="text" @click="add">添加Marker</el-button>
        <el-button type="text" @click="edit">更新Marker</el-button>
        <el-button type="text" @click="del">删除Marker</el-button>
        <el-button type="text" @click="textAdd">文本标记</el-button>
      </div>
      <div class="btn-line2">
        <el-button type="text" @click="anyMarker">自定义标记图标</el-button>
        <el-button type="text" @click="fixAnyMarker">多个可拖图标标记</el-button>
        <el-button type="text" @click="setFitView">自适应Marker</el-button>
        <el-button type="text" @click="dels">删除markers</el-button>
        <el-button type="text" @click="delWho">部分删除markers</el-button>
        <el-button type="text" @click="markerUnion">点聚合</el-button>
      </div>
      <div class="btn-line3">
        <el-button type="text" @click="guideWatch([116.478935, 39.997761],[
        [116.478935, 39.997761],
        [116.478939, 39.997825],
        [116.478912, 39.998549],
        [116.478912, 39.998549],
        [116.478998, 39.998555],
        [116.478998, 39.998555],
        [116.479282, 39.99856],
        [116.479658, 39.998528],
        [116.480151, 39.998453],
        [116.480784, 39.998302],
        [116.480784, 39.998302],
        [116.481149, 39.998184],
        [116.481573, 39.997997],
        [116.481863, 39.997846],
        [116.482072, 39.997718],
        [116.482362, 39.997718],
        [116.483633, 39.998935],
        [116.48367, 39.998968],
        [116.484648, 39.999861],
        [116.485123, 39.999426],
        [116.485645, 39.999028],
        [116.486212, 39.998659],
        [116.486823, 39.998329],
        [116.487477, 39.998042],
        [116.487564, 39.997977],
        [116.487645, 39.997905],
        [116.487719, 39.997828],
        [116.487787, 39.997746],
        [116.487846, 39.997661],
        [116.487899, 39.997573],
        [116.487945, 39.997483],
        [116.487985, 39.99739],
        [116.488019, 39.997296],
        [116.488047, 39.997199],
        [116.488069, 39.997101],
        [116.488086, 39.997001],
        [116.488098, 39.996899],
        [116.488105, 39.996796],
        [116.488106, 39.996692],
        [116.488102, 39.996587],
        [116.488094, 39.996481],
        [116.488081, 39.996374],
        [116.488062, 39.996266],
        [116.488039, 39.996158],
        [116.488011, 39.996049],
        [116.487979, 39.99594],
        [116.487942, 39.995831],
        [116.487902, 39.995722],
        [116.487857, 39.995613],
        [116.487808, 39.995505],
        [116.487756, 39.995398],
        [116.4877, 39.995292],
        [116.487641, 39.995187],
        [116.487579, 39.995084],
        [116.487514, 39.994982],
        [116.487446, 39.994882],
        [116.487376, 39.994783],
        [116.487303, 39.994687],
        [116.487228, 39.994593],
        [116.487152, 39.994501],
        [116.487074, 39.994411],
        [116.486995, 39.994324],
        [116.486915, 39.994239],
        [116.486834, 39.994157],
        [116.486752, 39.994077],
        [116.48667, 39.994],
        [116.486588, 39.993926],
        [116.486506, 39.993854],
        [116.486424, 39.993785],
        [116.486343, 39.993718],
        [116.486262, 39.993653],
        [116.486182, 39.99359],
        [116.486103, 39.993529],
        [116.486025, 39.99347],
        [116.485948, 39.993412],
        [116.485872, 39.993356],
        [116.485798, 39.993302],
        [116.485725, 39.99325],
        [116.485654, 39.993199],
        [116.485584, 39.99315],
        [116.485516, 39.993102],
        [116.485449, 39.993056],
        [116.485384, 39.993012],
        [116.485321, 39.992969],
        [116.485259, 39.992928],
        [116.485199, 39.992888],
        [116.48514, 39.99285],
        [116.485083, 39.992814],
        [116.485027, 39.992779],
        [116.484973, 39.992746],
        [116.48492, 39.992715],
        [116.484868, 39.992685],
        [116.484818, 39.992657],
        [116.484769, 39.99263],
        [116.484722, 39.992605],
        [116.484676, 39.992582],
        [116.484632, 39.99256],
        [116.484589, 39.992539],
        [116.484547, 39.99252],
        [116.484507, 39.992502],
        [116.484468, 39.992486],
        [116.48443, 39.992471],
        [116.484393, 39.992457],
        [116.484358, 39.992445],
        [116.484324, 39.992434],
        [116.484291, 39.992425]
      ])">轨迹回放</el-button>
        <el-button type="text" @click="setFitViewCar">自适应carMarker</el-button>
        <el-button type="text" @click="startAnimation()">动起来</el-button>
        <el-button type="text" @click="carStatus(0)">暂停</el-button>
        <el-button type="text" @click="carStatus(1)">继续</el-button>
        <el-button type="text" @click="carStatus(2)">停止</el-button>
        <el-button type="text" @click="carRemove">清除</el-button>
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
      dataSocket:null,
      show: false,
      map: null,
      center: null,
      goto: null,
      zoom: null,
      curLngLat: null,
      marker: {},
      city: {},
      key: '8d8fab1d10638b5ef4dfd2aa22383c90',
      markers: [],
      carMarker: null,
      passedPolyline: null,
      polyline: null,
      cluster: null,
      lineArr: []
    }
  },
  created() {
    this.initMap();
  },
  mounted() {
  },
  beforeDestroy() {
    this.map && this.map.clearMap();
    this.map && this.map.destroy();
    console.log("地图已销毁");
  },
  methods: {
    markerUnion() {
      let points = [
        { weight: 8, lnglat: ["116.506647", "39.795337"] },
        { weight: 1, lnglat: ["116.843352", "40.377362"] },
        { weight: 1, lnglat: ["116.637122", "40.324272"] },
        { weight: 1, lnglat: ["116.105381", "39.937183"] },
        { weight: 1, lnglat: ["116.653525", "40.128936"] },
        { weight: 1, lnglat: ["116.486409", "39.921489"] },
        { weight: 1, lnglat: ["116.658603", "39.902486"] },
        { weight: 1, lnglat: ["116.338033", "39.728908"] },
        { weight: 1, lnglat: ["116.235906", "40.218085"] },
        { weight: 1, lnglat: ["116.366794", "39.915309"] },
        { weight: 1, lnglat: ["116.418757", "39.917544"] },
        { weight: 1, lnglat: ["116.139157", "39.735535"] },
        { weight: 1, lnglat: ["116.195445", "39.914601"] },
        { weight: 1, lnglat: ["116.310316", "39.956074"] },
        { weight: 1, lnglat: ["116.286968", "39.863642"] },
      ];
      //聚合点样式
      let _renderClusterMarker = function (context) {
        //context 为回调参数，
        //包含如下属性 marker:当前聚合点，count:当前聚合点内的点数量
        let clusterCount = context.count; //聚合点内点数量
        context.marker.setContent(
          '<div style="background-color:#00ff00">' + clusterCount + "</div>"
        );
      };
      //非聚合点样式
      let _renderMarker = function (context) {
        //context 为回调参数，
        //包含如下属性 marker:当前非聚合点
        context.marker.setContent('<div style="background-color:#ff0000">1</div>');
      };
      let styles = [
        {
          //聚合量在1-10时，聚合点的样式
          url: "//a.amap.com/jsapi_demos/static/images/blue.png", //图标显示图片的地址
          size: new AMap.Size(32, 32), //图标显示图片的大小
          offset: new AMap.Pixel(-16, -16), //图标定位在地图上的位置相对于图标左上角的偏移值
          textColor: "#fff", //文字的颜色
        },
        {
          //聚合量在11-100时，聚合点的样式
          url: "//a.amap.com/jsapi_demos/static/images/green.png",
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16),
          textColor: "#fff",
        },
        {
          //聚合量在101-1000时，聚合点的样式
          url: "//a.amap.com/jsapi_demos/static/images/orange.png",
          size: new AMap.Size(36, 36),
          offset: new AMap.Pixel(-18, -18),
        },
      ];
      // this.map.plugin(["AMap.MarkerCluster"],  ()=> {
      //   this.cluster = new AMap.MarkerCluster(
      //     this.map, //地图实例
      //     points, //海量点数据，数据中需包含经纬度信息字段 lnglat
      //     {
      //       gridSize: 60, //数据聚合计算时网格的像素大小
      //       renderClusterMarker: _renderClusterMarker, //上述步骤的自定义聚合点样式
      //       renderMarker: _renderMarker, //上述步骤的自定义非聚合点样式
      //       styles: styles
      //     }
      //   );
      // });
      //默认样式
      this.map.plugin(["AMap.MarkerCluster"],  ()=> {
      this.cluster = new AMap.MarkerCluster(this.map, points, {gridSize: points.length});
    })
    },
    startAnimation() {
      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
        showDir: true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5",  //线颜色
        strokeWeight: 6,      //线宽
      });
      this.carMarker.on('moving', (e) => {
        this.passedPolyline.setPath(e.passedPath);
        this.map.setCenter(e.target.getPosition(), true)
        // 设置地图旋转角度跟随车辆行驶方向
        this.map.setRotation(e.target.getAngle());
      });
      // this.map.setFitView();
      this.carMarker.moveAlong(this.lineArr, {
        // 每一段的时长
        duration: 500,//可根据实际采集时间间隔设置
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true,
      });
    },
    carStatus(i) {
      if (i === 0) {
        this.carMarker.pauseMove();
      }
      if (i === 1) {
        this.carMarker.resumeMove();
      }
      if (i === 2) {
        this.carMarker.stopMove();
      }
    },
    setFitView() {
      // 第一个参数为空，表明用图上所有覆盖物 setFitview
      // 第二个参数为false, 非立即执行
      // 第三个参数设置上左下右的空白
      this.map.setFitView(null, false, [150, 60, 100, 60]);
    },
    setFitViewCar() {
      // 第一个参数为空，表明用图上所有覆盖物 setFitview
      // 第二个参数为false, 非立即执行
      // 第三个参数设置上左下右的空白
      this.map.setFitView(null, false, [150, 60, 100, 60]);
    },
    fixAnyMarker() {
      let positions = [[116.405467, 39.907761], [116.415467, 39.907761], [116.415467, 39.917761], [116.425467, 39.907761],
        [116.385467, 39.907761]];

      for (let i = 0, marker; i < positions.length; i++) {
        marker = new AMap.Marker({
          map: this.map,
          position: positions[i],
          icon: `//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-${i + 1}.png`,
          offset: new AMap.Pixel(-13, -30),
          draggable: true,
          cursor: 'move',
        });
        this.markers.push(marker);
      }
    },
    anyMarker() {
      // 以 icon URL 的形式创建一个途经点
      let viaMarker = new AMap.Marker({
        position: new AMap.LngLat(116.38, 39.92),
        // 将一张图片的地址设置为 icon
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-13, -30)
      });
      // 设置鼠标划过点标记显示的文字提示
      viaMarker.setTitle('我是marker的title');
      // label默认蓝框白底左上角显示，样式className为：amap-marker-label
      viaMarker.setLabel({
        direction: 'top',
        offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
        content: "<div class='info'>我是 marker 的 途经点 标签</div>", //设置文本标注内容
      });

      // 创建一个 Icon
      let startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(25, 34),
        // 图标的取图地址
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(135, 40),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(-9, -3)
      });

      // 将 icon 传入 marker
      let startMarker = new AMap.Marker({
        position: new AMap.LngLat(116.35, 39.89),
        icon: startIcon,
        offset: new AMap.Pixel(-13, -30)
      });

      // 创建一个 icon
      let endIcon = new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-95, -3)
      });

      // 将 icon 传入 marker
      let endMarker = new AMap.Marker({
        position: new AMap.LngLat(116.45, 39.93),
        icon: endIcon,
        offset: new AMap.Pixel(-13, -30)
      });

      // 将 markers 添加到地图
      this.map.add([viaMarker, startMarker, endMarker]);
    },
    textAdd() {
      // 创建纯文本标记
      let text = new AMap.Text({
        text: '纯文本标记',
        anchor: 'center', // 设置文本标记锚点
        draggable: true,
        cursor: 'pointer',
        angle: 10,
        style: {
          'padding': '.75rem 1.25rem',
          'margin-bottom': '1rem',
          'border-radius': '.25rem',
          'background-color': 'white',
          'width': '15rem',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
          'text-align': 'center',
          'font-size': '20px',
          'color': 'blue'
        },
        position: [116.396923, 39.918203]
      });
      text.setMap(this.map);
    },
    add() {
      this.marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: [116.397428, 39.90923],
        anchor: 'bottom-center'
      });
      this.map.add(this.marker);
    },
    edit() {
      // 自定义点标记内容
      let markerContent = document.createElement("div");
      // 点标记中的图标
      let markerImg = document.createElement("img");
      markerImg.className = "markerlnglat";
      markerImg.src = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png";
      markerImg.setAttribute('width', '25px');
      markerImg.setAttribute('height', '34px');
      markerContent.appendChild(markerImg);
      // 点标记中的文本
      let markerSpan = document.createElement("span");
      markerSpan.className = 'marker';
      markerSpan.innerHTML = "Hi，我被更新啦！";
      markerContent.appendChild(markerSpan);
      this.marker.setContent(markerContent); //更新点标记内容
      this.marker.setPosition([116.397428, 39.90923]); //更新点标记位置
    },
    del() {
      this.map.remove(this.marker);
      this.marker = {}
    },
    dels() {
      this.map.remove(this.markers);
      this.markers = []
    },
    carRemove() {
      this.map.remove(this.carMarker);
      this.map.remove(this.passedPolyline);
      this.map.remove(this.polyline);
      this.carMarker = {}
      this.lineArr = []
      this.passedPolyline = null
      this.polyline = null
    },
    delWho() {
      this.markers[0].setMap(null);
      this.map.remove(this.markers[0]);
    },
    async initMap() {
      let AMap = await AMapLoader.load({
        key: this.key,             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      });
      this.map = new AMap.Map('container2', {
        pitch: 50, //地图俯仰角度，有效范围 0 度- 83 度
        viewMode: '3D', //地图模式
        rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
        pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
        zoom: 17, //初始化地图层级
        keyboardEnable: true,
        rotation: -15, //初始地图顺时针旋转的角度
        zooms: [2, 20], //地图显示的缩放级别范围
        center: [116.333926, 39.997245] //初始地图中心经纬度
      });

      let satellite2 = // 楼块图层
        new AMap.Buildings({
          zooms: [16, 18],
          zIndex: 20,
          heightFactor: 2 //2倍于默认高度，3D下有效
        })
      this.map.addLayer(satellite2);

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
    guideWatch(any,all) {
      //npm i vue-amap --save
      // JSAPI2.0 使用覆盖物动画必须先加载动画插件
      AMap.plugin('AMap.MoveAnimation', () => {
        this.carMarker = new AMap.Marker({
          map: this.map,
          position: any,
          icon: "https://www.itmsf.com/source/plugin/dsu_paulsign/img/emot/nu.gif",
          offset: new AMap.Pixel(-13, -26),
        });
      });
      this.lineArr =  all
      // this.startAnimation()
    }
  }
  ,


}
</script>


<style lang="scss" scoped>
.info {
  position: relative;
  margin: 0;
  top: 0;
  right: 0;
  min-width: 0;
}

.info:hover {
  display: none;
}

#container2 {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;

  .btn-line1 {
    z-index: 9;
    left: 1vw;
    position: absolute;
    border-radius: 4px;
    margin-top: 1vh;
    color: #1d1e1f !important;
  }

  .btn-line2 {
    z-index: 9;
    left: 1vw;
    position: absolute;
    border-radius: 4px;
    margin-top: 5vh;
    color: #1d1e1f !important;
  }

  .btn-line3 {
    z-index: 9;
    left: 1vw;
    position: absolute;
    border-radius: 4px;
    margin-top: 9vh;
    color: #1d1e1f !important;
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

.marker {
  position: absolute;
  top: -20px;
  right: -118px;
  color: #fff;
  padding: 4px 10px;
  box-shadow: 1px 1px 1px rgba(10, 10, 10, .2);
  white-space: nowrap;
  font-size: 12px;
  font-family: "", serif;
  background-color: #25A5F7;
  border-radius: 3px;
}
</style>
