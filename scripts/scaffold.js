import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to list all topic directories with problems.md
function getAllTopicDirs() {
  const categories = ['01-describing-ui', '02-adding-interactivity', '03-managing-state', '04-escape-hatches'];
  const topics = [];

  categories.forEach(cat => {
    const catPath = path.join(rootDir, cat);
    if (!fs.existsSync(catPath)) return;

    const subdirs = fs.readdirSync(catPath);
    subdirs.forEach(sub => {
      const fullPath = path.join(catPath, sub);
      const probFile = path.join(fullPath, 'problems.md');
      if (fs.existsSync(probFile)) {
        topics.push({
          category: cat,
          topicDir: sub,
          fullPath,
          probFile,
          relPath: `${cat}/${sub}`
        });
      }
    });
  });

  return topics;
}

// Find matching topic dir from input arg like "01-01", "03-02", "01-first-component"
function matchTopic(inputArg) {
  const topics = getAllTopicDirs();
  if (!inputArg) return null;

  const cleanArg = inputArg.trim().toLowerCase();

  const shortMatch = cleanArg.match(/^0?([1-4])[-_]0?(\d+)$/);
  if (shortMatch) {
    const catNum = `0${shortMatch[1]}`;
    const topNum = shortMatch[2].padStart(2, '0');
    return topics.find(t => t.category.startsWith(catNum) && t.topicDir.startsWith(topNum));
  }

  return topics.find(t => 
    t.relPath.toLowerCase() === cleanArg ||
    t.topicDir.toLowerCase() === cleanArg ||
    t.topicDir.toLowerCase().includes(cleanArg)
  );
}

function parseProblemsMd(content, relTopicPath) {
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

    // Validate JS/JSX syntax using esbuild
    let isValidJsx = true;
    try {
      esbuild.transformSync(code, { loader: 'jsx' });
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

function generateSolutionContent({ relTopicPath, extractedBlocks }) {
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

  if (extractedBlocks.length > 0) {
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

// CLI Execution
const args = process.argv.slice(2);
const topicArg = args[0];

const matched = matchTopic(topicArg);

if (!matched) {
  console.log(`\n❌ Topic "${topicArg || ''}" not found.`);
  console.log(`\nUsage examples:`);
  console.log(`  npm run new 01-01      (01-describing-ui/01-first-component)`);
  console.log(`  npm run new 03-02      (03-managing-state/02-structuring-state)`);
  console.log(`  npm run new js-in-jsx  (by topic name keyword)\n`);

  console.log(`Available topics:`);
  getAllTopicDirs().forEach(t => {
    console.log(`  - ${t.relPath}`);
  });
  process.exit(1);
}

const targetFile = path.join(matched.fullPath, 'Solution.jsx');

// Overwrite existing solution file if run with --force
if (fs.existsSync(targetFile) && !args.includes('--force')) {
  console.log(`\n⚠️ Solution.jsx already exists in ${matched.relPath}`);
  console.log(`File: ${targetFile}`);
  console.log(`Pass --force to overwrite.\n`);
  process.exit(0);
}

const mdContent = fs.readFileSync(matched.probFile, 'utf-8');
const parsed = parseProblemsMd(mdContent, matched.relPath);
const solutionCode = generateSolutionContent(parsed);

fs.writeFileSync(targetFile, solutionCode, 'utf-8');

console.log(`\n✅ Generated Solution.jsx successfully!`);
console.log(`📍 Path: ./${matched.relPath}/Solution.jsx`);
console.log(`🚀 The Workbench UI will auto-discover your new solution instantly.\n`);
