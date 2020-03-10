import * as THREE from 'three';

function adjustCameraByBox(camera, object, controls, factor = 1.){
	let box = new THREE.Box3().setFromObject(object);
	let size = box.getSize(new THREE.Vector3());
	const maxSize = Math.max( size.x, size.y, size.z );
	const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
	const fitWidthDistance = fitHeightDistance / camera.aspect;
	const distance = factor * Math.max( fitHeightDistance, fitWidthDistance );

	camera.near = distance / 100;
	camera.far = distance * 100;
	camera.position.set(0, distance/4, distance);
	camera.updateProjectionMatrix();
	if(controls){
		controls.maxDistance = distance * 20;
		controls.update();
	}
	return distance;
}

export { adjustCameraByBox };
