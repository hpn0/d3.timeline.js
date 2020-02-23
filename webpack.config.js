const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		timeline: './src/timeline.js',
	},
	devtool: 'inline-source-map',
	devServer: {
    contentBase: './dist',
  },
	plugins: [
		new CopyWebpackPlugin([
			{ from: 'example/index.html', to: '' },
			{ from: 'example/styles.css', to: '' },
		]),
		new CleanWebpackPlugin(),
		// new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
    library: 'timeline',
    libraryTarget: 'umd',
	},
};
