const path = require('path');

module.exports = {
	publicPath: '/Experiment',
	chainWebpack: config => {
		config.module
			.rule('raw')
			.test(/\.(glsl|fs|vs)$/)
			.use('raw-loader')
			.loader('raw-loader')
			.end();
		config.module
			.rule('glslify')
			.test(/\.(glsl|fs|vs)$/)
			.use('glslify-loader')
			.loader('glslify-loader')
			.end();
		config.module
			.rule('hdr')
			.test(/\.hdr$/)
			.use('url-loader')
			.loader('url-loader')
			.end();
	},
	configureWebpack: config => {
		config.resolve = {
			extensions: [
				'.glsl',
				'.fs',
				'.vs',
				'.js',
				'.vue',
				'.css',
				'.png',
				'.jpg',
				'.jpeg',
				'.hdr',
			],
			alias: {
				'@': path.resolve(__dirname, './src'),
				LIB: path.resolve(__dirname, './src/libs')
			}
		};
	}
};
