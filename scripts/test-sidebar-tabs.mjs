import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 8000));

// Go to explore mode
let btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('탐색')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 3000));

// Click model to open right sidebar
await page.mouse.click(700, 450);
await new Promise(r => setTimeout(r, 2000));

// Analyze ALL interactive elements in right panel
const analysis = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return { error: 'No panel' };

  const res = { buttons: [], spans: [], tags: [], allText: [] };

  // Find all clickable/tabbable elements
  panel.querySelectorAll('button, a, span, div').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const text = el.textContent?.trim().slice(0, 30);
    const style = window.getComputedStyle(el);

    // Week badges (W0, W1, W2...)
    if (text && text.match(/^W\d+$/)) {
      res.tags.push({
        text,
        tag: el.tagName,
        x: Math.round(rect.x), y: Math.round(rect.y),
        w: Math.round(rect.width), h: Math.round(rect.height),
        cursor: style.cursor,
        pointerEvents: style.pointerEvents,
        clickHandler: !!el.onclick || el.tagName === 'BUTTON',
      });
    }

    // Track badge
    if (text && text.includes('Track')) {
      res.tags.push({ text, tag: el.tagName, cursor: style.cursor, clickHandler: !!el.onclick });
    }

    // Owner badges (δ1, ε2 etc)
    if (text && text.match(/^[δε]\d/)) {
      res.tags.push({
        text,
        tag: el.tagName,
        cursor: style.cursor,
        pointerEvents: style.pointerEvents,
        clickHandler: !!el.onclick,
        x: Math.round(rect.x), y: Math.round(rect.y),
      });
    }
  });

  // Get full panel HTML structure (abbreviated)
  const panelHTML = panel.innerHTML.slice(0, 500);
  res.panelPreview = panelHTML;

  return res;
});

console.log('=== RIGHT SIDEBAR TAGS/BADGES ===');
console.log('Found', analysis.tags?.length, 'tag elements:');
analysis.tags?.forEach(t => {
  console.log(`  "${t.text}" [${t.tag}] cursor=${t.cursor} pointer=${t.pointerEvents} handler=${t.clickHandler} at (${t.x},${t.y})`);
});

// Try clicking a week badge
if (analysis.tags?.length > 0) {
  const weekBadge = analysis.tags.find(t => t.text.match(/^W\d$/));
  if (weekBadge) {
    console.log(`\nClicking week badge "${weekBadge.text}" at (${weekBadge.x + 10}, ${weekBadge.y + 10})...`);
    await page.mouse.click(weekBadge.x + 10, weekBadge.y + 10);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/test-week-click.png' });
    console.log('Screenshot saved');
  }

  // Try clicking an owner badge
  const ownerBadge = analysis.tags.find(t => t.text.match(/^[δε]/));
  if (ownerBadge) {
    console.log(`\nClicking owner badge "${ownerBadge.text}" at (${ownerBadge.x + 10}, ${ownerBadge.y + 10})...`);
    await page.mouse.click(ownerBadge.x + 10, ownerBadge.y + 10);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/test-owner-click.png' });
    console.log('Screenshot saved');
  }
}

await browser.close();
