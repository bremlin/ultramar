import {Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {AuthService} from '../../services/auth.service';
import {TextSprite} from '@seregpie/three.text-sprite';
import {ModelService} from '../model.service';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';



// Параметры
let RAYCAST_PICKING = true;
let MULTI_SELECTION_MODE = false;
// Градусы ротации
let X_ROTATION = 0;
let Y_ROTATION = 0;
let Z_ROTATION = 0;
// <-- Параметры

let container;

let controls;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let raycaster;
let mouse = { x : 0, y : 0 };

let objects = [];


let modelUrl;


let meshName;

export class Mesh {
  name: 'NaN';
}

@Component({
  selector: 'app-main-model',
  templateUrl: './main-model.component.html'
})
export class MainModelComponent implements OnInit, OnDestroy {

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
    private modelService: ModelService
  ) {
    if (localStorage.getItem('modelPath') == null) {
      localStorage.setItem('modelPath', '../../assets/models/fbx/test1.fbx');
    }
  }

  condition = true;
  mesh: Mesh = new Mesh();

  status;
  showSectionInfo = true;
  axesScene;
  axesCamera;
  axesRenderer;
  axesWidth = 50;
  axesHeight = 50;
  axesCameraDistance = 100;
  axesFontLoader = new THREE.FontLoader();

  // Цвета hex для осей X,Y,Z
  axesHexColor = [
    0xff0000, // Красный цвет
    0x008000, // Зеленый цвет
    0x0000ff // Синий цвет
  ];

  private meshName;
  raycaster;
  mouseVector;
  objects = [];
  isOnObject;
  controls: any;
  skybox;
  spotLight;

  modelType;
  modelValue;

  meshMap = new Map();
  pickedMeshArr = [];
  infoMap = new Map();
  meshArr = [{id: [], color: []}];
  meshColor = null;
  name = '';
  switch = false;
  onOffCubes = [];
  pickedGroup = [];
  pickedMeshColorArr = [];

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private frameId: number = null;

  ngOnInit(): void {

    this.init();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  ngOnDestroy(): void {
    console.log('main-model destroy');
    this.meshMap.clear();
    this.meshArr.shift();
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    localStorage.removeItem('model');
    localStorage.removeItem('modelPath');
  }

  // Смена модели 00_genplan / test
  switchModel() {
    if (localStorage.getItem('model').toString() === '3') {
      localStorage.setItem('model', '1');
      localStorage.setItem('modelPath', '../../assets/models/fbx/test1.fbx');
      window.location.reload();
    } else if (localStorage.getItem('model').toString() === '1') {
      localStorage.setItem('model', '3');
      localStorage.setItem('modelPath', '../../assets/models/fbx/test.fbx');
      window.location.reload();
    }
  }

  init() {
    container = document.getElementById( 'rendererContainer' );

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 45, 30000 );
    this.camera.position.set(500, 200, 500);

    // scene
    this.scene = new THREE.Scene();

    if (localStorage.getItem('model').toString() === '3') {
      const ambientLight = new THREE.AmbientLight('#ffffff', 1);
      this.scene.add( ambientLight );
    } else {
      const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
      this.scene.add( ambientLight );
    }


    if (localStorage.getItem('model').toString() === '3') {
      var geometry = new THREE.BoxGeometry(600, 600, 1);
      var material = new THREE.MeshPhongMaterial({
        color: '#5c5b5c'
      });
      var cube = new THREE.Mesh(geometry, material);
      cube.rotateX(-Math.PI / 2);
      cube.position.setY(-5);
      cube.receiveShadow = true;
      this.scene.add(cube);
    }

    if (localStorage.getItem('model').toString() === '1') {
      const pointLight = new THREE.PointLight( '#FFFFFF', 0.8 );
      this.camera.add( pointLight );
    }
    this.scene.add( this.camera );

    // Скайбокс
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( 'assets/skyboxes/harmony/harmony_ft.jpg' );
    let texture_bk = new THREE.TextureLoader().load( 'assets/skyboxes/harmony/harmony_bk.jpg' );
    let texture_up = new THREE.TextureLoader().load( 'assets/skyboxes/harmony/harmony_up.jpg' );
    let texture_dn = new THREE.TextureLoader().load( 'assets/skyboxes/harmony/harmony_dn.jpg' );
    let texture_rt = new THREE.TextureLoader().load( 'assets/skyboxes/harmony/harmony_rt.jpg' );
    let texture_lf = new THREE.TextureLoader().load( 'assets/skyboxes/harmony/harmony_lf.jpg' );
    materialArray.push( new THREE.MeshBasicMaterial( { map: texture_ft } ) );
    materialArray.push( new THREE.MeshBasicMaterial( { map: texture_bk } ) );
    materialArray.push( new THREE.MeshBasicMaterial( { map: texture_up } ) );
    materialArray.push( new THREE.MeshBasicMaterial( { map: texture_dn } ) );
    materialArray.push( new THREE.MeshBasicMaterial( { map: texture_rt } ) );
    materialArray.push( new THREE.MeshBasicMaterial( { map: texture_lf } ) );
    for (let i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;
    let skyboxGeo = new THREE.BoxGeometry( 30000, 30000, 30000 );
    this.skybox = new THREE.Mesh( skyboxGeo, materialArray );
    this.skybox.position.copy(this.camera.position);
    this.scene.add( this.skybox );
    //
    const manager = new THREE.LoadingManager();

    // Менеджер загрузки для FBXLoader
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onLoad = () => {
      this.status = 'Готово';
      console.log( 'Loading complete!');
      this.condition = false;

      if (localStorage.getItem('model').toString() === '3') {
        let spotLight = new THREE.SpotLight('#ffffff', 1.07);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.angle = 0.4;
        spotLight.penumbra = 0.2;
        spotLight.distance = 350;
        spotLight.position.set(10, 100, 150);
        const helper = new THREE.SpotLightHelper(spotLight);
        // this.scene.add(helper);
        this.scene.add(spotLight);
      }

    };
    manager.onError = (url) => {
      this.status = 'Ошибка';
      console.log( 'There was an error loading ' + url );
    };
    manager.onStart = () => {
      this.status = 'Загрузка';
      console.log( 'Loading start');
    };

    // Загрузчик
    const loader = new FBXLoader( manager );

    const fbxLoader = () => {
      loader.load(localStorage.getItem('modelPath').toString(), ( object ) => {
        object.scale.set(0.1, 0.1, 0.1);
        // object.rotateX(-Math.PI / 2); // Ось X красная
        // object.rotateY(Math.PI / 2); // Ось Y зеленая
        // object.rotateZ(Math.PI / 2); // Ось Z синяя
        object.traverse( (child) => {
          if (child instanceof THREE.Group) {
            // let group = new THREE.Object3D();
            // group.add(child);
            this.onOffCubes.push( child );
            this.scene.add(child);
          }
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            objects.push( child );
          } else if (child instanceof THREE.SpotLight) {
            this.spotLight = child;
          }
        });
        // this.scene.add( object );
        // objects.push( object );
        // console.log( objects );
        // for (let i = 0; i < this.objects.length; i++) {
        //   const boxHelper1 = new THREE.BoxHelper(this.objects[i], new THREE.Color('#000000'));
        //   const boxHelperCenter1 = new THREE.Vector3();
        //   boxHelperCenter1.x = boxHelper1.geometry.boundingSphere.center.x;
        //   boxHelperCenter1.y = boxHelper1.geometry.boundingSphere.center.y;
        //   boxHelperCenter1.z = boxHelper1.geometry.boundingSphere.center.z;
        //   console.log(this.objects[i]);
        //
        //   const spriteZ = new TextSprite({
        //     fillStyle: '#f5f5f5',
        //     fontFamily: 'Helvetica, "Times New Roman"',
        //     fontSize: '0.1',
        //     // fontStyle: 'bold',
        //     text: [
        //       this.objects[i].name,
        //     ].join('\n'),
        //   });
        //   spriteZ.position.set(
        //     boxHelperCenter1.x,
        //     boxHelperCenter1.y + 0.5,
        //     boxHelperCenter1.z
        //   );
        //   scene.add( spriteZ );
        // }

      });
    }

    fbxLoader();
    console.log(this.scene);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,    // Прозрачный фон
      antialias: true // Гладкие края
    });
    // this.renderer.autoClearColor = false;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.renderer.physicallyCorrectLights = true;
    if (localStorage.getItem('model').toString() === '3') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.shadowMap.needsUpdate = true;
    }
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( this.renderer.domElement );
    console.log(this.scene);

    // Управление
    controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.minDistance = 100;
    controls.maxDistance = 2000;

    // document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    window.addEventListener( 'resize', this.onWindowResize, false );

    if ( RAYCAST_PICKING ) {
      document.getElementById('rendererContainer').addEventListener('click', this.rayCast, false);
    }
  }

  rayCast = (event: any) => {
    console.log(this.onOffCubes);
    this.mouseVector = new THREE.Vector3(
      ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0
    );
    raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( this.mouseVector, this.camera );
    const intersects = raycaster.intersectObjects( this.scene.children, true );
    this.isOnObject = intersects.length > 0;
    if ( this.isOnObject ) {

      // if (this.pickedMeshMap.size > 0) {
      //   for ( let i = 0; i < this.pickedMeshMap.size; i++) {
      //     this.pickedMeshMap.get(i).material.color.setRGB(
      //       this.meshArr[i].color[0],
      //       this.meshArr[i].color[1],
      //       this.meshArr[i].color[2]
      //     );
      //   }
      //   this.modelService.subModelDataEmit(false);
      // }
      if (this.pickedGroup.length > 0) {
        console.log(this.pickedGroup);
        console.log(this.pickedMeshArr);
        console.log(this.pickedMeshColorArr[0]);
        for (let i = 0; i < this.pickedMeshArr.length; i++) {
          console.log('!!!1!!! ');
          this.pickedMeshArr[i].material.color.setRGB(
            this.pickedMeshColorArr[i].color[0],
            this.pickedMeshColorArr[i].color[1],
            this.pickedMeshColorArr[i].color[2]
          );
        }
        this.pickedMeshColorArr = [];
        this.pickedMeshArr = [];
        this.pickedGroup = [];
        this.modelService.subModelDataEmit(false);
      }

      for (let i = 0; i < this.onOffCubes.length; i++) {
        if (intersects[0].object.parent === this.onOffCubes[i]) {
          // Выбранная группа с мешами
          const tempGroup = this.onOffCubes[i].children;
          // Добавление выбранной группы
          this.pickedGroup.push(tempGroup);

          for (const mesh of tempGroup) {
            this.pickedMeshArr.push(mesh);
            this.pickedMeshColorArr.push({
              id: mesh.id,
              color: mesh.material.color.toArray()
            });
          }

          // Перекраска мешей
          for (const mesh of tempGroup) {
            mesh.material.color.set('#00c9ff');
          }

          this.meshArr[0] = ({
            id: intersects[0].object.id,
            color: intersects[0].object.material.color.toArray()
          });

          let tempMesh = intersects[0].object;
          console.log(tempMesh);
          this.meshColor = intersects[0].object.material.color.toArray();


          // this.pickedMeshMap.set(0, tempMesh);


          this.meshMap.set(intersects[0].object.id, intersects[0].object);

          this.meshName = intersects[0].object;
          this.showSectionInfo = true;

          localStorage.setItem('subModelName', intersects[0].object.name);

          this.modelService.meshDataEmit(intersects[0].object);
          this.modelService.subModelDataEmit(true);
        }
      }

    } else {
      if (this.pickedGroup.length > 0) {
        console.log(this.pickedGroup);
        console.log(this.pickedMeshArr);
        console.log(this.pickedMeshColorArr[0]);
        for (let i = 0; i < this.pickedMeshArr.length; i++) {
          console.log('!!!1!!! ');
          this.pickedMeshArr[i].material.color.setRGB(
            this.pickedMeshColorArr[i].color[0],
            this.pickedMeshColorArr[i].color[1],
            this.pickedMeshColorArr[i].color[2]
          );
        }
        this.pickedMeshColorArr = [];
        this.pickedMeshArr = [];
        this.pickedGroup = [];
        this.modelService.subModelDataEmit(false);
      }
    }
  }


  onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  animate() {
    // Запуск this за пределами angular зон, потому что это может вызвать тяжелые циклы changeDetection
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.onWindowResize();
      });
    });
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    controls.update();
    this.skybox.position.copy(this.camera.position);
    this.renderer.render(this.scene, this.camera);
  }

}
