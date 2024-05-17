<template>
    <div id="container3">
      <div class="btn-line">
        <el-button type="text" @click="addLayer">加卫星图层</el-button>
        <el-button type="text" @click="addLayer1">加路网图层</el-button>
        <el-button type="text" @click="delLayer">移出图层</el-button>
        <el-button type="text" @click="delLayer1">移出路网图层</el-button>
        <el-button type="text" @click="addLayer2">加楼层图层</el-button>
        <el-button type="text" @click="delLayer2">移出楼层图层</el-button>
        <el-button type="text" @click="addLayer3">加热力图层</el-button>

        <el-button type="text" @click="addPoint">落点</el-button>
        <el-button type="text" @click="offPoint">关闭落点</el-button>
        <el-button type="text" @click="delPoint">清除落点</el-button>
      </div>
      <div class="btn-line1">
        <el-button type="text" @click="startDrawing1">画线</el-button>
        <el-button type="text" @click="endDrawing1">结束画线</el-button>
        <el-button type="text" @click="clearPolygon1">清除画线</el-button>
        <el-button type="text" @click="startDrawing">画多边形</el-button>
        <el-button type="text" @click="endDrawing">结束多边形</el-button>
        <el-button type="text" @click="clearPolygon">清除多边形</el-button>

        <el-button type="text" @click="muchSize('rule')">距离计算</el-button>
        <el-button type="text" @click="muchSize('measureArea')">面积计算</el-button>
        <el-button type="text" @click="muchSizeClose">清除计算图形</el-button>
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
      map: null,
      infoWindow: null,
      pointList: [],
      circle: [],
      polygonPath: [],
      polygon: null,
      drawingMode: false,
      polyEditor: null,
      polygonPath1: [],
      cluster: null,
      polygon1: null,
      drawingMode1: false,
      polyEditor1: null,
      satellite: null,
      mouseTool: null,
      satellite1: null,
      satellite2: null,
      key: '8d8fab1d10638b5ef4dfd2aa22383c90'
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
    addLayer() {
      this.satellite = new AMap.TileLayer.Satellite();
      this.map.addLayer(this.satellite);
    },
    delLayer() {
      this.map.removeLayer(this.satellite);
    },
    addLayer1() {
      this.satellite1 = new AMap.TileLayer.RoadNet();
      this.map.addLayer(this.satellite1);
    },
    delLayer1() {
      this.map.removeLayer(this.satellite1);
    },
    addLayer2() {
      this.satellite2 = // 楼块图层
        new AMap.Buildings({
          zooms: [16, 18],
          zIndex: 10,
          heightFactor: 2 //2倍于默认高度，3D下有效
        })
      this.map.addLayer(this.satellite2);
    },
    delLayer2() {
      this.map.removeLayer(this.satellite2);
    },
    addLayer3() {
      var heatmap;
      this.map.plugin(["AMap.HeatMap"], () => {
        //初始化heatmap对象
        heatmap = new AMap.HeatMap(this.map, {
          radius: 50, //给定半径
          opacity: [0, 1],
          gradient: {
            0.5: 'blue',
            0.65: 'rgb(248,14,120)',
            0.7: 'rgb(0, 255, 0)',
            0.9: '#ffea00',
            1.0: 'red'
          }
        });
        //设置数据集：该数据为北京部分“公园”数据
        heatmap.setDataSet({
          data: [{lng: 116.418261, lat: 39.921984, count: 50},
            {lng: 116.423332, lat: 39.916532, count: 51},],
          max: 100
        });
        heatmap.show()
      })
    },
    // delLayer2(){
    //   this.map.removeLayer(this.satellite2);
    // },
    clearPolygon() {
      if (this.polygon) {
        this.polygon.setMap(null);
        this.polygon = null;
        this.polygonPath = [];
      }
    },
    clearPolygon1() {
      if (this.polygon1) {
        this.polygon1.setMap(null);
        this.polygon1 = null;
        this.polygonPath1 = [];
      }
    },
    startDrawing() {
      this.drawingMode = true;
      this.polygonPath = [];
      this.polygon = new AMap.Polygon({
        map: this.map,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
        bubble: true
      });
      this.map.on('click', this.handleMapClick);
    },
    startDrawing1() {
      this.drawingMode1 = true;
      this.polygonPath1 = [];
      this.polygon1 = new AMap.Polyline({
        map: this.map,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
        bubble: true
      });
      this.map.on('click', this.handleMapClick1);
    },
    endDrawing() {
      this.drawingMode = false;
      this.map.off('click', this.handleMapClick);
      this.polyEditor = new AMap.PolygonEditor(this.map, this.polygon);
      this.polyEditor.open();
    },
    endDrawing1() {
      this.drawingMode1 = false;
      this.map.off('click', this.handleMapClick1);
      this.polyEditor1 = new AMap.PolylineEditor(this.map, this.polygon1);
      this.polyEditor1.open();
    },
    handleMapClick(e) {
      if (this.drawingMode) {
        this.polygonPath.push([e.lnglat.lng, e.lnglat.lat]);
        this.polygon.setPath(this.polygonPath);
      }
    },
    handleMapClick1(e) {
      if (this.drawingMode1) {
        this.polygonPath1.push([e.lnglat.lng, e.lnglat.lat]);
        this.polygon1.setPath(this.polygonPath1);
      }
    },
    offPoint() {
      this.map.off("click", this.addPointHandler);
    },
    delPoint() {
      this.map.remove(this.pointList);
      this.map.remove(this.circle);
      this.pointList = []
      this.circle = []
    },
    addPoint() {
      this.map.on("click", this.addPointHandler)
    },
    addPointHandler: function (e) {
      const lng = parseFloat(e.lnglat.lng);
      const lat = parseFloat(e.lnglat.lat);
      console.log(lng, lat);

      // 创建圆形覆盖物表示扫描范围
      let circle = new AMap.Circle({
        center: [lng, lat],
        radius: 1000,
        strokeColor: "#3366FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#3366FF",
        fillOpacity: 0.3,
        map: this.map,
      });
// 将圆形覆盖物添加到地图上
      circle.setMap(this.map);
// 将地图的旋转角度和倾斜角度设置为0，以确保地图保持水平状态
      this.map.setRotation(0); // 设置地图的旋转角度为0
      this.map.setPitch(0); // 设置地图的倾斜角度为0

      // 将圆形覆盖物添加到数组中
      this.circle.push(circle);

      // 创建标记点
      let marker = new AMap.Marker({
        map: this.map,
        position: [lng, lat],
        icon: `//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png`,
        offset: new AMap.Pixel(-13, -30),
        draggable: true,
        cursor: 'move',
      });

      // 添加点击事件监听器，打开信息窗口
      marker.on('click', () => {
        this.openInfo(lng, lat);
      });

      // 将标记点添加到数组中
      this.pointList.push(marker);
    },

    muchSizeClose() {
      this.mouseTool.close(true)//关闭，并清除覆盖物
      this.map.remove(this.mouseTool)
    },
    muchSize(type) {
      AMap.plugin(['AMap.MouseTool'], () => {
        this.mouseTool = new AMap.MouseTool(this.map);
        switch (type) {
          case 'rule': {
            this.mouseTool.rule({
              startMarkerOptions: {//可缺省
                icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  imageSize: new AMap.Size(19, 31),
                  image: "//webapi.amap.com/theme/v1.3/markers/b/start.png"
                }),
                offset: new AMap.Pixel(-9, -31)
              },
              endMarkerOptions: {//可缺省
                icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  imageSize: new AMap.Size(19, 31),
                  image: "//webapi.amap.com/theme/v1.3/markers/b/end.png"
                }),
                offset: new AMap.Pixel(-9, -31)
              },
              midMarkerOptions: {//可缺省
                icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  imageSize: new AMap.Size(19, 31),
                  image: "//webapi.amap.com/theme/v1.3/markers/b/mid.png"
                }),
                offset: new AMap.Pixel(-9, -31)
              },
              lineOptions: {//可缺省
                strokeStyle: "solid",
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 2
              }
              //同 RangingTool 的 自定义 设置，缺省为默认样式
            });
            break;
          }
          case 'measureArea': {
            this.mouseTool.measureArea({
              strokeColor: '#80d8ff',
              fillColor: '#80d8ff',
              fillOpacity: 0.3
              //同 Polygon 的 Option 设置
            });
            break;
          }
        }
      })
    },
    openInfo(lng, lat) {
      // Construct the content for the info window
      let info = [];
      info.push("<div class='input-card content-window-card'><div><img style=\"float:left;width:67px;height:16px;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
      info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>高德软件</h4>");
      info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
      info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");

      // Create a new info window associated with the marker
      let infoWindow = new AMap.InfoWindow({
        content: info.join("")  // Use default info window style to display content
      });

      // Open the info window when called
      infoWindow.open(this.map, [lng, lat]);
    },
    //对所有落点进行聚合
    markerUnion() {
      // 清除现有的聚合数据
      if (this.cluster) {
        this.cluster.setMap(null);
      }
      // console.log(this.pointList)
      // let points = []
      // for (let i = 0; i < this.pointList.length; i++) {
      //   points.push({weight: 1, lnglat: this.pointList[i].getPosition()},)
      // }
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
      //默认样式
      this.map.plugin(["AMap.MarkerCluster"], () => {
        this.cluster = new AMap.MarkerCluster(this.map, points, {gridSize: points.length});
      })
    },
    async initMap() {
      let AMap = await AMapLoader.load({
        key: this.key,             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      });
      this.map = new AMap.Map('container3', {
        rotateEnable: true,
        pitchEnable: true,
        zoom: 12,
        pitch: 50,
        rotation: -15,
        viewMode: '3D', //开启3D视图,默认为关闭
        zooms: [2, 20],
        center: [116.333926, 39.997245]
      });
      this.map.on("complete", function () {
        console.log("地图加载完成！");
      });
      //绑定地图移动与点聚合(缩放)事件
      this.map.on('moveend', this.logMapinfo1);
      this.map.on('zoomend', this.markerUnion);
    },
  }
}
</script>


<style lang="scss" scoped>
.btn {
  position: relative;
  width: 12rem;
  left: 3.6rem;
  margin: 10px 0 0 0;
}

#container3 {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;

  .btn-line {
    z-index: 9;
    top: 1vh;
    position: absolute;
    border-radius: 4px;
  }

  .btn-line1 {
    z-index: 9;
    top: 4vh;
    position: absolute;
    border-radius: 4px;
  }
}
</style>
