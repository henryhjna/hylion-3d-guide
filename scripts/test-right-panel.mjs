import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 8000));

// Go to explore mode + click model
let btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('탐색')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 3000));
await page.mouse.click(700, 450);
await new Promise(r => setTimeout(r, 2000));

// Analyze EVERY interactive-looking element in right panel
const analysis = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return { error: 'No panel' };

  const elements = [];
  panel.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const style = window.getComputedStyle(el);
    const cursor = style.cursor;
    const text = el.textContent?.trim().slice(0, 30);
    const tag = el.tagName;
    const hasClick = !!el.onclick;
    const isButton = tag === 'BUTTON' || tag === 'A';

    // "버튼처럼 보이는" 요소: cursor:pointer 또는 클릭 가능하거나 특정 스타일
    const looksClickable = cursor === 'pointer' || isButton || el.getAttribute('role') === 'button';

    if (looksClickable && text) {
      elements.push({
        tag, text, cursor,
        hasOnClick: hasClick,
        hasReactHandler: el._reactEvents || el.__reactFiber$ ? true : false,
        classes: (el.className || '').slice(0, 60),
        bgColor: style.backgroundColor,
        border: style.border?.slice(0, 40),
      });
    }
  });

  return { count: elements.length, elements };
});

console.log('=== RIGHT PANEL CLICKABLE ELEMENTS ===');
console.log('Total:', analysis.count);
analysis.elements?.forEach(el => {
  const works = el.tag === 'BUTTON' ? '✅ BUTTON' : el.hasOnClick ? '✅ has onclick' : '⚠️ looks clickable but no handler';
  console.log(`  ${works} [${el.tag}] cursor=${el.cursor} "${el.text}"`);
  console.log(`    classes: ${el.classes}`);
});

await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/test-panel-btns.png' });
await browser.close();
