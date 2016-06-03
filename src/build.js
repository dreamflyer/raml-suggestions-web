var path = require("path");
var spawnSync = require('child_process').spawnSync;

var util = require("./util");

var projectRoot = path.resolve(__dirname, '../');

var parser = path.resolve(__dirname, "../node_modules/raml-1-parser");

var parserBuilder = path.resolve(__dirname, "../node_modules/raml-1-parser/dist/browserVersionGenerator/browserVersionGenerator.js");

var suggestionsBuilder = path.resolve(__dirname, "./suggestionsGenerator.js");

var mainBuilder = path.resolve(__dirname, "./mainGenerator.js");

var nodeModules = path.resolve(__dirname, "../node_modules");

var parserBundle = path.resolve(__dirname, "../node_modules/raml-1-parser/browserVersion/raml-1-parser.js");

var atomRoot = path.resolve(__dirname, "../node_modules/atom-web-ui");

var atomGenerator = path.resolve(__dirname, "../node_modules/atom-web-ui/generator/generator.js");

var atomBundle = path.resolve(__dirname, "../node_modules/atom-web-ui/browser/atomWeb.js");

var target = path.resolve(__dirname, '../site');

var examples = path.resolve(__dirname, '../examples');

var temp = path.resolve(__dirname, '../temp')

var isWin = /^win/.test(process.platform);

util.deleteFolderRecursive(nodeModules);

spawnSync(isWin ? 'npm.cmd' : 'npm', ['install', '--prefix', projectRoot], {stdio: [0, 1, 2]});

spawnSync(isWin ? 'npm.cmd' : 'npm', ['install', '--prefix', parser], {stdio: [0, 1, 2]});

spawnSync('node', [parserBuilder], {stdio: [0, 1, 2]});

spawnSync(isWin ? 'npm.cmd' : 'npm', ['install', '--prefix', atomRoot], {stdio: [0, 1, 2]});

spawnSync('node', [atomGenerator], {stdio: [0, 1, 2]});

util.copyFileSync(parserBundle, target);

util.copyFileSync(atomBundle, target);

util.convertDirToJson(examples, temp);

spawnSync('node', [suggestionsBuilder], {stdio: [0, 1, 2]});
spawnSync('node', [mainBuilder], {stdio: [0, 1, 2]});
