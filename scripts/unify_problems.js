import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to convert section **1.**, **2.** items to `### Exercise X.Y: Title`
function normalizeMarkdownContent(content, topicTitle) {
  let lines = content.split('\n');
  let currentSection = 0;
  let normalizedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect section headers e.g. ## 3. Code Reading & Prediction
    const secMatch = line.match(/^##\s*(\d+)\.\s*(.*)/);
    if (secMatch) {
      currentSection = parseInt(secMatch[1], 10);
      normalizedLines.push(line);
      continue;
    }

    // Detect numbered item markers like `**1.**` or `**1. Title**` or `1.` under sections 3, 4, 5, 6
    if ([3, 4, 5, 6].includes(currentSection)) {
      const itemMatch = line.match(/^\*\*(?:Exercise\s*)?(\d+)\.(?:\s*([^*]+))?\*\*/i) || line.match(/^(\d+)\.\s*(.*)/);
      if (itemMatch && !line.startsWith('1. ') && !line.startsWith('2. ') && !line.startsWith('3. ') && !line.startsWith('4. ') && !line.startsWith('5. ')) {
        const itemNum = itemMatch[1];
        let itemTitle = itemMatch[2] ? itemMatch[2].trim() : `Exercise ${currentSection}.${itemNum}`;
        if (!itemTitle || itemTitle.length < 2) itemTitle = `Exercise ${currentSection}.${itemNum}`;
        
        normalizedLines.push(`### Exercise ${currentSection}.${itemNum}: ${itemTitle}`);
        continue;
      }
    }

    // Standardize Section 8 header
    if (line.match(/^##\s*8\.\s*Real-World Challenge/i) && !line.includes(':')) {
      line = `## 8. Real-World Challenge: ${topicTitle} Challenge`;
    }

    normalizedLines.push(line);
  }

  return normalizedLines.join('\n');
}

console.log("Unifying problems.md files...");
