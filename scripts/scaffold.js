import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSolutionFromMd } from '../src/utils/scaffolder.js';

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
const solutionCode = generateSolutionFromMd(mdContent, matched.relPath);

fs.writeFileSync(targetFile, solutionCode, 'utf-8');

console.log(`\n✅ Generated Solution.jsx successfully!`);
console.log(`📍 Path: ./${matched.relPath}/Solution.jsx`);
console.log(`🚀 The Workbench UI will auto-discover your new solution instantly.\n`);
