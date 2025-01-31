import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export function setupGameObjects(scene) {
    const x_plane = 6, y_plane = 5, z_plane = 6;
    const x_cube = 0.1, y_cube = 1, z_cube = 2;
    const ball_radius = 0.25;

    // Field setup
    const fieldGeometry = new THREE.BoxGeometry(x_plane * 2, y_plane, z_plane * 2);
    const fieldMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2222ff, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.1 
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(field);

    // Middle line setup
    const middleLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const middleLineGeometry = new THREE.BufferGeometry();
    const points = [
        new THREE.Vector3(0, y_plane/2, z_plane),
        new THREE.Vector3(0, -y_plane/2, z_plane),
        new THREE.Vector3(0, -y_plane/2, -z_plane),
        new THREE.Vector3(0, y_plane/2, -z_plane),
        new THREE.Vector3(0, y_plane/2, z_plane)
    ];
    middleLineGeometry.setFromPoints(points);
    const middleLine = new THREE.Line(middleLineGeometry, middleLineMaterial);
    scene.add(middleLine);

    // Players setup
    const paddleGeometry = new THREE.BoxGeometry(x_cube, y_cube, z_cube);
    const paddleLeft = new THREE.Mesh(
        paddleGeometry,
        new THREE.MeshPhongMaterial({
            color: 0x005000,
            transparent: true, 
            opacity: 0.8
        })
    );
    paddleLeft.position.set(-x_plane, 0, 0);
    
    const paddleRight = new THREE.Mesh(
        paddleGeometry,
        new THREE.MeshPhongMaterial({
            color: 0xff0000,
            transparent: true, 
            opacity: 0.8
        })
    );
    paddleRight.position.set(x_plane, 0, 0);

    // Ball setup
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(ball_radius, 32, 32),
        new THREE.MeshPhongMaterial({ 
            color: 0xFF8C00,
            emissive: 0xFF8C00,      // Same color as base for full glow
            emissiveIntensity: 0.8,   // Intensity of the glow
            shininess: 50             // Makes it more reflective
        })
    );

    scene.add(paddleLeft);
    scene.add(paddleRight);
    scene.add(ball);

    return { 
        field, 
        ball, 
        paddleLeft, 
        paddleRight, 
        dimensions: { x_plane, y_plane, z_plane, x_cube, y_cube, z_cube, ball_radius } 
    };
}

// Keep the loadFonts function as is
export async function loadFonts(scene) {
    const fontLoader = new FontLoader();

    return new Promise((resolve, reject) => {
        fontLoader.load('/static/assets/pong/Orbitron_Regular.json', (font) => {
            const textMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1 
            });

            const createScoreText = (position) => {
                const textGeometry = new TextGeometry('0', {
                    font: font,
                    size: 2,
                    depth: 0.5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.1,
                    bevelSize: 0.1,
                    bevelSegments: 5
                });

                const scoreMesh = new THREE.Mesh(textGeometry, textMaterial);
                scoreMesh.position.copy(position);
                scoreMesh.rotation.x = -Math.PI * 0.25;
                scene.add(scoreMesh);
                return scoreMesh;
            };

            const scoreLeft = createScoreText(new THREE.Vector3(-9.5, 2, -12.5));
            const scoreRight = createScoreText(new THREE.Vector3(7.5, 2, -12.5));

            resolve({ scoreLeft, scoreRight, font });  // Return font along with score meshes
        }, undefined, (error) => {
            reject(error);
        });
    });
}
