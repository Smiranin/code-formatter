import fs from 'fs';
import * as parser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';

// import traverse from '@babel/traverse';
import { default as generate } from '@babel/generator';

const traverse = babelTraverse.default.default;

function replaceQuotes(code) {
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'], // Add plugins if needed
    });

    // Traverse the AST to replace double quotes with single quotes
    traverse(ast, {
        StringLiteral(path) {
            path.node.value = path.node.value.replace(/"/g, "'");
        },
        // Remove space after //
        CommentLine(path) {
            if (path.node.type === 'Line' && path.node.value.startsWith('// ')) {
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

        // Replace quotes and comments in the code
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
