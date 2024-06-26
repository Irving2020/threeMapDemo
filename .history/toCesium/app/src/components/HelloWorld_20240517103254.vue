<template>
  <div style="width: 100%;height: 100%;">
    <div id="cesiumContainer" style="width: 100%; height: 100vh;z-index: 1000;"></div>
    <ThreeMap id="threeMap" style="display: none;"></ThreeMap>
  </div>
</template>

<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import ThreeMap from '@/components/ThreeMap.vue'
import * as Cesium from 'cesium'

class DrawPolygons {
  constructor() {
    this.layer = new Cesium.CustomDataSource('MyLines')
    this.activeShapePoints = []
    this.activeShape = undefined
    this.handler = undefined
  }
  /**
   * 添加鼠标点击事件
   * @param {Cesium.Viewer} viewer 目标地图
   */
  bindAction(viewer) {
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    // 鼠标左键单击画点
    this.handler.setInputAction((click) => {
      const earthPosition = this.getPosition(viewer, click.position)
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          this.activeShapePoints.push(earthPosition)
          const dynamicPositions = new Cesium.CallbackProperty(() => {
            return new Cesium.PolygonHierarchy(this.activeShapePoints);
          }, false);
          this.activeShape = this.drawPolygon(dynamicPositions)
        }
        this.activeShapePoints.push(earthPosition)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 鼠标移动
    this.handler.setInputAction((move) => {
      if (this.activeShapePoints.length >= 2) {
        const earthPosition = this.getPosition(viewer, move.endPosition)
        if (Cesium.defined(earthPosition)) {
          this.activeShapePoints.pop()
          this.activeShapePoints.push(earthPosition)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 单击鼠标右键结束画面
    this.handler.setInputAction(() => {
      this.activeShapePoints.pop();
      this.layer.entities.remove(this.activeShape)
      this.drawPolygon(this.activeShapePoints)
      this.activeShapePoints = []
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  /**
   * 添加鼠标点击事件的位置
   * @param {Cesium.Viewer} viewer 目标地图
   * @param {Cesium.Cartesian2} position 鼠标位置
   * @return {Cesium.Cartesian3} 鼠标点击位置的坐标
   */
  getPosition(viewer, position) {
    let earthPosition = undefined
    // 球面
    if (viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
      earthPosition = viewer.scene.camera.pickEllipsoid(position);
    }
    // 地形
    else {
      const ray = viewer.camera.getPickRay(position);
      earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    }
    return earthPosition
  }
  /**
   * 画面
   * @param {array<Cesium.Cartesian3>} positionData 面边界坐标
   */
  drawPolygon(positionData) {
    return this.layer.entities.add({
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.7)
        ),
      },
    });
  }
  /**
   * 添加图层
   * @param {Cesium.Viewer} viewer 目标地图
   */
  addToMap(viewer) {
    viewer.dataSources.add(this.layer);
  }
}
export default {
  name:'HelloWorld',
  components:{
    ThreeMap
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const viewer = new Cesium.Viewer('cesiumContainer',{
        geocoder:false, //右上角 搜索
        homeButton:false, //右上角 Home
        sceneModePicker:false, //右上角 2D/3D切换
        baseLayerPicker:false,  //右上角 地形
        navigationHelpButton:false, //右上角 Help
        animation:false, // 左下角 圆盘动画控件
        timeline:false, //时间轴
        fullscreenButton:false, //右下角 全屏控件
        vrButton:false, // 如果设置为true，将创建VRButton小部件。
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        infoBox: false, //隐藏点击要素后的提示信息
      });
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        //判断是否支持图像渲染像素化处理
        viewer.resolutionScale = window.devicePixelRatio
      }
      viewer.scene.postProcessStages.fxaa.enabled = true
      // viewer.scene.debugShowFramesPerSecond = true // 显示帧率

      const drawPolygons = new DrawPolygons()
      drawPolygons.bindAction(viewer)
      drawPolygons.addToMap(viewer)
 
      viewer._cesiumWidget._creditContainer.style.display="none"; //隐藏版本信息

      setTimeout(() => {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(125.331345,43.891262, 50000.0),
          duration:5,
          complete: function callback() {
            // 定位完成之后的回调函数
            document.getElementById("threeMap").style.display="block";
          },
        });
      },3000)
    },
  },
}
</script>

<style lang="scss" scoped>
#cesiumContainer {
  position: absolute;
  height: 100%;
  width: 100%;
}
.cesium-viewer-toolbar,             /* 右上角按钮组 */
.cesium-viewer-animationContainer,  /* 左下角动画控件 */
.cesium-viewer-timelineContainer,   /* 时间线 */
.cesium-viewer-bottom               /* logo信息 */
{
  display: none;
}

::-webkit-scrollbar{
  display: none;
}
</style>
