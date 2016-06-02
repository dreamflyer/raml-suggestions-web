var _ = require('underscore');

var path = require('path');

var virtualContent = require("../temp/virtualFsContent.json");

var fsResolver = {
    content: function(filePath) {
        return virtualContent[filePath];
    },

    list: function(dirPath) {
        var children = [];

        Object.keys(virtualContent).forEach(function(fullPath) {
            if(fullPath.indexOf(dirPath) === 0) {
                var child = fullPath.replace(dirPath, '');

                if(child.indexOf('/') === 0) {
                    child = child.replace('/')
                }

                children.push(child.split('/')[0]);
            }
        });

        return children;
    },

    exists: function(fullPath) {
        if(!fullPath || !fullPath.trim()) {
            return false;
        }

        return _.find(Object.keys(virtualContent), function(path) {
            return path === fullPath;
        }) || _.find(Object.keys(virtualContent), function(path) {
            var dirPath = fullPath[fullPath.length - 1] === '/' ? fullPath : (fullPath + '/')

            return path.indexOf(fullPath === 0);
        }) ? true : false;
    }
}

var completionContentProvider = {
    contentDirName: function(content) {
        return path.dirname(content.getPath());
    },

    dirname: function(fullPath) {
        return path.dirname(fullPath);
    },

    exists: function (fullPath) {
        return fsResolver.exists(fullPath);
    },

    resolve: function (contextPath, relativePath) {
        return path.resolve(contextPath, relativePath);
    },

    isDirectory: function(fullPath) {
        return fsResolver.exists && path.extname(fullPath) ? true : false;
    },

    readdir: function (dirPath) {
        return fsResolver.list(dirPath);
    }
}

function getVirtualFsContent(filePath) {
    var text = fsResolver.content(filePath);

    return {
        getText: function() {
            return text;
        },

        getPath: function () {
            return filePath;
        },

        getBaseName: function() {
            return path.basename(filePath);
        }
    }
}

function getPosition(offset) {
    return {
        getOffset: function() {
            return offset;
        }
    }
}

exports.fsResolver = fsResolver;
exports.completionContentProvider = completionContentProvider;
exports.getVirtualFsContent = getVirtualFsContent;
exports.getPosition = getPosition;