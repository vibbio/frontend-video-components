import path from 'path';
import { extract } from 'extract-text-webpack-plugin';
import config, { minifyPlugins } from './webpack.demo.babel';

export default {
    ...config,
    entry: [
        path.join(__dirname, 'src/component/index.js'),
        path.join(__dirname, 'src/component/styling/index.scss')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'VideoComponent.js',
        library: 'VideoComponent'
    },
    externals: {
        react: 'React'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.json?$/,
            loader: 'json'
        }, {
            test: /\.(scss|css)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
            }]
        }]
    },
    plugins: minifyPlugins
};

function styleLoader(loaders) {
    if (process.env.NODE_ENV === 'production') {
        const [fallback, ...use] = loaders;
        return extract({ fallback, use });
    }
    return loaders;
}
