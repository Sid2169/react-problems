import { parse } from '@babel/parser';

/**
 * Parses problems.md content to extract code blocks, sanitize syntax, rename duplicates,
 * and auto-close unclosed void HTML tags or unfragmented JSX returns.
 * 
 * @param {string} content - Raw markdown text from problems.md
 * @param {string} relTopicPath - Relative path of topic, e.g. '01-describing-ui/01-first-component'
 * @returns {{ relTopicPath: string, extractedBlocks: Array<{ blockIndex: number, declaredNames: string[], code: string }> }}
 */
export function parseProblemsMd(content, relTopicPath) {
  const extractedBlocks = [];
  const globalDeclaredNames = new Map(); // name -> count

  const codeBlockRegex = /```(?:jsx|javascript|js)?\n([\s\S]*?)\n```/g;
  let match;
  let blockIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    let rawCode = match[1];

    // Strip inline import statements
    let code = rawCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '').trim();

    // Sanitize intentional syntax errors in problem prompts (e.g. export default const -> const)
    code = code.replace(/export\s+default\s+(const|let|var)\s+/g, '$1 ');

    // Strip standalone export default / export { ... } statements
    code = code.replace(/export\s+(?:default\s+)?(?:\{\s*[A-Za-z0-9_,\s]*\}|[A-Z]\w*);?/g, '').trim();

    // Strip all leading export / export default keywords from declarations
    code = code.replace(/export\s+(?:default\s+)?/g, '');

    // Auto-close void HTML tags (<input>, <img>, <br>, <hr>)
    code = code.replace(/<(input|img|br|hr|meta|link)([^>]*?)(?<!\/)>/gi, '<$1$2 />');

    // Auto-fix unfragmented JSX returns in prompt snippets
    code = code.replace(/return\s*\(\s*\n?(\s*<([A-Za-z0-9_]+)[\s\S]*?>[\s\S]*?<\/\2>\s*\n\s*<([A-Za-z0-9_]+)[\s\S]*?>[\s\S]*?<\/\3>[\s\S]*?)\s*\)/g, 'return (\n    <>\n      $1\n    </>\n  )');

    if (!code) continue;

    // Find all component function & arrow component declarations in this block
    const funcMatches = [...code.matchAll(/(?:function|(?:const|let|var))\s+([A-Z]\w*)/g)];

    if (funcMatches.length === 0) continue;

    blockIndex++;
    const blockDeclaredNames = [];

    // Replace each function/component declaration sequentially to guarantee unique top-level names
    funcMatches.forEach(m => {
      const origName = m[1];
      let uniqueName = origName;

      if (globalDeclaredNames.has(origName)) {
        const count = globalDeclaredNames.get(origName) + 1;
        globalDeclaredNames.set(origName, count);
        uniqueName = `${origName}_v${count}`;
      } else {
        globalDeclaredNames.set(origName, 1);
      }

      blockDeclaredNames.push(uniqueName);

      if (uniqueName !== origName) {
        // Replace exact function declaration
        const regDecl = new RegExp(`\\b(function|(?:const|let|var))\\s+${origName}\\b`);
        code = code.replace(regDecl, `$1 ${uniqueName}`);
      }
    });

    // Ensure all component declarations have `export`
    blockDeclaredNames.forEach((name) => {
      const exportReg = new RegExp(`\\b(function|(?:const|let|var))\\s+${name}\\b`, 'g');
      code = code.replace(exportReg, `export $1 ${name}`);
    });

    // Validate JS/JSX syntax using @babel/parser
    let isValidJsx = true;
    try {
      parse(code, { sourceType: 'module', plugins: ['jsx'] });
    } catch (e) {
      isValidJsx = false;
    }

    if (!isValidJsx) {
      // If code snippet from problems.md had intentional invalid JSX syntax, comment it out safely with line comments
      const safeRaw = rawCode.trim().split('\n').map(line => `// ${line}`).join('\n');
      let safeCode = `// Intentional Debugging Exercise Snippet:\n${safeRaw}\n\n`;
      blockDeclaredNames.forEach((name) => {
        safeCode += `export function ${name}() {\n  return (\n    <div style={{ padding: '16px', background: '#fef2f2', border: '1px dashed #ef4444', borderRadius: '6px' }}>\n      <p><strong>${name}</strong> (Fix intentional prompt errors above)</p>\n    </div>\n  );\n}\n`;
      });
      code = safeCode;
    }

    extractedBlocks.push({
      blockIndex,
      declaredNames: blockDeclaredNames,
      code
    });
  }

  return {
    relTopicPath,
    extractedBlocks
  };
}

/**
 * Generates Solution.jsx string content from parsed topic blocks
 * 
 * @param {{ relTopicPath: string, extractedBlocks: Array<{ blockIndex: number, declaredNames: string[], code: string }> }} parsedResult
 * @returns {string}
 */
export function generateSolutionContent({ relTopicPath, extractedBlocks }) {
  let content = `import React, { useState, useEffect } from 'react';

/**
 * -------------------------------------------------------------------
 * Solution for ${relTopicPath}
 * -------------------------------------------------------------------
 */

// Written Answers (Recall, Conceptual, Code Reading, Edge Cases)
export const answers = {
  recall: {
    q1: "", q2: "", q3: "", q4: "", q5: ""
  },
  conceptual: {
    q1: "", q2: ""
  }
};

`;

  if (extractedBlocks && extractedBlocks.length > 0) {
    extractedBlocks.forEach((block, idx) => {
      const isLast = idx === extractedBlocks.length - 1;
      const mainCompName = block.declaredNames[block.declaredNames.length - 1];

      content += `/**\n * Exercise Block ${block.blockIndex}: ${block.declaredNames.join(', ')}\n */\n`;

      let blockCode = block.code;
      if (isLast && mainCompName) {
        // Change the last block's main component to export default function
        if (blockCode.includes(`export function ${mainCompName}`)) {
          blockCode = blockCode.replace(`export function ${mainCompName}`, `export default function ${mainCompName}`);
        }
      }

      content += blockCode + `\n\n`;
    });
  } else {
    // Fallback starter template
    content += `/**\n * Exercise 5.1 Component\n */\n`;
    content += `export function Exercise5_1() {\n  return (\n    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>\n      <h3>Exercise 5.1 Solution</h3>\n    </div>\n  );\n}\n\n`;
    content += `/**\n * Main Challenge Solution\n */\n`;
    content += `export default function MainSolution() {\n  return (\n    <div style={{ padding: '20px', background: '#e0e7ff', borderRadius: '8px' }}>\n      <h2>Main Challenge Solution</h2>\n    </div>\n  );\n}\n`;
  }

  return content;
}

/**
 * Parses markdown and generates the exact Solution.jsx code
 * 
 * @param {string} mdContent 
 * @param {string} relTopicPath 
 * @returns {string}
 */
export function generateSolutionFromMd(mdContent, relTopicPath) {
  const parsed = parseProblemsMd(mdContent || '', relTopicPath || '');
  return generateSolutionContent(parsed);
}
