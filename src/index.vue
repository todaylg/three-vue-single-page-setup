<template>
	<div id="wrapper">
		<div id="canvasContainer"></div>
	</div>
</template>

<script>
import MainScene from './MainScene';
import Loader from './js/Loader';
export default {
	name: 'container',
	mounted() {
		let loader = new Loader();
		loader.loadGLTF('./assets/models/damagedHelmet/').then(gltf => {
			this.initScene(gltf);
		})
	},
	methods: {
		initScene(gltf) {
			let containerEle = document.querySelector('#canvasContainer');
			this.scene = new MainScene(containerEle, gltf, () => {
				console.log("模型加载完毕");
			});
		}
	}
};
</script>

<style lang="less">
html,
body {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	background: #000;
}

#wrapper {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

#wrapper {
	width: 100vw;
	height: 100vh;
	position: relative;
	overflow: hidden;
}

#canvasContainer {
	width: 100%;
	height: 100%;
}
</style>
