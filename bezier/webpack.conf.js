// Config for Webpack

module.exports = {
    context: __dirname,
    entry: "./weg2.js",
    output: {
        path: "./",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel" }
        ]
    }
};
