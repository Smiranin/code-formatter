const fs = require('fs');
const acorn = require('acorn');
const walk = require('acorn-walk');

async function formatCodeInFile(filePath) {
    try {
        // Read code from file
        const code = await fs.promises.readFile(filePath, 'utf8');

        // Format code
        const formattedCode = await formatCode(code);

        // Write formatted code back to the same file
        await fs.promises.writeFile(filePath, formattedCode, 'utf8');
        console.log('Formatted code has been written to', filePath);
    } catch (err) {
        console.error('Error:', err);
    }
}

async function formatCode(code) {
    const ast = acorn.parse(code, { ecmaVersion: 2020 });

    const codeParts = [];

    walk.simple(ast, {
        full(node) {
            console.log(node);
            if (typeof node.value === 'string' && node.raw.startsWith("'")) {
                node.raw = '"' + node.value.replace(/"/g, '\\"') + '"';
                node.value = node.raw.substring(1, node.raw.length - 1);
            }
            codeParts.push(node.raw);
        }
    });

    return codeParts.join('');
}

// Usage
const inputFile = 'examples/1.ts';
formatCodeInFile(inputFile);
