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
    
    
    return completionProvider.suggest(new suggestions.CompletionRequest(content, position), true) || [];
}

var fsTreeModel = new resolvers.FsTreeModel('/examples', fsResolver);

fsTree.initFsTree(fsTreeModel, getSuggestions);