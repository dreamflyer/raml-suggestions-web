var Atom = require("atom-web-ui");

var UI = Atom.UI;

var treePanelNode = document.getElementById('fs-tree-panel');

function initFsTree(fsTreeModel, getSuggestionsCallback) {
    var input = fsTreeModel;
    
    function getChildren(file) {
        if (!file) {
            return [];
        }
        return file.getChildren();
    }
    
    var tree = UI.treeViewerSection('Workspace', UI.Icon.FILE_SUBMODULE, input, getChildren, new FSRenderer(function (x) {}));
    
    tree.viewer.setComparator(function (arg1, arg2) {
        return false;
    });
    
    
    tree.viewer.setBasicLabelFunction(function (x) {return x.getName();});
    
    tree.viewer.setKeyProvider({
        key: function (item) {
            return "" + item.getName();
        }
    });
    
    var selectionListener = {
        selectionChanged: function (event) {
            var selection = event.selection.elements[0];
            if (!selection) {
                return;
            }
            if (selection.directory) {
                return;
            }

            openFile(selection, getSuggestionsCallback);
        }
    };
    
    tree.viewer.addSelectionListener(selectionListener);

    treePanelNode.appendChild(tree.renderUI());
}

var FSRenderer = (function () {
    function FSRenderer(onInputChanged) {
        this.onInputChanged = onInputChanged;
    }
    FSRenderer.prototype.render = function (model) {
        var changed = false;
        
        var highLight = changed ? UI.TextClasses.WARNING : UI.TextClasses.NORMAL;
        var icon = model.isDirectory() ? UI.Icon.FILE_DIRECTORY : UI.Icon.FILE_TEXT;
        var result = UI.hc(UI.label(model.getName(), icon, highLight), UI.a("", function (x) {
        }, null, null, null));
        result.setDisabled(false);
        return result;
    };
    return FSRenderer;
})();

function openFile(fsTreeModel, getSuggestionsCallback) {
    if(!fsTreeModel.isDirectory()) {
        var textEditor = new Atom.atom.TextEditor(fsTreeModel.path, 'ace_editor', fsTreeModel.resolver, getSuggestionsCallback);

        Atom.workspace.getActivePane().addItem(textEditor, 0);
    }
    //     if (!selection.isDirectory()) {
//         this.clear();
//         this.textEditor = new TextEditor(selection.path);
//         this.pane.addItem(this.textEditor, 0);
//         var extension = path.extname(selection.path);
//         this.doUpdate();
//         if (extension === ".raml") {
//             getLazy('editorTools').initEditorTools();
//             this.toolBar.toggleLastActive();
//         }
//         else {
//             this.toolBar.disable('Editor Tools');
//             this.toolBar.disable('Api Console');
//         }
//         if (extension === '.ts') {
//         }
//         this.doUpdate();
//     }
}

// Workspace.prototype.open = function (filePath, args) {
//     var _this = this;
//     if (filePath.indexOf('raml-console://') === 0) {
//         var result = {
//             then: function (callback) {
//                 var view = getLazy('ApiConsole').opener(filePath, args);
//                 _this.addConsolePanel({ item: view });
//                 callback(view);
//             }
//         };
//         return result;
//     }
//     this.tabViewer.open(filePath, path.basename(filePath));
//     return {
//         then: function (callback) {
//             callback(_this.textEditor);
//         }
//     };
// };

// Workspace.prototype.openFile = function (selection) {
//     if (!selection.isDirectory()) {
//         this.clear();
//         this.textEditor = new TextEditor(selection.path);
//         this.pane.addItem(this.textEditor, 0);
//         var extension = path.extname(selection.path);
//         this.doUpdate();
//         if (extension === ".raml") {
//             getLazy('editorTools').initEditorTools();
//             this.toolBar.toggleLastActive();
//         }
//         else {
//             this.toolBar.disable('Editor Tools');
//             this.toolBar.disable('Api Console');
//         }
//         if (extension === '.ts') {
//         }
//         this.doUpdate();
//     }
// }

//_this.openFile(new FsTreeModel(id));

exports.initFsTree = initFsTree;