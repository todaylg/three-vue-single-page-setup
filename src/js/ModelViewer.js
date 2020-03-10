import * as THREE from 'three';
import Loader from './Loader';
// Control
import { OrbitControls } from 'LIB/threejs/controls/OrbitControls';
// Utils
import { adjustCameraByBox } from './ThreeUtils';
import { isMobile } from './Utils';
// Test
import { GUI } from 'LIB/threejs/libs/dat.gui.module.js';

export default class ModelViewer {
	constructor(mainScene, gltf, callBack) {
		this.gltfScene = gltf.scene;
		this.time = 0;
		this.debug = false;
		this.isMobile = isMobile();

		this.renderer = mainScene.renderer;
		this.scene = mainScene.scene;
		this.camera = mainScene.camera;
		this.container = mainScene.container;
		this.width = mainScene.width;
		this.height = mainScene.height;
		this.callBack = callBack;

		this.control = new OrbitControls(this.camera, this.container);
		this.initScene();
	}

	initScene() {
		let scene = this.scene;
		// PMREM
		var pmremGenerator = new THREE.PMREMGenerator(this.renderer);
		pmremGenerator.compileEquirectangularShader();
		this.loader = new Loader();
		this.loader.loadEnvMap('./assets/envMap/', 'royal_esplanade_1k.hdr').then(texture => {
			let envMap = pmremGenerator.fromEquirectangular(texture).texture;

			scene.background = envMap;
			scene.environment = envMap;
			
			texture.dispose();
			pmremGenerator.dispose();

			// RoughnessMipmapper is optional
			let gltfScene = this.gltfScene;
			scene.add(gltfScene);
			this.adjustFactorFromBox(gltfScene);

			this.initEvent();
			typeof this.callBack === 'function' && this.callBack();
		});
	}

	adjustFactorFromBox(object) {
		// Compute box for scale
		let box = (this.box = new THREE.Box3().setFromObject(object));
		let size = box.getSize(new THREE.Vector3());
		const maxSize = Math.max(size.x, size.y, size.z);
		// At least 100
		if (maxSize < 100) {
			let scale = 100 / maxSize;
			object.scale.setScalar(scale);
		}
		// Recompute box for center
		box = this.box = new THREE.Box3().setFromObject(object);
		let center = box.getCenter(new THREE.Vector3());
		// Move object to origin
		object.position.sub(center);
		if (this.debug) {
			let boxObj = new THREE.BoxHelper(object, 0xffff00);
			this.scene.add(boxObj);
		}
		// Camera
		adjustCameraByBox(this.camera, object, this.control, 1);
	}

	initEvent() {
		let lastMousePosition = { x: 0 };
		window.addEventListener(
			'mousemove',
			event => {
				let button = event.which || event.button;
				if (event.altKey && button) {
					event.stopPropagation();
					let deltaX = event.clientX - lastMousePosition.x;
					this.envRotation += deltaX * 0.01;
				}
				lastMousePosition.x = event.clientX;
			},
			true
		);
	}

	update() {
		this.renderer.render(this.scene, this.camera);
	}
}
