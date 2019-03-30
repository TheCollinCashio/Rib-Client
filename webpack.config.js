const webpack = require('webpack')
const path = require('path')

module.exports = {
    mode: 'none',
    entry: ['@babel/polyfill', './src/CDN.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    output: {
        path: path.resolve(`${__dirname}/lib/`),
        filename: 'cdn.js',
        libraryTarget: 'var',
        library: 'RibClient'
    },
    optimization: {
        minimize: true
    }
}