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
    const start = html.indexOf("gtag('event','affiliate_click'");
    const event = html.slice(start, start + 900);
    assert.match(event, /offer_id\s*:\s*a\.dataset\.offerId\|\|null/, file);
    assert.match(event, /advertiser\s*:\s*a\.dataset\.advertiser\|\|null/, file);
    assert.match(event, /network\s*:\s*a\.dataset\.network\|\|null/, file);
    assert.match(event, /persona_id\s*:\s*personaId\(\)/, file);
    assert.match(event, /source_page\s*:\s*location\.pathname/, file);
    assert.match(event, /outbound_url\s*:\s*safeUrl\(a\.href\)/, file);
    assert.match(event, /transport_type\s*:\s*['"]beacon['"]/, file);
    assert.doesNotMatch(event, /\bchannel\s*:/, file);
    assert.match(html, /return u\.origin\+u\.pathname/, file);
  }
});
