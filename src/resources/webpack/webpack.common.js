const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		background: path.resolve(__dirname, '..', '..', 'main', 'typescript', 'background.ts'),
		popup: path.resolve(__dirname, '..', '..', 'main', 'typescript', 'popup.ts'),
		options: path.resolve(__dirname, '..', '..', 'main', 'typescript', 'options.ts')
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{from: 'src/resources/assets', to: 'assets'},
				{from: require.resolve('webextension-polyfill'), to: 'webextension-polyfill.js'}
			]
		}),
		new HtmlWebpackPlugin({
			template: 'src/main/html/popup.html',
			filename: 'popup.html',
			inject: 'body',
			chunks: ['popup'],
		}),
		new HtmlWebpackPlugin({
			template: 'src/main/html/options.html',
			filename: 'options.html',
			inject: 'body',
			chunks: ['options'],
		})
	]
};
