const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		background: path.resolve(__dirname, '..', '..', 'main', 'background.ts')
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
			patterns: [{from: 'src/resources/assets', to: 'assets'}]
		}),
		new CopyWebpackPlugin({
			patterns: [{from: 'node_modules/jquery/dist/jquery.min.js', to: 'libs/jquery.min.js'}]
		})
	]
};
