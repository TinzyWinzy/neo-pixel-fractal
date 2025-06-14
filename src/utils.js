import yaml from 'js-yaml';
import { marked } from 'marked';

/**
 * Parses YAML frontmatter from a markdown string.
 * @param {string} md - Markdown file contents
 * @returns {{ attributes: Object, body: string }}
 */
export function parseFrontmatter(md) {
  const match = md.match(/^---([\s\S]+?)---([\s\S]*)$/);
  if (!match) return { attributes: {}, body: md };
  let attributes = {};
  try {
    attributes = yaml.load(match[1].trim()) || {};
  } catch (err) {
    console.error('YAML frontmatter parse error:', err);
  }
  const body = match[2].trim();
  return { attributes, body };
}

/**
 * Renders markdown to HTML with custom blockquote, code, and image styles.
 * @param {string} md - Markdown content
 * @returns {string} HTML string
 */
export function renderMarkdown(md) {
  const renderer = new marked.Renderer();
  renderer.blockquote = text => {
    if (typeof text === 'object' && text !== null) {
      // Try to extract textContent or join values
      if (Array.isArray(text)) return `<blockquote class='custom-blockquote'>${text.join('')}</blockquote>`;
      if ('text' in text) return `<blockquote class='custom-blockquote'>${text.text}</blockquote>`;
      return `<blockquote class='custom-blockquote'>${Object.values(text).join('')}</blockquote>`;
    }
    if (typeof text !== 'string') {
      try { text = String(text); } catch { text = ''; }
    }
    return `<blockquote class='custom-blockquote'>${text}</blockquote>`;
  };
  renderer.code = (code, lang) => {
    if (typeof code === 'object' && code !== null) {
      if (Array.isArray(code)) code = code.join('');
      else if ('text' in code) code = code.text;
      else code = Object.values(code).join('');
    }
    if (typeof code !== 'string') {
      code = code == null ? '' : String(code);
    }
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class='custom-code code-highlight'><code>${escaped}</code></pre>`;
  };
  renderer.codespan = code => {
    const escaped = String(code)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class='has-tooltip hover-glow' tabindex="0" style="position:relative;"><code>${escaped}</code><span class='tooltip'>Copy</span></span>`;
  };
  renderer.image = (href, title, text) => `<img src='${href}' alt='${text}' class='custom-img' />`;
  return marked(md, { renderer });
} 