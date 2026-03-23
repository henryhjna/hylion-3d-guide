import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });
page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 8000));

// Go to explore mode
let btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('탐색')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 3000));

// Click on 3D model to open sidebar
await page.mouse.click(700, 450);
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/sb1-opened.png' });

// Now analyze the sidebar
const sidebarAnalysis = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return { error: 'No sidebar panel found' };

  const res = { buttons: [], links: [], scrollable: false, allClickable: [] };

  // Find ALL interactive elements in sidebar
  panel.querySelectorAll('button, a, [role="button"], [onclick]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const style = window.getComputedStyle(el);
      res.allClickable.push({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 40),
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        pointerEvents: style.pointerEvents,
        cursor: style.cursor,
        zIndex: style.zIndex,
        overflow: style.overflow,
      });
    }
  });

  // Check if panel is scrollable
  res.scrollable = panel.scrollHeight > panel.clientHeight;
  res.panelHeight = panel.clientHeight;
  res.contentHeight = panel.scrollHeight;

  // Check for overlapping elements ON TOP of panel
  const panelRect = panel.getBoundingClientRect();
  const topRight = document.elementFromPoint(panelRect.right - 20, panelRect.top + 20);
  const midRight = document.elementFromPoint(panelRect.right - 100, panelRect.top + 200);
  res.elementAtTopRight = topRight ? { tag: topRight.tagName, class: (topRight.className||'').slice(0, 40) } : null;
  res.elementAtMid = midRight ? { tag: midRight.tagName, class: (midRight.className||'').slice(0, 40) } : null;

  // Check z-index of panel vs other elements
  res.panelZIndex = window.getComputedStyle(panel).zIndex;
  res.panelPointerEvents = window.getComputedStyle(panel).pointerEvents;

  return res;
});

console.log('=== SIDEBAR ANALYSIS ===');
console.log('Panel z-index:', sidebarAnalysis.panelZIndex);
console.log('Panel pointer-events:', sidebarAnalysis.panelPointerEvents);
console.log('Scrollable:', sidebarAnalysis.scrollable, '(' + sidebarAnalysis.contentHeight + 'px content in ' + sidebarAnalysis.panelHeight + 'px panel)');
console.log('Element at top-right corner:', JSON.stringify(sidebarAnalysis.elementAtTopRight));
console.log('Element at mid panel:', JSON.stringify(sidebarAnalysis.elementAtMid));
console.log('\nClickable elements (' + sidebarAnalysis.allClickable?.length + '):');
sidebarAnalysis.allClickable?.forEach(el => {
  console.log(`  [${el.tag}] "${el.text}" at (${el.rect.x},${el.rect.y}) ${el.rect.w}x${el.rect.h} pointer=${el.pointerEvents} cursor=${el.cursor}`);
});

// Try clicking the X (close) button
const closeBtn = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return null;
  const btns = panel.querySelectorAll('button');
  for (const b of btns) {
    if (b.textContent.trim() === '✕') {
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width/2, y: r.y + r.height/2, text: b.textContent };
    }
  }
  return null;
});
console.log('\nClose button:', JSON.stringify(closeBtn));

if (closeBtn) {
  await page.mouse.click(closeBtn.x, closeBtn.y);
  await new Promise(r => setTimeout(r, 1000));
  const panelAfterClose = await page.evaluate(() => !!document.querySelector('[class*="slide-in-right"]'));
  console.log('Panel after close click:', panelAfterClose ? 'STILL OPEN' : 'CLOSED');
}

// Try scrolling inside panel
await page.mouse.click(700, 450); // reopen
await new Promise(r => setTimeout(r, 2000));

// Scroll panel
const scrollResult = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return 'no panel';
  const scrollEl = panel.querySelector('[class*="overflow"]') || panel;
  const before = scrollEl.scrollTop;
  scrollEl.scrollTop += 200;
  return { before, after: scrollEl.scrollTop, didScroll: scrollEl.scrollTop > before };
});
console.log('\nScroll test:', JSON.stringify(scrollResult));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/sb2-scrolled.png' });

await browser.close();
