import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 8000));

// 1. 탐색 모드
const btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('탐색')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/test-explore.png' });
console.log('1. Explore mode screenshot saved');

// 2. 3D 캐릭터 클릭 (화면 중앙 근처)
console.log('2. Clicking at (700, 450)...');
await page.mouse.click(700, 450);
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/test-click1.png' });

// 3. 우측 패널 확인
const panel1 = await page.evaluate(() => {
  const el = document.querySelector('[class*="slide-in-right"]');
  if (el) return { found: true, rect: el.getBoundingClientRect(), class: el.className.slice(0, 80) };
  // PartInfoPanel이 있는지 확인
  const partPanel = document.querySelector('[class*="w-\\[380px\\]"]');
  if (partPanel) return { found: true, type: 'w-380', rect: partPanel.getBoundingClientRect() };
  return { found: false };
});
console.log('3. After click - panel:', JSON.stringify(panel1));

// 4. 다른 위치 클릭
console.log('4. Clicking at (800, 400)...');
await page.mouse.click(800, 400);
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/test-click2.png' });

const panel2 = await page.evaluate(() => {
  const el = document.querySelector('[class*="slide-in-right"]');
  return el ? { found: true, text: el.textContent?.slice(0, 50) } : { found: false };
});
console.log('5. After click2 - panel:', JSON.stringify(panel2));

// 6. 콘솔 에러 확인
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
await new Promise(r => setTimeout(r, 1000));
console.log('6. Console errors:', consoleErrors.length);

// 7. App 상태 분석
const appDebug = await page.evaluate(() => {
  // Canvas 위에 뭔가 겹쳐있는지 확인
  const canvas = document.querySelector('canvas');
  if (!canvas) return 'NO CANVAS';
  const rect = canvas.getBoundingClientRect();
  // 클릭 위치에서 elementFromPoint로 뭘 클릭하는지 확인
  const elAt700 = document.elementFromPoint(700, 450);
  const elAt800 = document.elementFromPoint(800, 400);
  return {
    canvasRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    elementAt700x450: elAt700 ? { tag: elAt700.tagName, class: (elAt700.className||'').slice(0, 50), id: elAt700.id } : 'null',
    elementAt800x400: elAt800 ? { tag: elAt800.tagName, class: (elAt800.className||'').slice(0, 50), id: elAt800.id } : 'null',
  };
});
console.log('7. App debug:', JSON.stringify(appDebug, null, 2));

await browser.close();
