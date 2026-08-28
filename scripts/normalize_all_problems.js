import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const categories = ['01-describing-ui', '02-adding-interactivity', '03-managing-state', '04-escape-hatches'];

categories.forEach(cat => {
  const catPath = path.join(rootDir, cat);
  if (!fs.existsSync(catPath)) return;

  const subdirs = fs.readdirSync(catPath);
  subdirs.forEach(sub => {
    const probFile = path.join(catPath, sub, 'problems.md');
    if (!fs.existsSync(probFile)) return;

    let content = fs.readFileSync(probFile, 'utf-8');
    let lines = content.split('\n');
    let currentSection = 0;
    let newLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Check section header
      const secMatch = line.match(/^##\s*(\d+)\.\s*(.*)/);
      if (secMatch) {
        currentSection = parseInt(secMatch[1], 10);
        newLines.push(line);
        continue;
      }

      // Format bold item numbers like `**1.**` or `**1. Title**` in sections 3, 4, 5, 6
      if ([3, 4, 5, 6].includes(currentSection)) {
        const itemMatch = line.match(/^\*\*(?:Exercise\s*)?(\d+)\.(?:\s*([^*]+))?\*\*/i);
        if (itemMatch) {
          const itemNum = itemMatch[1];
          let itemTitle = itemMatch[2] ? itemMatch[2].trim() : `Exercise ${currentSection}.${itemNum}`;
          if (!itemTitle || itemTitle.length < 2) itemTitle = `Exercise ${currentSection}.${itemNum}`;
          
          newLines.push(`### Exercise ${currentSection}.${itemNum}: ${itemTitle}`);
          continue;
        }
      }

      newLines.push(line);
    }

    fs.writeFileSync(probFile, newLines.join('\n'), 'utf-8');
    console.log(`Normalized: ${cat}/${sub}/problems.md`);
  });
});

console.log("All problems.md files successfully normalized!");
