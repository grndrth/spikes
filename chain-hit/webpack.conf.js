// Config for Webpack

module.exports = {
    context: __dirname,
    entry: "./index.js",
    output: {
        path: "./",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel" }
        ]
    },
    devtool: "#inline-source-map"
};
