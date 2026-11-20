// Sets each blog post's full text from its Markdown: home/posts/<slug>.md into
// public/blog/<slug>.html, between the <!-- post:start --> and <!-- post:end --> marks, and its
// "On this page" list between <!-- toc:start --> and <!-- toc:end -->. One <section> per ## heading.
//   npm run home:posts
// The page around the text (head, header, cover) is edited by hand; only the marked parts are written.
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import MarkdownIt from 'markdown-it';

const HOME = fileURLToPath(new URL('..', import.meta.url));
const md = new MarkdownIt({html: false, linkify: true, typographer: true});
const slugify = text => text.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function render(source) {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  // Text before the first ## heading opens the essay, in a section of its own without a heading.
  const parts = body.split(/^## +(.+)$/m);
  const sections = [];
  const toc = [];
  const used = new Set();
  if (parts[0].trim()) sections.push(`        <section aria-label="Opening">\n${md.render(parts[0].trim())}        </section>`);
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    let id = slugify(heading) || `section-${i}`;
    while (used.has(id) || id === 'title' || id === 'content') id += '-2';
    used.add(id);
    sections.push(`        <section aria-labelledby="${id}">\n          <h2 id="${id}">${escape(heading)}</h2>\n${md.render(parts[i + 1].trim())}        </section>`);
    toc.push(`        <li><a href="#${id}">${escape(heading)}</a></li>`);
  }
  return {sections: sections.join('\n\n'), toc: toc.join('\n')};
}

const between = (html, name, inner, file) => {
  const pattern = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(\\s*<!-- ${name}:end -->)`);
  if (!pattern.test(html)) throw new Error(`${file}: no <!-- ${name}:start --> … <!-- ${name}:end --> marks`);
  return html.replace(pattern, `$1\n${inner}$2`);
};

for (const name of readdirSync(join(HOME, 'posts')).filter(f => f.endsWith('.md'))) {
  const slug = name.replace(/\.md$/, '');
  const page = join(HOME, 'public/blog', `${slug}.html`);
  const {sections, toc} = render(readFileSync(join(HOME, 'posts', name), 'utf8'));
  let html = readFileSync(page, 'utf8');
  html = between(html, 'post', sections, page);
  html = between(html, 'toc', toc, page);
  // With no headings there is nothing to list: the reader column stays hidden.
  html = html.replace(/<aside class="site-toc"( hidden)?/, toc ? '<aside class="site-toc"' : '<aside class="site-toc" hidden');
  writeFileSync(page, html);
  console.log(`${slug}: ${toc ? toc.split('\n').length : 0} sections`);
}
