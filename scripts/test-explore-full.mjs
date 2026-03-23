import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 8000));

// Go to explore
let btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('탐색')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/exp1-base.png' });

// Click model to open right sidebar
await page.mouse.click(700, 450);
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/exp2-sidebar.png' });

// Scroll sidebar down
const scrolled = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return 'no panel';
  const scrollEl = panel.querySelector('[class*="overflow"]') || panel;
  scrollEl.scrollTop += 400;
  return { scrolled: scrollEl.scrollTop };
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/exp3-scrolled.png' });

// Now test bottom toggles
// Click 내부 toggle
const toggles = await page.evaluate(() => {
  const allBtns = document.querySelectorAll('button');
  const found = [];
  allBtns.forEach(b => {
    const text = b.textContent?.trim();
    if (text?.includes('내부') || text?.includes('시나')) {
      const rect = b.getBoundingClientRect();
      found.push({ text, x: rect.x + rect.width/2, y: rect.y + rect.height/2, w: rect.width, h: rect.height });
    }
  });
  return found;
});
console.log('Bottom toggles:', JSON.stringify(toggles));

if (toggles.length > 0) {
  // Click 내부
  await page.mouse.click(toggles[0].x, toggles[0].y);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/exp4-xray.png' });

  // Click 시나
  if (toggles[1]) {
    await page.mouse.click(toggles[1].x, toggles[1].y);
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/exp5-scenario.png' });
  }
}

// Measure overlapping elements
const overlap = await page.evaluate(() => {
  const issues = [];
  const allVisible = Array.from(document.querySelectorAll('*')).filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top < 900 && r.left < 1440;
  });

  // Check for text overlapping (elements at same position)
  const textEls = allVisible.filter(el => el.children.length === 0 && el.textContent?.trim());
  for (let i = 0; i < textEls.length; i++) {
    for (let j = i + 1; j < textEls.length; j++) {
      const r1 = textEls[i].getBoundingClientRect();
      const r2 = textEls[j].getBoundingClientRect();
      // Check if overlapping
      if (r1.left < r2.right && r2.left < r1.right && r1.top < r2.bottom && r2.top < r1.bottom) {
        const overlapArea = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left)) *
                           Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
        if (overlapArea > 50) { // significant overlap
          issues.push({
            text1: textEls[i].textContent.trim().slice(0, 20),
            text2: textEls[j].textContent.trim().slice(0, 20),
            area: Math.round(overlapArea),
            pos1: { x: Math.round(r1.left), y: Math.round(r1.top) },
            pos2: { x: Math.round(r2.left), y: Math.round(r2.top) },
          });
        }
      }
    }
    if (issues.length > 15) break;
  }
  return issues;
});

console.log('\n=== OVERLAPPING TEXT ELEMENTS ===');
console.log('Found:', overlap.length, 'overlaps');
overlap.slice(0, 10).forEach(o => {
  console.log(`  "${o.text1}" overlaps "${o.text2}" (area=${o.area}px²) at (${o.pos1.x},${o.pos1.y}) vs (${o.pos2.x},${o.pos2.y})`);
});

await browser.close();
