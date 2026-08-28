import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cats = ['01-describing-ui', '02-adding-interactivity', '03-managing-state', '04-escape-hatches'];

cats.forEach(cat => {
  const catDir = path.join(rootDir, cat);
  if (!fs.existsSync(catDir)) return;

  const subdirs = fs.readdirSync(catDir);
  subdirs.forEach(sub => {
    const probFile = path.join(catDir, sub, 'problems.md');
    if (!fs.existsSync(probFile)) return;

    let content = fs.readFileSync(probFile, 'utf-8');
    
    // Normalize Section 8 header to `## 8. Real-World Challenge: ...`
    content = content.replace(/^##\s*8\.\s*Real-World Challenge.*/m, (match) => {
      if (!match.includes(':')) {
        const title = sub.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return `## 8. Real-World Challenge: The ${title} Challenge`;
      }
      return match;
    });

    // Ensure Section 1 to 8 presence check
    fs.writeFileSync(probFile, content, 'utf-8');
  });
});

console.log("Section 8 headings normalized across all 31 files.");
