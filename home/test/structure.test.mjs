import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { parse } from 'parse5';
import test from 'node:test';

const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;

test('home and docs HTML have unique IDs and valid local/ARIA targets', async () => {
  for (const relative of ['../public/', '../../docs/']) {
    const directory = new URL(relative, import.meta.url);
    for (const file of (await readdir(directory)).filter(name => name.endsWith('.html'))) {
      const all = nodes(parse(await readFile(new URL(file, directory), 'utf8')));
      const ids = all.map(node => attr(node, 'id')).filter(Boolean);
      const label = `${relative}${file}`;
      assert.equal(new Set(ids).size, ids.length, `${label}: duplicate IDs`);
      assert.ok(ids.includes('content'), `${label}: preserve skip navigation target`);
      for (const node of all) {
        const href = attr(node, 'href');
        const targets = [...(href?.startsWith('#') && href.length > 1 ? [decodeURIComponent(href.slice(1))] : []),
          ...(attr(node, 'aria-labelledby')?.split(/\s+/) ?? [])];
        for (const id of targets) assert.ok(ids.includes(id), `${label}: missing target ${id}`);
      }
    }
  }
});

test('home Wrangler schema resolves to the root installed dependency', async () => {
  const config = new URL('../wrangler.jsonc', import.meta.url);
  const source = await readFile(config, 'utf8');
  const path = source.match(/"\$schema":\s*"([^"]+)"/)[1];
  assert.equal(new URL(path, config).href, new URL('../../node_modules/wrangler/config-schema.json', import.meta.url).href);
  await access(new URL(path, config));
});

test('local docs previews use repo-owned paths, not private launchers', async () => {
  const root = new URL('../../', import.meta.url);
  const { scripts } = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  for (const [name, option, path] of [
    ['docs:dev', '--config', 'docs/wrangler.jsonc'],
  ]) {
    assert.ok(scripts[name]?.includes(`${option} ${path}`));
    assert.match(scripts[name], /--ip 127\.0\.0\.1/);
    await access(new URL(path, root));
  }
  for (const path of ['README.md', 'home/README.md']) {
    assert.doesNotMatch(await readFile(new URL(path, root), 'utf8'), /\.claude\/launch\.json/);
  }
});

test('blog pages: the docs column (an exact copy of the docs stylesheet) beside the home site\'s own sidebar', async () => {
  const docs = await readFile(new URL('../../docs/styles.css', import.meta.url), 'utf8');
  const copy = await readFile(new URL('../public/docs.css', import.meta.url), 'utf8');
  assert.equal(copy, docs, 'home/public/docs.css must equal docs/styles.css; copy it again after changing the docs');
  const pages = ['blog.html', ...(await readdir(new URL('../public/blog/', import.meta.url))).map(name => `blog/${name}`)];
  for (const page of pages) {
    const html = await readFile(new URL(`../public/${page}`, import.meta.url), 'utf8');
    assert.match(html, /<link rel="stylesheet" href="\/docs\.css">\s*<link rel="stylesheet" href="\/blog\.css">/, `${page}: docs.css, then blog.css`);
    assert.doesNotMatch(html, /href="\/styles\.css"/, `${page}: not the home stylesheet`);
    assert.match(html, /<body class="blog( reader)?">/, `${page}: body.blog`);
    assert.match(html, /<header class="site-header">[\s\S]*<nav class="site-sections" aria-label="Site">/, `${page}: the home sidebar`);
    assert.doesNotMatch(html, /class="site-sidebar"/, `${page}: not the docs sidebar`);
    assert.equal(html.match(/<main/g)?.length, 1, `${page}: one main`);
    assert.equal(html.match(/<\/main>/g)?.length, 1, `${page}: main closed once`);
  }
});
