const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		background: path.resolve(__dirname, '..', 'src', 'background.ts')
	},
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{ from: 'manifest.json', to: 'manifest.json' }]
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'icon', to: 'icon' }]
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'node_modules/jquery/dist/jquery.min.js', to: 'libs/jquery.min.js' }]
		})
	]
};
