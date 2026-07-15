const fs = require('fs');
const path = require('path');

function fixEncoding(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixEncoding(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            try {
                // Buffer.from(content, 'latin1') decodes the wrongly encoded UTF-8 bytes
                // .toString('utf-8') turns them back into the real characters
                const fixedContent = Buffer.from(content, 'latin1').toString('utf-8');
                
                // Only overwrite if it actually changed and doesn't have replacement chars
                if (content !== fixedContent && !fixedContent.includes('ï¿½')) {
                    fs.writeFileSync(fullPath, fixedContent, 'utf-8');
                }
            } catch (e) {
                // Skip if it fails
            }
        }
    }
}

fixEncoding('./frontend/src/components');
fixEncoding('./frontend/src/app');
console.log('Encoding fix applied to all components and app pages.');
