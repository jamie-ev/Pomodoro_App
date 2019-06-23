var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/app/index.html', // where to find the base HTML
    filename: 'index.html', // what to rename the modified HTML (in build folder)
    inject: 'body' // inject the new .js file into body versus head
});

module.exports = {
    entry: __dirname + '/app/index.js', // where to find base JS
    module: {
        rules: [
            {
                test: /\.js$/, // modify all JS files (regex)
                exclude: /node_modules/, // except node_modules
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    output: {
        filename: 'transformed.js', // new file name for modified JS
        path: __dirname + '/build' // where to house it
    },
    plugins: [HTMLWebpackPluginConfig]
};
