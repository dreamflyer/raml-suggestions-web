var fs = require('fs');
var path = require("path");

function copyFileSync(source, target) {
    var targetFile = target;
    
    if(fs.existsSync(target)) {
        if(fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    var targetFolder = path.join(target, path.basename(source));

    if(!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    if(fs.lstatSync(source).isDirectory() ) {
        files = fs.readdirSync(source);

        files.forEach(function(file) {
            var curSource = path.join(source, file);

            if(fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

function deleteFolderRecursive(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;

            if(fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
}

function dirToJson(source, rootName) {
    var result = {};

    var files = fs.readdirSync(source);
    
    files.forEach(function(file) {
        var curPath = source + "/" + file;

        if(fs.lstatSync(curPath).isDirectory()) {
            var subFolder = dirToJson(curPath, file);

            Object.keys(subFolder).forEach(function(key) {
                result['/' + rootName + key] = subFolder[key];
            });
        } else {
            var content = fs.readFileSync(curPath).toString();

            result['/' + rootName + '/' + file] = content;
        }
    });

    return result;
}

function convertDirToJson(sourceDir, dist) {
    var result = dirToJson(sourceDir, path.basename(sourceDir));
    
    if(!fs.existsSync(dist)) {
        fs.mkdir(dist);
    }
    
    fs.writeFileSync(dist + '/virtualFsContent.json', JSON.stringify(result));
}

exports.copyFileSync = copyFileSync;
exports.copyFolderRecursiveSync = copyFolderRecursiveSync;
exports.deleteFolderRecursive = deleteFolderRecursive;
exports.convertDirToJson = convertDirToJson;