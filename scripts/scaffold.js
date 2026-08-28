import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const exportedComponents = [];
  const seenNames = new Set();

  const codeBlockRegex = /```(?:jsx|javascript|js)?\n([\s\S]*?)\n```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    let code = match[1];

    // Remove inline import statements from code block
    code = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '').trim();

    // Look for function declarations e.g. function ComponentName
    const funcMatches = [...code.matchAll(/function\s+([A-Z]\w*)/g)];
    
    if (funcMatches.length > 0) {
      funcMatches.forEach(m => {
        const compName = m[1];
        if (!seenNames.has(compName)) {
          seenNames.add(compName);
          
          // Cleanly replace function declaration with export function
          let exportedCode = code.replace(
            new RegExp(`(export\\s+default\\s+)?(export\\s+)?function\\s+${compName}`),
            `export function ${compName}`
          );

          exportedComponents.push({
            name: compName,
            code: exportedCode
          });
        }
      });
    }
  }

  return {
    relTopicPath,
    exportedComponents
  };
}

function generateSolutionContent({ relTopicPath, exportedComponents }) {
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
\n`;

  if (exportedComponents.length > 0) {
    exportedComponents.forEach((comp, idx) => {
      const isLast = idx === exportedComponents.length - 1;
      content += `/**\n * Exercise Component: ${comp.name}\n */\n`;
      if (isLast) {
        // Change single `export function CompName` to `export default function CompName`
        content += comp.code.replace(`export function ${comp.name}`, `export default function ${comp.name}`);
      } else {
        content += comp.code;
      }
      content += `\n\n`;
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

// Overwrite existing solution file if run with --force or test
if (fs.existsSync(targetFile) && !args.includes('--force')) {
  console.log(`\n⚠️ Solution.jsx already exists in ${matched.relPath}`);
  console.log(`File: ${targetFile}`);
  console.log(`Pass --force to overwrite.`);
  process.exit(0);
}

const mdContent = fs.readFileSync(matched.probFile, 'utf-8');
const parsed = parseProblemsMd(mdContent, matched.relPath);
const solutionCode = generateSolutionContent(parsed);

fs.writeFileSync(targetFile, solutionCode, 'utf-8');

console.log(`\n✅ Generated Solution.jsx successfully!`);
console.log(`📍 Path: ./${matched.relPath}/Solution.jsx`);
console.log(`🚀 The Workbench UI will auto-discover your new solution instantly.\n`);
