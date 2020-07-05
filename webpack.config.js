const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/js/index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style/[name].css',
			chunkFilename: '[id].css'
		}),
		new CopyPlugin({
			patterns: [
				{ from: './public/**/*', to: '', force: true },
				{ from: './src/html/*', force: true, flatten: true }
			]
		})
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@lib': path.resolve(__dirname, 'src/js/lib'),
			'@config': path.resolve(__dirname, 'src/js/configs'),
			'@helpers': path.resolve(__dirname, 'src/js/helpers')
		}
	},
	output: {
		filename: 'js/bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: [path.join(__dirname, './dist/')],
		compress: true,
		host: '0.0.0.0',
		hot: true,
		port: 9000
	}
}
