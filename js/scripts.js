import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


const monkeyUrl = new URL('../assets/Classroom.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const light = new THREE.DirectionalLight( 0xFFFFFF );
light.position.set(-10, 50, 50);
scene.add( light );

const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1 );
light.position.set(-10, 50, 50);
scene.add(ambientLight);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();


const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain animation
    const clip1 = THREE.AnimationClip.findByName(clips, 'FinishedRigAction');
    const action1 = mixer.clipAction(clip1);
    action1.play();

    const clip2 = THREE.AnimationClip.findByName(clips, 'FinishedRig.001Action');
    const action2 = mixer.clipAction(clip2);
    action2.play();

    const clip3 = THREE.AnimationClip.findByName(clips, 'Part.748Action');
    const action3 = mixer.clipAction(clip3);
    action3.play();

    // Play all animations at the same time
    // clips.forEach(function(clip) {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // });

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});