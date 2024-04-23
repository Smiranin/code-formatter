const fs = require('fs');
const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;

function replaceQuotes(code) {
    const ast = parser.parse(code, {
        sourceType: 'module',
    });

    // Traverse the AST to replace double quotes with single quotes
    traverse(ast, {
        StringLiteral(path) {
            console.log(path.node);
            path.node.extra.raw = path.node.extra.raw.replace(/'/g, "\"");
        },
        // Remove space after //
        LineComment(path) {
            if (path.node.value.startsWith('// ')) {
                path.node.value = '//' + path.node.value.slice(3);
            }
        },
    });

    // Generate code from the modified AST
    const { code: formattedCode } = generator(ast);

    return formattedCode;
}

function formatCode(filePath) {
    try {
        // Read the content of the file
        const code = fs.readFileSync(filePath, 'utf-8');

        // Replace quotes in the code
        const formattedCode = replaceQuotes(code);

        // Write the formatted code back to the file
        fs.writeFileSync(filePath, formattedCode);

        console.log('Code formatted successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
const filePath = 'examples/1.ts';
formatCode(filePath);
