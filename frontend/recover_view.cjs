const fs = require('fs');
const logPath = 'C:/Users/Aman kumar/.gemini/antigravity-ide/brain/991ab146-e17b-454e-a1ad-e39a10561a65/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let maxLen = 0;
let bestContent = "";

for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i].trim()) continue;
  try {
      const data = JSON.parse(lines[i]);
      if (data.type === "VIEW_FILE" && data.content && data.content.includes("export const " + "categories = {")) {
          if (data.content.length > maxLen) {
              maxLen = data.content.length;
              bestContent = data.content;
          }
      }
      if (data.type === "PLANNER_RESPONSE" && data.output && data.output.includes("export const " + "categories = {")) {
          if (data.output.length > maxLen) {
              maxLen = data.output.length;
              bestContent = data.output;
          }
      }
  } catch(e) {}
}

if (bestContent) {
    // Strip header
    let content = bestContent;
    const match = content.match(/The following code has been modified.*?\n([\s\S]*?)(\nThe above content|$)/);
    if (match) {
        content = match[1];
    } else {
        // Find first line starting with 1:
        const idx = content.indexOf('1: ');
        if (idx !== -1) content = content.substring(idx);
    }
    
    // Strip line numbers
    content = content.replace(/^\d+:\s?/gm, '');
    
    fs.writeFileSync('src/data/mockProducts.js', content);
    console.log("Restored mockProducts.js successfully! Length:", content.length);
} else {
    console.log("Could not find a large VIEW_FILE output.");
}
