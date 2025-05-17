const fs = require('fs');
const path = require('path');

const readPrompt = (filename) => {
  const filePath = path.join(__dirname, 'prompts', filename);
  return fs.readFileSync(filePath, 'utf8');
};

module.exports = readPrompt;

