var suggestions = require("raml-suggestions");

var fsTree = require("./fsTree");

var resolvers = require("./resolvers");

var fsResolver = new resolvers.FsResolver();

var completionContentProvider = suggestions.getContentProvider(fsResolver);

var completionProvider = new suggestions.CompletionProvider(completionContentProvider);



var EditorContent = (function () {
    function EditorContent(textEditor) {
        this.textEditor = textEditor;
    }
    
    EditorContent.prototype.getText = function () {
        return this.textEditor.getBuffer().getText();
    };
    
    EditorContent.prototype.getPath = function () {
        return this.textEditor.getPath();
    };
    
    EditorContent.prototype.getBaseName = function () {
        return this.textEditor.getTitle();
    };
    
    return EditorContent;
})();

//{ editor: this.editor, prefix: prefix, bufferPosition: this.editor.getCursorBufferPosition() };

var EditorPosition = (function () {
    function EditorPosition(textEditor) {
        this.textEditor = textEditor;
    }
    
    EditorPosition.prototype.getOffset = function () {
        var cursorPosition = this.textEditor.getCursorBufferPosition();
        
        return this.textEditor.getBuffer().characterIndexForPosition(cursorPosition);
    };
    
    return EditorPosition;
})();



function getSuggestions(editorRequest) {
    var content = new EditorContent(editorRequest.editor);
    
    var position = new EditorPosition(editorRequest.editor);
    
    var request = new suggestions.CompletionRequest(content, position);

    return completionProvider.suggest(new suggestions.CompletionRequest(content, position), true);
}

// function completionByOffset(filePath, offset) {
//     var content = resolvers.getVirtualFsContent(filePath);
//     var position = resolvers.getPosition(offset);
//    
//     var proposals = completionProvider.suggest(new suggestions.CompletionRequest(content, position), true);
//    
//     var result = proposals.map(function(suggestion) {
//         return suggestion.displayText || suggestion.text;
//     });
//    
//     console.log(result.join(','));
// }

//exports.completionByOffset = completionByOffset;

// var workspace: AtomCore.IWorkspace = <any>atom.workspace;
//
// function button(name: string, callback?) {
//     return new UI.ToggleButton(name ,UI.ButtonSizes.LARGE, UI.ButtonHighlights.INFO, UI.Icon.ALERT, event => callback ? callback() : null)
// }
//
// function divWithButton(name) {
//     return {element: document.createElement('div').appendChild(button(name).renderUI()), getTitle: () => name};
// }
//
//
// workspace.getActivePane().addItem(divWithButton('Root'), 0);
//
// var pane1 = workspace.getActivePane().splitRight({});
//
// pane1.addItem(divWithButton('Right0'), 0);
// pane1.addItem(divWithButton('Right1'), 1);
// pane1.addItem(divWithButton('Right2'), 2);
//
// workspace.getActivePane().splitDown({}).addItem(divWithButton('Right-Down'), 0);
// workspace.getActivePane().splitDown({}).addItem(divWithButton('Right-Down-Down'), 0);
//
//
// var pane;
//
// pane = workspace.addModalPanel({item: button('asdadasdasd', () => pane.destroy()).renderUI()});

var fsTreeModel = new resolvers.FsTreeModel('/examples', fsResolver);

fsTree.initFsTree(fsTreeModel, getSuggestions);