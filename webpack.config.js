const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = (env, argv) => {
    console.log(env, argv);
    const watchMode = argv.liveReload || false
    const modeEnv = argv.mode || 'development'
    const isProd = modeEnv === 'production'
    const optimizations = {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [],
    }
    if (isProd) {
        optimizations.minimizer.push(new UglifyJsPlugin())
    }

    return {
        mode: 'none',
        entry: {
            app: path.join(__dirname, 'src', 'index.tsx')
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', "css-loader"],
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        }
                    ]
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css'],
            modules: [
                'node_modules'
            ]
        },
        output: {
            filename: watchMode ? 'assets/[name].[hash].js' : 'assets/[name].[chunkhash].js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'public', 'index.html')
            })
        ],
        devServer: {
            static: path.join(__dirname, "dist"),
            compress: true,
            port: 4200,
            hot: true,
            open: true,
            historyApiFallback: true,
        },
    };
}