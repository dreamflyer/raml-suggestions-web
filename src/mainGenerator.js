var path = require('path');

var webpack = require("../node_modules/raml-1-parser/node_modules/webpack");

var target = path.resolve(__dirname, '../site');

var config = {
    context: __dirname,

    entry: './main.js',

    output: {
        path: target,

        library: ['RAMLSuggestionsApi'],

        filename: 'main.js'
    },

    plugins: [],

    resolveLoader: {
        root: path.join(__dirname, "../node_modules/raml-1-parser/node_modules")
    },

    module: {
        loaders: [
            {test: /\.json$/, loader: "json"}
        ]
    },
    externals: [
        {
            "libxml-xsd": true,
            "ws": true,
            'raml-1-parser': 'RAML.Parser',
            'raml-suggestions': 'RAMLSuggestions',
            'atom-web-ui': 'AtomWeb'
        }
    ],
    node: {
        console: false,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    }
};

webpack(config, function(err, stats) {
    if(err) {
        console.log(err.message);

        return;
    }

    console.log("Webpack Building Browser Bundle:");

    console.log(stats.toString({reasons: true, errorDetails: true}));
});