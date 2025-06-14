import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from './utils.js';

describe('parseFrontmatter', () => {
  it('parses YAML frontmatter and body', () => {
    const md = `---\ntitle: Test Post\ndate: 2024-01-01\n---\n\nHello world!`;
    const { attributes, body } = parseFrontmatter(md);
    expect(attributes).toEqual({ title: 'Test Post', date: '2024-01-01' });
    expect(body).toBe('Hello world!');
  });

  it('returns empty attributes if no frontmatter', () => {
    const md = 'No frontmatter here.';
    const { attributes, body } = parseFrontmatter(md);
    expect(attributes).toEqual({});
    expect(body).toBe('No frontmatter here.');
  });
}); 