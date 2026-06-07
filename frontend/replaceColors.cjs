const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (file !== 'node_modules') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const replacements = [
  { from: /bg-charcoal/g, to: 'bg-earth' },
  { from: /text-charcoal/g, to: 'text-earth' },
  { from: /border-charcoal/g, to: 'border-earth' },
  { from: /from-charcoal/g, to: 'from-earth' },
  { from: /to-charcoal/g, to: 'to-earth' },
  { from: /text-gold/g, to: 'text-saffron' },
  { from: /bg-gold/g, to: 'bg-saffron' },
  { from: /border-gold/g, to: 'border-saffron' },
  { from: /eyebrow-gold/g, to: 'eyebrow-saffron' },
  { from: /btn-gold/g, to: 'btn-saffron' },
  { from: /from-gold/g, to: 'from-saffron' },
  { from: /via-charcoal/g, to: 'via-earth' },
];

const files = walkSync('c:/Users/aksv4/Desktop/tour/frontend/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

console.log('Color replacement complete.');
