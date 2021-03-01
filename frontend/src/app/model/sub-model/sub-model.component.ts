import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModelService} from '../model.service';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {Vector3} from 'three';

@Component({
  selector: 'app-submodel',
  templateUrl: './sub-model.component.html'
})
export class SubModelComponent implements OnInit, OnDestroy {

  public constructor(
    private ngZone: NgZone,
    private modelService: ModelService
  ) {
  }

  condition = false;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private controls;
  private container;
  private loader;
  private object;
  status;

  private cube: THREE.Mesh;

  private frameId: number = null;

  public ngOnInit(): void {
    this.modelService.subModelDataChange.subscribe(data => {
      if (data === true) {
        this.condition = true;
        this.createScene();
        this.animate();
      } else {
        this.condition = false;
        document.getElementById('rendererSubContainer').removeChild(this.renderer.domElement);
        cancelAnimationFrame(this.frameId);
        this.renderer.domElement.addEventListener('dblclick', null, false); // remove listener to render
        this.scene = null;
        this.camera = null;
        this.controls = null;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(): void {

    this.container = document.getElementById('rendererSubContainer');

    this.renderer = new THREE.WebGLRenderer({
      alpha: false,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(280, 400);
    this.container.appendChild(this.renderer.domElement);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('rgb(180,180,180)');

    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(0, 10, 20);
    const pointLight = new THREE.PointLight('#ffffff', 0.8);
    this.camera.add(pointLight);
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;

    // soft white light
    this.light = new THREE.AmbientLight(0xcccccc, 0.4);
    this.light.position.x = 10;
    this.scene.add(this.light);

    // const geometry = new THREE.BoxGeometry(4, 2, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 'rgb(223,223,223)' });
    // this.cube = new THREE.Mesh( geometry, material );
    // this.scene.add(this.cube);

    const manager = new THREE.LoadingManager();

    // Менеджер загрузки для FBXLoader
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onLoad = () => {
      this.status = 'Готово';
      console.log( 'Loading complete!');
    };
    manager.onError = (url) => {
      this.status = 'Ошибка';
      console.log( 'There was an error loading ' + url );
    };
    manager.onStart = () => {
      this.status = 'Загрузка';
      console.log( 'Loading start');
    };

    const onError = () => {};

    let testName = localStorage.getItem('subModelName').toString();

    this.loader = new FBXLoader(manager);
    this.loader.load('../../assets/models/fbx/' + testName + '.fbx', (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      this.object = object;
      // this.object.geometry.computeBoundingBox();
      this.object.children[0].position.set(0, 0, 0);
      this.scene.add(this.object);
    }, '', onError);

  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.controls.update();
    // this.object.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
  }

}
