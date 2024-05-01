import fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from "@babel/types";
import generate from "@babel/generator";

console.log(generate.default);
function replaceQuotes(code) {
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript'], // Add plugins if needed
    });

    // Traverse the AST to replace double quotes with single quotes
    traverse.default(ast, {
        BinaryExpression(path) {
            if (path.node.operator !== "===") {
                return;
            }
            path.node.left = t.identifier("sebmck");
            path.node.right = t.identifier("dork");
        }
    });

    // Generate code from the modified AST
    const { code: formattedCode } = generate.default(ast);

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
