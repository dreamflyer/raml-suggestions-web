var parser = require("raml-1-parser");
var suggestions = require("raml-suggestions");

var resolvers = require("./resolvers");

function setupParser() {
    var oldMethod = parser.project.createProject;

    var newMethod = function(path) {
        return oldMethod(path, resolvers.fsResolver);
    }

    parser.project.createProject = newMethod;
}

var completionProvider = new suggestions.CompletionProvider(resolvers.completionContentProvider);

function completionByOffset(filePath, offset) {
    var content = resolvers.getVirtualFsContent(filePath);
    var position = resolvers.getPosition(offset);
    
    var proposals = completionProvider.suggest(new suggestions.CompletionRequest(content, position), true);
    
    var result = proposals.map(function(suggestion) {
        return suggestion.displayText || suggestion.text;
    });
    
    console.log(result.join(','));
}

setupParser();

exports.completionByOffset = completionByOffset;

