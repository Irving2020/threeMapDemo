<template>
  <div class="container">
    <div id="cesiumContainer"></div>
    <canvas id="threeContainer"></canvas>
  </div>
</template>

//
<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import {
  Viewer,
  // ShadowMode,
  Cartesian3,
  Math as CesiumMath,
  Color,
} from 'cesium'
import * as THREE from 'three'
const chinaJson = require('../../public/SampleData/china-mercator.json')
import * as Cesium from 'cesium'

const cesium = {
  viewer: null,
}
const three = {
  renderer: null,
  camera: null,
  scene: null,
}
// boundaries in WGS84 around the object
let minWGS84 = [125.331345, 43.891262]
let maxWGS84 = [126.331345, 41.55]

const _3Dobjects = []
function _3DObject() {
  this.threeMesh = null //Three.js 3DObject.mesh
  this.minWGS84 = null //location bounding box
  this.maxWGS84 = null
}

export default {
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initCesium()
      this.initThreejs()
      this.init3DObject()
      this.startRenderLoop()
    },
    initCesium() {
      cesium.viewer = new Viewer('cesiumContainer', {
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
      })
      // const center = Cartesian3.fromDegrees(
      //   (minWGS84[0] + maxWGS84[0]) / 2,
      //   (minWGS84[1] + maxWGS84[1]) / 2 - 1,
      //   200000
      // )
      setTimeout(() => {
        cesium.viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(125.331345,43.891262, 50000.0),
          duration:5,
          complete: function callback() {
            // 定位完成之后的回调函数
            // document.getElementById("threeMap").style.display="block";
          },
        });
      },3000)
    },
    initThreejs() {
      const canvas = document.querySelector('#threeContainer')
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        logarithmicDepthBuffer: true,
        antialias: true,
      })

      var fov = 45
      var width = canvas.clientWidth
      var height = canvas.clientHeight
      var aspect = width / height
      var near = 1
      var far = 10 * 1000 * 1000
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

      const scene = new THREE.Scene()

      three.renderer = renderer
      three.scene = scene
      three.camera = camera

    },
    init3DObject() {
      let chinaMapLine = Cesium.GeoJsonDataSource.load(chinaJson,{
          stroke: Cesium.Color.AQUA,
          fill: Cesium.Color.PALETURQUOISE.withAlpha(0.5),//填充区域设置为透明
          strokeWidth: 10,//在这里设置线宽度无效，所以在下边单独进行了线条样式设置
        });
        //使用 entity.polygon.hierarchy._value.positions设置线条的颜色
        //单独设置线条样式
        chinaMapLine.then(dataSource => {
          this.cesiumViewer.dataSources.add(dataSource);
          let entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          // let polyPositions = entity.polygon.hierarchy.getValue(
          // Cesium.JulianDate.now()
          // ).positions;
          // let positions = entity.polygon.hierarchy._value.positions;
          entity.polyline = {
            // positions: positions,
            width: 2,
            material: Cesium.Color.fromBytes(3, 255, 255)
          };
        }
      })

      // Cesium entity
      const entity = {
        name: 'Polygon',
        polygon: {
          hierarchy: Cartesian3.fromDegreesArray([
            minWGS84[0],
            minWGS84[1],
            maxWGS84[0],
            minWGS84[1],
            maxWGS84[0],
            maxWGS84[1],
            minWGS84[0],
            maxWGS84[1],
          ]),
          material: Color.RED.withAlpha(0.2),
        },
      }
      cesium.viewer.entities.add(entity)
      //Three.js Objects
      /**
       *  three的坐标系（右手坐标系），关键数据结构 Vector3
       *    Y
       *    |
       *    |___ X
       *   /
       * Z
       *
       * Cesium的坐标系，关键数据结构 Cartesian3
       *    Z
       *    |
       *    |__ Y
       *   /
       * X
       *
       */
      // 在three的坐标系空间里，先向Z轴平移模型，然后绕X轴向上翻转90度，物体就面向Y轴了，对应Cesiumn的Z轴
      // Lathe geometry
      var doubleSideMaterial = new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
      })
      var segments = 10
      var points = []
      for (var i = 0; i < segments; i++) {
        points.push(
          new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2)
        )
      }
      var geometry = new THREE.LatheGeometry(points)
      var latheMesh = new THREE.Mesh(geometry, doubleSideMaterial)
      latheMesh.scale.set(1500, 1500, 1500) //scale object to be visible at planet scale
      latheMesh.position.z += 15000 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      latheMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
      var latheMeshYup = new THREE.Group()
      latheMeshYup.add(latheMesh)
      three.scene.add(latheMeshYup) // don’t forget to add it to the Three.js scene manually

      //Assign Three.js object mesh to our object array
      var _3DOB = new _3DObject()
      _3DOB.threeMesh = latheMeshYup
      _3DOB.minWGS84 = minWGS84
      _3DOB.maxWGS84 = maxWGS84
      _3Dobjects.push(_3DOB)

      // dodecahedron
      geometry = new THREE.DodecahedronGeometry()
      var dodecahedronMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshNormalMaterial()
      )
      dodecahedronMesh.scale.set(10000, 10000, 10000) //scale object to be visible at planet scale
      dodecahedronMesh.position.z += 10000 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      dodecahedronMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
      var dodecahedronMeshYup = new THREE.Group()
      dodecahedronMeshYup.add(dodecahedronMesh)
      three.scene.add(dodecahedronMeshYup) // don’t forget to add it to the Three.js scene manually

      //Assign Three.js object mesh to our object array
      _3DOB = new _3DObject()
      _3DOB.threeMesh = dodecahedronMeshYup
      _3DOB.minWGS84 = minWGS84
      _3DOB.maxWGS84 = maxWGS84
      _3Dobjects.push(_3DOB)

      // Configure Three.js meshes to stand against globe center position up direction
      for (const id in _3Dobjects) {
        minWGS84 = _3Dobjects[id].minWGS84
        maxWGS84 = _3Dobjects[id].maxWGS84
        // convert lat/long center position to Cartesian3
        const center = Cartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2
        )

        // get forward direction for orienting model
        const centerHigh = Cartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2,
          1
        )

        // use direction from bottom left to top left as up-vector

        // configure entity position and orientation
        _3Dobjects[id].threeMesh.position.copy(center)
        _3Dobjects[id].threeMesh.lookAt(
          centerHigh.x,
          centerHigh.y,
          centerHigh.z
        )
      }

    },
    threeRender() {
      // Clone Cesium Camera projection position so the
      // Three.js Object will appear to be at the same place as above the Cesium Globe
      three.camera.matrixAutoUpdate = false
      const cvm = cesium.viewer.camera.viewMatrix
      const civm = cesium.viewer.camera.inverseViewMatrix

      three.camera.lookAt(0, 0, 0)
      three.camera.matrixWorld.set(
        civm[0],
        civm[4],
        civm[8],
        civm[12],
        civm[1],
        civm[5],
        civm[9],
        civm[13],
        civm[2],
        civm[6],
        civm[10],
        civm[14],
        civm[3],
        civm[7],
        civm[11],
        civm[15]
      )
      three.camera.matrixWorldInverse.set(
        cvm[0],
        cvm[4],
        cvm[8],
        cvm[12],
        cvm[1],
        cvm[5],
        cvm[9],
        cvm[13],
        cvm[2],
        cvm[6],
        cvm[10],
        cvm[14],
        cvm[3],
        cvm[7],
        cvm[11],
        cvm[15]
      )
      const canvas = three.renderer.domElement
      three.renderer.setPixelRatio(window.devicePixelRatio)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const needResize = canvas.width !== width || canvas.height !== height
      if (needResize) {
        three.renderer.setSize(width, height, false)
      }
      three.camera.aspect = width / height
      three.camera.fov = CesiumMath.toDegrees(cesium.viewer.camera.frustum.fovy)
      three.camera.updateProjectionMatrix()
      three.renderer.render(three.scene, three.camera)
    },
    startRenderLoop() {
      cesium.viewer.render()
      this.threeRender()
      requestAnimationFrame(this.startRenderLoop)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  height: 100%;
  width: 100%;
}

#cesiumContainer {
  position: absolute;
  height: 100%;
  width: 100%;
}

#threeContainer {
  position: absolute;
  height: 100%;
  width: 100%;
  margin: 0%;
  z-index: 10;
  pointer-events: none;
}
</style>
