import fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from "@babel/generator";
import formatter from "./src/comments-plugin.js"

/*  */
function replaceQuotes(code) {
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript'], // Add plugins if needed
    });

    //console.log(ast);

    ast.comments.forEach(item => {
        item.value = item.value.trim();
    });

    // Traverse the AST to replace double quotes with single quotes
    traverse.default(ast, formatter);

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
