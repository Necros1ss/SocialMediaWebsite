const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\fe2a519a-bfa4-4a06-a21e-5fdd11530c67\\scratch\\index-QeT19yko.js', 'utf8');

// Find all matches of something.map(
const regex = /([a-zA-Z0-9_$]+)\.map\(/g;
let match;
const matches = [];

while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  matches.push({
    varName: match[1],
    index: index,
    snippet: content.substring(index - 100, index + 300)
  });
}

console.log(`Found ${matches.length} map calls. Showing first 10:`);
matches.slice(0, 15).forEach((m, idx) => {
  console.log(`\n--- Match ${idx + 1} at index ${m.index} (Var: ${m.varName}) ---`);
  console.log(m.snippet);
});
