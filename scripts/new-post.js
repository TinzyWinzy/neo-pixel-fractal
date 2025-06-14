#!/usr/bin/env node

// CLI tool to create a new markdown post in src/posts/
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

(async () => {
  const title = await ask('Title: ');
  const tags = await ask('Tags (comma separated): ');
  const description = await ask('Description: ');
  const oneLiner = await ask('Body (one-liner, leave blank to enter multi-line): ');
  let body = oneLiner;
  if (!oneLiner) {
    console.log('Enter body (end with a single "." on a line):');
    let lines = [];
    for await (const line of rl) {
      if (line.trim() === '.') break;
      lines.push(line);
    }
    body = lines.join('\n');
  }
  const slug = slugify(title);
  const date = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `author: "White Half Moon"`,
    `readingTime: "TBD"`,
    `slug: "${slug}"`,
    `tags: [${tags.split(',').map(t => '"' + t.trim() + '"').filter(Boolean).join(', ')}]`,
    `date: "${date}"`,
    `description: "${description}"`,
    '---',
    ''
  ].join('\n');
  const content = `${frontmatter}${body}\n\n---\n*"Draft. Expand with Deepseek."*\n`;
  const outPath = path.join(__dirname, '../src/posts/', `${slug}.md`);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Post created: ${outPath}`);
  // TODO: Add --deepseek flag to generate body with Deepseek
  rl.close();
})(); 