const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: {
		background: path.resolve(__dirname, '..', '..', 'main', 'typescript', 'background.ts'),
		popup: path.resolve(__dirname, '..', '..', 'main', 'typescript', 'popup.ts')
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
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new CopyWebpackPlugin({
			patterns: [
				{from: 'src/resources/assets', to: 'assets'},
				{from: require.resolve('jquery'), to: 'libs/jquery.min.js'},
				{from: require.resolve('webextension-polyfill'), to: 'webextension-polyfill.js'}
			]
		}),
		new HtmlWebpackPlugin({
			template: 'src/main/html/popup.html',
			filename: 'popup.html',
			inject: 'body',
			chunks: ['popup'],
		})
	]
};
