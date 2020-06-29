const path = require('path')

module.exports = {
	entry: './src/js/index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@lib': path.resolve(__dirname, 'src/js/helpers'),
			'@config': path.resolve(__dirname, 'src/js/helpers'),
			'@helpers': path.resolve(__dirname, 'src/js/helpers'),
		},
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		hot: true,
		port: 9000,
	},
}
