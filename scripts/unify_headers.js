import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cats = ['01-describing-ui', '02-adding-interactivity', '03-managing-state', '04-escape-hatches'];

const sectionTitleMap = {
  1: '1. Recall Questions',
  2: '2. Conceptual Questions',
  3: '3. Code Reading & Prediction',
  4: '4. Debugging Exercises',
  5: '5. Implementation Exercises',
  6: '6. Modification Exercises',
  7: '7. Edge Case Questions',
  8: '8. Real-World Challenge'
};

cats.forEach(cat => {
  const catDir = path.join(rootDir, cat);
  if (!fs.existsSync(catDir)) return;

  const subdirs = fs.readdirSync(catDir);
  subdirs.forEach(sub => {
    const probFile = path.join(catDir, sub, 'problems.md');
    if (!fs.existsSync(probFile)) return;

    let content = fs.readFileSync(probFile, 'utf-8');

    for (let i = 1; i <= 8; i++) {
      const reg = new RegExp(`^#+\\s*(Part|Section|Level|Phase)?\\s*${i}[:.]?\\s*(.*)`, 'gmi');
      content = content.replace(reg, (match, p1, p2) => {
        if (i === 8) {
          let cleanTitle = p2 ? p2.replace(/^(Real-World Challenge|Real-World Architecture Challenge)[:\s]*/i, '').trim() : '';
          if (!cleanTitle) {
            cleanTitle = sub.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
          return `## 8. Real-World Challenge: ${cleanTitle}`;
        }
        return `## ${sectionTitleMap[i]}`;
      });
    }

    fs.writeFileSync(probFile, content, 'utf-8');
  });
});

console.log("Section headers standardized across all 31 files.");
