import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'changeme'; // Set this in env!

app.use(bodyParser.json());

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post('/api/save-post', (req, res) => {
  const { secret, title, tags, description, body } = req.body;
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }
  const slug = slugify(title);
  const date = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `author: "White Half Moon"`,
    `readingTime: "TBD"`,
    `slug: "${slug}"`,
    `tags: [${(tags||'').split(',').map(t => '"' + t.trim() + '"').filter(Boolean).join(', ')}]`,
    `date: "${date}"`,
    `description: "${description||''}"`,
    '---',
    ''
  ].join('\n');
  const content = `${frontmatter}${body}\n\n---\n*"Draft. Expand with Deepseek."*\n`;
  const outPath = path.join(__dirname, 'src/posts/', `${slug}.md`);
  fs.writeFileSync(outPath, content, 'utf8');
  res.json({ success: true, file: outPath });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 