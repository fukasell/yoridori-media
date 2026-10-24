const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function htmlFiles(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const loc = path.join(dir,entry.name);
    return entry.isDirectory() ? htmlFiles(loc) : loc.endsWith('.html') ? [loc] : [];
  });
}
test('affiliate clicks preserve offer/persona with no invented SEO acquisition', () => {
  const files = htmlFiles(root).filter(p => fs.readFileSync(p,'utf8').includes("gtag('event','affiliate_click'"));
  assert.ok(files.length >= 33, 'unexpectedly lost affiliate click instrumented pages');
  for (const file of files) {
    const html = fs.readFileSync(file,'utf8');
    assert.match(html, /offer_id\s*:/, file);
    assert.match(html, /persona_id\s*:/, file);
    assert.match(html, /source_page\s*:/, file);
    assert.doesNotMatch(html, /channel\s*:\s*['"]web_seo['"]/, file);
  }
});
