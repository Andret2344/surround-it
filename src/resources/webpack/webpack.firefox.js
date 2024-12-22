const path = require('path');
const {merge} = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {
	return merge(commonConfig, {
		output: {
			path: path.join(__dirname, '../../../dist/firefox'),
			filename: '[name].js'
		},
		plugins: [
			new CopyWebpackPlugin({
				patterns: [{from: 'src/resources/manifest/manifest.firefox.json', to: 'manifest.json'}]
			}),
		]
	});
};
