var _ = require('underscore');

var path = require('path');

var virtualContent = require("../temp/virtualFsContent.json");

var FsResolver = (function() {
    function FsResolver() {
        
    }
    
    FsResolver.prototype.content = function(filePath) {
        return virtualContent[filePath];
    }

    FsResolver.prototype.list = function(dirPath) {
        var children = {};

        Object.keys(virtualContent).forEach(function(fullPath) {
            if(fullPath.indexOf(dirPath) === 0) {
                var child = fullPath.replace(dirPath, '');

                if(child.indexOf('/') === 0) {
                    child = child.replace('/', '');
                }
                
                children[child.split('/')[0]] = true;
            }
        });

        return Object.keys(children);
    }

    FsResolver.prototype.exists = function(fullPath) {
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

    FsResolver.prototype.isDirectory = function(fullPath) {
        return this.exists(fullPath) && !this.extname(fullPath) ? true : false;
    }
    
    FsResolver.prototype.dirname = path.dirname;
    
    FsResolver.prototype.resolve = path.resolve;
    
    FsResolver.prototype.extname = path.extname;
    
    return FsResolver;
})();

var FsTreeModel = (function () {
    function FsTreeModel(path, fsResolver) {
        this.path = path;
        
        this.resolver = fsResolver;
        
        this.directory = fsResolver.isDirectory(path);
        
        var names = (this.directory && this.getName() !== 'node_modules') ? fsResolver.list(path) : [];
        
        var children = [];

        names.forEach(function (name) {
            children.push(new FsTreeModel(path + "/" + name, fsResolver));
        });

        this.children = children;
    }

    FsTreeModel.prototype.getChildren = function () {
        return this.children;
    };

    FsTreeModel.prototype.isDirectory = function () {
        return this.directory;
    };

    FsTreeModel.prototype.getName = function () {
        return path.basename(this.path);
    };

    return FsTreeModel;
})();

exports.FsResolver = FsResolver;
exports.FsTreeModel = FsTreeModel;