const fs = require('fs');
let content = fs.readFileSync('./src/data/mockProducts.js', 'utf8');
const urlRegex = /https?:\/\/[^\s"'`,]+/g;
const urls = content.match(urlRegex) || [];
console.log('Total URLs found:', urls.length);
urls.forEach(u => {
    if (u.includes('1583847268964')) console.log('Found the home one:', u);
});

// Since we know the home one is dead, let's just rip it out explicitly.
const badUrls = [
    'https://images.unsplash.com/photo-1583847268964-b28ce8f31154?w=500&q=80'
];

let lines = content.split('\n');
let filtered = lines.filter(l => !badUrls.some(b => l.includes(b)));
if (filtered.length < lines.length) {
    fs.writeFileSync('./src/data/mockProducts.js', filtered.join('\n'));
    console.log('Removed hardcoded bad URLs!');
}
