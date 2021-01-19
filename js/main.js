import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { config } from './config';

let container, stats, clock;
let camera, scene, renderer, poseModel;


const init = () => {

  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
  camera.position.set( 8, 10, 8 );
  camera.lookAt( 0, 3, 0 );

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  // loading manager
  const loadingManager = new THREE.LoadingManager(  () => {
    scene.add( poseModel );
  } );

  // collada

  const loader = new ColladaLoader( loadingManager );
  console.log('Loading model from ' + config.modelUrl);
  loader.load( config.modelUrl, ( collada ) => {
    poseModel = collada.scene;
  } );

  //

  const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  scene.add( ambientLight );

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
  directionalLight.position.set( 1, 1, 0 ).normalize();
  scene.add( directionalLight );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  //

  stats = new Stats();
  container.appendChild( stats.dom );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

const onWindowResize = () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

const animate = () => {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

const render = () => {

  const delta = clock.getDelta();

  if ( poseModel !== undefined ) {

    poseModel.rotation.z += delta * 0.5;

  }

  renderer.render( scene, camera );

}

init();
animate();
