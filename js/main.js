import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { config } from './config';

let container, stats, clock, controls;
let camera, scene, renderer, poseAvatar, poseAnimations, mixer;


const init = () => {

  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
  camera.position.set( 8, 10, 8 );
  camera.lookAt( 0, 3, 0 );

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  // Load Avatar
  const avatarLoadingManager = new THREE.LoadingManager(  () => {
    console.log(poseAvatar);
    scene.add( poseAvatar );
  });

  const avatarLoader = new ColladaLoader( avatarLoadingManager );
  console.log('Loading model from ' + config.modelUrl);
  avatarLoader.load( config.modelUrl, ( collada ) => {
    console.log(collada);
    poseAvatar = collada.scene;
    poseAvatar.scale.x = .05;
    poseAvatar.scale.y = .05;
    poseAvatar.scale.z = .05;

    poseAvatar.traverse(  ( node ) => {
      if ( node.isSkinnedMesh ) {
        node.frustumCulled = false;
      }
    });
  });

  // Load animations
  const animationLoadingManager = new THREE.LoadingManager(  () => {
    console.log(poseAnimations);
    mixer = new THREE.AnimationMixer( poseAvatar );
    mixer.clipAction( poseAnimations[0] ).play();
  });

  const animationLoader = new ColladaLoader( animationLoadingManager );
  console.log('Loading animations from ' + config.animationUrl);
  animationLoader.load( config.animationUrl, ( collada ) => {
    console.log(collada);
    poseAnimations = collada.animations;
  });

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

  controls = new OrbitControls( camera, renderer.domElement );
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

  // const delta = clock.getDelta();

  // if ( poseAvatar !== undefined ) {
  //
  //   poseAvatar.rotation.z += delta * 0.5;
  //
  // }

  const delta = clock.getDelta();

  if ( mixer !== undefined ) {

    mixer.update( delta / 10 );

  }

  renderer.render( scene, camera );

}

init();
animate();
