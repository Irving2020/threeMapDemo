 <!-- 
 *@description: 地图入口
 *@author: yh Fu
 *@date: 2024-05-13 10:11:52
 *@version: V1.0.5 
-->

<template>
   <div class="contain"
    >
      <div ref="map2dRef" style="width: 100%"></div>
      <!-- <div id="cesiumContainer" style="height: 100%;"></div> -->
      <div ref="mapRef" style="width:100%;height: 100% ;cursor: pointer;">
      </div>
      <ToolTip ref="toolTipRef" :data="toolTipData"></ToolTip>
    </div>
</template>


<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import {
  // Viewer,
  // ShadowMode,
  // Cartesian3,
  // Math as CesiumMath,
  // Color,
} from 'cesium'
// import * as Cesium from 'cesium'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ToolTip from "../tooltip";
import {
  // drawLineBetween2Spot,
  generateMapLabel2D,
  generateMapObject3D,
  generateMapSpot,
} from "./drawFunc";
import gsap from "gsap";

import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { initScene } from "./scene";
import { mapConfig } from "./mapConfig";
import { initCamera } from "./camera";

let lastPick
let scene
let eventFlag
export default {
  name:'Map3D',
  props:['geoJson','dblClickFn','projectionFnParam'],
  components:{
    ToolTip
  },
  data(){
    return {
      cesium :{
        viewer: null,
      },
      toolTipRef:null,
      toolTipData:{
        text:''
      },
      ratio:{
        value: 0,
      }
    }
  },
  mounted(){
    this.initCesium()
    // this.init()
    // this.startRenderLoop()
  },
  methods:{
    init(){
       /**
       * 初始化场景
       */
      scene = initScene()
      const currentDom = this.$refs.mapRef

       /**
       * 初始化摄像机
       */
      // const cvm = this.cesium.viewer.camera.viewMatrix
      // const civm = this.cesium.viewer.camera.inverseViewMatrix
      const { camera } = initCamera(currentDom);

       /**
       * 初始化渲染器
       */
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(currentDom.clientWidth, currentDom.clientHeight);
      // 防止开发时重复渲染
      // if (!currentDom.hasChildNodes()) {
      //   currentDom.appendChild(renderer.domElement);
      // }
      // 这里修改为下面写法，否则 onresize 不生效
      if (currentDom.childNodes[0]) {
        currentDom.removeChild(currentDom.childNodes[0]);
      }
      currentDom.appendChild(renderer.domElement);

      /**
       * 创建css2 Renderer 渲染器
       */
      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(currentDom.clientWidth, currentDom.clientHeight);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = "0px";
      const labelRendererDom = this.$refs.map2dRef;
      if (labelRendererDom?.childNodes[0]) {
        labelRendererDom.removeChild(labelRendererDom.childNodes[0]);
      }
      labelRendererDom.appendChild(labelRenderer.domElement);

       /**
       * 初始化模型（绘制3D模型）
       */
      const { mapObject3D, label2dData } = generateMapObject3D(
        this.geoJson,
        this.projectionFnParam
      );
      scene.add(mapObject3D);

       /**
       * 绘制 2D 面板
       */
      const labelObject2D = generateMapLabel2D(label2dData);
      mapObject3D.add(labelObject2D);

      /**
       * 绘制点位
       */
      const { spotList, spotObject3D } = generateMapSpot(label2dData);
      mapObject3D.add(spotObject3D);

      const modelObject3D = new THREE.Object3D();
      // let mixer: any = null;
      let modelMixer = [];
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);

      loader.load("/models/su7/source/SU7.glb", (glb) => {
        label2dData.forEach((item) => {
          // console.log(item, "0-0-0-");
          const { featureCenterCoord } = item;
          const clonedModel = glb.scene.clone();
          const mixer = new THREE.AnimationMixer(clonedModel);
          const clonedAnimations = glb.animations.map((clip) => {
            return clip.clone();
          });
          clonedAnimations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });

          // 添加每个model的mixer
          modelMixer.push(mixer);

          //添加材质
          clonedModel.traverse(function (child) {
              if (child.isMesh) {
                  // Create a new material or modify the existing one
                  const material = new THREE.MeshStandardMaterial({
                      color: '#1B9DA7', // Green color
                      metalness: 0.5,
                      roughness: 0.5
                  });

                  // child.material = material;

                  // Apply the material to the mesh
                  child.material = material;
              }
          });

          // 设置模型位置
          clonedModel.position.set(
            featureCenterCoord[0],
            -featureCenterCoord[1],
            mapConfig.spotZIndex + 10
          );
          // 设置模型大小
          clonedModel.scale.set(0.3, 0.3, 0.6);
          // clonedModel.rotateX(-Math.PI / 8);
          modelObject3D.add(clonedModel);
        });

        mapObject3D.add(modelObject3D);
      });
      
      /**
       * 绘制连线（随机生成两个点位）
       */
      const MAX_LINE_COUNT = 5; // 随机生成5组线
      let connectLine = [];
      for (let count = 0; count < MAX_LINE_COUNT; count++) {
        const midIndex = Math.floor(label2dData.length / 2);
        const indexStart = Math.floor(Math.random() * midIndex);
        const indexEnd = Math.floor(Math.random() * midIndex) + midIndex - 1;
        connectLine.push({
          indexStart,
          indexEnd,
        });
      }

      /**
       * 绘制飞行的点
       */
      // const flyObject3D = new THREE.Object3D();
      // const flySpotList = [];
      // connectLine.forEach((item) => {
      //   const { indexStart, indexEnd } = item;
      //   const { flyLine, flySpot } = drawLineBetween2Spot(
      //     label2dData[indexStart].featureCenterCoord,
      //     label2dData[indexEnd].featureCenterCoord
      //   );
      //   flyObject3D.add(flyLine);
      //   flyObject3D.add(flySpot);
      //   flySpotList.push(flySpot);
      // });
      // mapObject3D.add(flyObject3D);

      /**
       * 初始化控制器
       */
      // new OrbitControls(camera, renderer.domElement);
      new OrbitControls(camera, labelRenderer.domElement);

      /**
       * 新增光源
       */
      const light = new THREE.PointLight(0xffffff, 1.5);
      light.position.set(0, -5, 30);
      scene.add(light);

      // 创建光圈
      // const ringGeometry = new THREE.RingGeometry(30.5, 28, 39);
      const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load('../assets/logo.png')
      texture.mapping = THREE.EquirectangularReflectionMapping
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        map:texture,
        color: '#3E422E', 
        side: THREE.DoubleSide ,
        transparent:true,
        opacity:0.8,
        emissive: '#fff', // 设置发光颜色为白色
        emissiveIntensity: 1, // 设置发光强度为1
      })
      const ringMesh = new THREE.Mesh(cubeGeometry, ringMaterial);
      scene.add(ringMesh)

      // 创建一个蓝色边界的光圈
      const innerRingGeometry = new THREE.RingGeometry(28, 27.6, 39);
      const innerRingMaterial = new THREE.MeshBasicMaterial({ color: '#A5A973', side: THREE.DoubleSide });
      const innerRingMesh = new THREE.Mesh(innerRingGeometry, innerRingMaterial);

      // 设置光圈的位置
      innerRingMesh.position.set(0,-10,0); // 调整位置到适当的地图坐标
      // 翻转光圈
      innerRingMesh.rotation.x = Math.PI / 1.7; 
      innerRingMesh.rotation.y = Math.PI / 1.05; 
      scene.add(innerRingMesh);
      
      // 创建一个蓝色边界的光圈
      const outerRingGeometry = new THREE.RingGeometry(31, 30.6, 39);
      const outerRingMaterial = new THREE.MeshBasicMaterial({ color: '#A5A973', side: THREE.DoubleSide });
      const outerRingMesh = new THREE.Mesh(outerRingGeometry, outerRingMaterial);

      // 设置光圈的位置
      outerRingMesh.position.set(0,-10,0); // 调整位置到适当的地图坐标
      // 翻转光圈
      outerRingMesh.rotation.x = Math.PI / 1.7; 
      outerRingMesh.rotation.y = Math.PI / 1.05; 
      scene.add(outerRingMesh);

      // 设置光圈的位置
      ringMesh.position.set(0,-10,0); // 调整位置到适当的地图坐标
      // 翻转光圈
      ringMesh.rotation.x = Math.PI / 1.7; 
      ringMesh.rotation.y = Math.PI / 1.05; 
      console.log('光圈参数',ringMesh)
      scene.add(ringMesh);

      // 视窗伸缩
      function onResizeEvent() {
        // 更新摄像头
        camera.aspect = currentDom.clientWidth / currentDom.clientHeight;
        // 更新摄像机的投影矩阵
        camera.updateProjectionMatrix();
        // 更新渲染器
        renderer.setSize(currentDom.clientWidth, currentDom.clientHeight);
        labelRenderer.setSize(currentDom.clientWidth, currentDom.clientHeight);
        // 设置渲染器的像素比例
        renderer.setPixelRatio(window.devicePixelRatio);
      }

      /**
       * 设置 raycaster
       */
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

       // 鼠标移入事件
      const onMouseMoveEvent = (e) => {
        const intersects = raycaster.intersectObjects(scene.children);
        pointer.x = (e.clientX / currentDom.clientWidth) * 2 - 1;
        pointer.y = -(e.clientY / currentDom.clientHeight) * 2 + 1;
        // 如果存在，则鼠标移出需要重置
        if (lastPick) {
          // lastPick.object.material[0].color.set(mapConfig.mapColor);

          const color = mapConfig.mapColorGradient[Math.floor(Math.random() * 4)];
          lastPick.object.material[0].color.set(color);
          lastPick.object.material[0].opacity = mapConfig.mapOpacity; // 设置完全不透明
        }
        lastPick = null;
        // lastPick = intersects.find(
        //   (item: any) => item.object.material && item.object.material.length === 2
        // );
        // 优化
        lastPick = intersects.find(
          (item) => item.object.userData.isChangeColor
        );
        if (lastPick) {
          
          const properties = lastPick.object.parent.customProperties;
          if (lastPick.object.material[0]) {
            lastPick.object.material[0].color.set(mapConfig.mapHoverColor);
            lastPick.object.material[0].opacity = 1; // 设置完全不透明
          }

          // if (this.$refs.toolTipRef && this.$refs.toolTipRef.style) {
          //   this.$refs.toolTipRef.style.left = e.clientX + 2 + "px";
          //   this.$refs.toolTipRef.style.top = e.clientY + 2 + "px";
          //   this.$refs.toolTipRef.style.visibility = "visible";
          // }
          this.toolTipData.text = properties.name
        } else {
          // this.$refs.toolTipRef.style.visibility = "hidden";
        }
      };

      // 鼠标双击事件
      const onDblclickEvent = () => {
        const intersects = raycaster.intersectObjects(scene.children);
        const target = intersects.find(
          (item) => item.object.userData.isChangeColor
        );
        console.log('target',target);
        if (target) {
          const obj = target.object.parent;
          console.log('targetobj: ' + obj)
          console.log('dblClickFn: ' + this.dblClickFn)
          const p = obj.customProperties;
          this.dblClickFn(p);
        }
      };

      /**
       * 动画
       */
      gsap.to(mapObject3D.scale, { x: 2, y: 2, z: 1, duration: 1 });

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      // let previousTime = 0;

      const animate = function () {
        // const elapsedTime = clock.getElapsedTime();
        // const deltaTime = elapsedTime - previousTime;
        // previousTime = elapsedTime;

        // Update mixer
        // mixer?.update(deltaTime);
        const delta = clock.getDelta();
        modelMixer.map((item) => item.update(delta));

        // 雷达
        // this.ratio.value += 0.01;

        requestAnimationFrame(animate);
        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(pointer, camera);
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);

        // 圆环
        spotList.forEach((mesh) => {
          mesh._s += 0.01;
          mesh.scale.set(1 * mesh._s, 1 * mesh._s, 1 * mesh._s);
          if (mesh._s <= 2) {
            mesh.material.opacity = 2 - mesh._s;
          } else {
            mesh._s = 1;
          }
        });

        // 飞行的圆点
        // flySpotList.forEach(function (mesh) {
        //   mesh._s += 0.003;
        //   let tankPosition = new THREE.Vector3();
        //   // getPointAt() 根据弧长在曲线上的位置。必须在范围[0，1]内。
        //   tankPosition = mesh.curve.getPointAt(mesh._s % 1);
        //   mesh.position.set(tankPosition.x, tankPosition.y, tankPosition.z);
        // });
      };
      animate();

      if(!eventFlag){
        window.addEventListener("resize", onResizeEvent, false);
        window.addEventListener("mousemove", onMouseMoveEvent, false);
        window.addEventListener("dblclick", onDblclickEvent, false); 
        eventFlag = true
      }

    },
    initCesium(){
      // this.cesium.viewer.useDefaultRenderLoop = false  // 禁用Cesium渲染帧
      // this.cesium.viewer = new Viewer('cesiumContainer', {
      //   geocoder:false, //右上角 搜索
      //   homeButton:false, //右上角 Home
      //   sceneModePicker:false, //右上角 2D/3D切换
      //   baseLayerPicker:false,  //右上角 地形
      //   navigationHelpButton:false, //右上角 Help
      //   animation:false, // 左下角 圆盘动画控件
      //   timeline:false, //时间轴
      //   fullscreenButton:false, //右下角 全屏控件
      //   vrButton:false, // 如果设置为true，将创建VRButton小部件。
      //   scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
      //   infoBox: false, //隐藏点击要素后的提示信息
      // })
      // document.getElementById("cesiumContainer").style.display="none";
      this.init()
      // 隐藏版权
      // this.cesium.viewer._cesiumWidget._creditContainer.style.display = "none";

      // var promise = this.cesium.viewer.scene.open('http://www.supermapol.com/realspace/services/3D-ZhongGuoDiTu/rest/realspace');
      // this.cesium.when.all(promise, function (layers) {
      //     console.log(layers)
      //     var layer4 = scene.layers.find("Province_L@中国地图");
      //     var layerEffect4 = layer4.effect;
      //     layerEffect4.setValue('Color', new Cesium.Color(132 * 2 / 255, 143 * 2 / 255, 11 * 2 / 255, 1));
      //     layerEffect4.setValue('Width', 1);

      //     var layer3 = scene.layers.find("BorderA_L@中国地图");
      //     var layerEffect3 = layer3.effect;
      //     layerEffect3.setValue('Color', new Cesium.Color(6 * 2 / 255, 180 * 2 / 255, 224 * 2 / 255, 1));
      //     layerEffect3.setValue('Width', 3);

      //     var layer1 = scene.layers.find("Province_R@中国地图");
      //     layer1.style3D.fillForeColor = new Cesium.Color(0 / 255, 180 / 255, 255 * 2 / 255, 0.6);


      //     var layer0 = scene.layers.find("ProvinceCity@中国地图");
      //     layer0.indexedDBSetting.isAttributesSave = true;//保存属性
      //     layer0.showLabel = true;

      //     layer0.labelStyle = new Cesium.S3MTilesLabelStyle({
      //         fillColor: Cesium.Color.WHITE,
      //         outlineColor: Cesium.Color.RED,
      //         font: '44px Calibri',
      //         outlineWidth: 2.0,
      //         scale: 0.5,
      //         fillStyle: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //         textField: 'Name',
      //         pixelOffset: new Cesium.Cartesian2(0, -5)
      //     });
      // });
      // const center = Cartesian3.fromDegrees(
      //   (minWGS84[0] + maxWGS84[0]) / 2,
      //   (minWGS84[1] + maxWGS84[1]) / 2 - 1,
      //   200000
      // )
      // setTimeout(() => {
      //   this.cesium.viewer.camera.flyTo({
      //     destination: Cartesian3.fromDegrees(125.331345,43.891262, 50000.0),
      //     duration:5,
      //     complete: () => {
      //       // 定位完成之后的回调函数
      //       document.getElementById("cesiumContainer").style.display="none";
      //       this.init()
      //     },
      //   });
      // },3000)
    },
    //同步两个渲染器的渲染
    startRenderLoop() {
      this.init()
      this.cesium.viewer.render()
      requestAnimationFrame(this.startRenderLoop)
    },
  },
  watch:{
    geoJson(){
      this.init()
    }
    // geoJson:{
    //   immediate: true,
    //   handler(){
    //     console.log('geoJson',this.geoJson)
    //     this.init()
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.contain{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>