import * as THREE from 'three';
import { GLTFLoader } from 'LIB/threejs/loaders/GLTFLoader';
import { RGBELoader } from 'LIB/threejs/loaders/RGBELoader';

export default class Loader {
	constructor() {}

	importGLTF(fileMap) {
		let rootFile, rootPath;
		Array.from(fileMap).forEach(([path, file]) => {
			if (file.name.match(/\.(gltf|glb)$/)) {
				rootFile = file;
				rootPath = path.replace(file.name, '');
			}
		});
		if (!rootFile) {
			console.error('No .gltf or .glb asset found.');
		}
		const fileURL = typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile);
		return this.loadLocalGLTF(fileURL, rootPath, fileMap);
	}

	loadLocalGLTF(url, rootPath, assetMap) {
		const baseURL = THREE.LoaderUtils.extractUrlBase(url);
		return new Promise((resolve, reject) => {
			const manager = new THREE.LoadingManager();
			// Intercept and override relative URLs.
			manager.setURLModifier((url, path) => {
				const normalizedURL = rootPath + url.replace(baseURL, '').replace(/^(\.?\/)/, '');
				if (assetMap.has(normalizedURL)) {
					const blob = assetMap.get(normalizedURL);
					const blobURL = URL.createObjectURL(blob);
					blobURLs.push(blobURL);
					return blobURL;
				}
				return (path || '') + url;
			});
			const loader = new GLTFLoader(manager);
			loader.setCrossOrigin('anonymous');
			const blobURLs = [];
			loader.load(
				url,
				gltf => {
					resolve(gltf);
				},
				undefined,
				reject
			);
		});
	}

	loadGLTF(rootPath, fileName = 'scene.gltf') {
		const loader = new GLTFLoader();
		loader.setPath(rootPath);
		return new Promise(resolve => {
			loader.load(fileName, gltf => {
				resolve(gltf);
			});
		});
	}

	loadEnvMap(rootPath, fileName) {
		return new Promise(resolve => {
			new RGBELoader()
				.setDataType(THREE.UnsignedByteType)
				.setPath(rootPath)
				.load(fileName, texture => {
					resolve(texture);
				});
		});
	}
}
