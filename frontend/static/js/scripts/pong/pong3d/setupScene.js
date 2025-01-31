import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupScene(canvasRef) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Add background color
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-5, 5, 15); // Adjust camera position to see the scene
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef,
        antialias: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.damping = 0.2;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    return { scene, camera, renderer, controls };
}