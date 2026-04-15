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

// 1. Test scenario toggle
console.log('=== SCENARIO TEST ===');
btns = await page.$$('button');
let scenarioBtn = null;
for (const b of btns) {
  const t = await page.evaluate(el => el.textContent, b);
  if (t.includes('시나')) {
    const rect = await page.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, visible: r.width > 0 };
    }, b);
    console.log('시나 button:', JSON.stringify(rect));
    scenarioBtn = b;
    break;
  }
}

if (scenarioBtn) {
  await scenarioBtn.click();
  await new Promise(r => setTimeout(r, 2000));

  const scenarioState = await page.evaluate(() => {
    // Check if scenario panel exists
    const allDivs = document.querySelectorAll('div');
    for (const d of allDivs) {
      if (d.textContent?.includes('시나리오 레벨') && d.offsetHeight > 20) {
        const r = d.getBoundingClientRect();
        return { found: true, rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
      }
    }
    // Check all h-[40%] elements
    const percentDivs = document.querySelectorAll('[class*="h-\\[40"]');
    return { found: false, percentDivs: percentDivs.length, selectedPart: !!document.querySelector('[class*="slide-in-right"]') };
  });
  console.log('Scenario after click:', JSON.stringify(scenarioState));
  await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/mode-scenario.png' });
} else {
  console.log('시나 button NOT FOUND');
}

// 2. Test xray toggle
console.log('\n=== XRAY TEST ===');
// Turn off scenario first
if (scenarioBtn) await scenarioBtn.click();
await new Promise(r => setTimeout(r, 1000));

btns = await page.$$('button');
for (const b of btns) {
  const t = await page.evaluate(el => el.textContent, b);
  if (t.includes('내부')) {
    await b.click();
    break;
  }
}
await new Promise(r => setTimeout(r, 2000));

const xrayState = await page.evaluate(() => {
  // Count visible 3D labels (Orin, NUC, BAT)
  const labels = [];
  document.querySelectorAll('div').forEach(d => {
    const text = d.textContent?.trim();
    if (text && ['Orin', 'NUC', 'BAT A+B'].includes(text)) {
      const r = d.getBoundingClientRect();
      labels.push({ text, visible: r.width > 0, x: Math.round(r.x), y: Math.round(r.y) });
    }
  });

  // Check ArchitectureView
  const archPanel = document.querySelector('[class*="slide-in-right"]');
  const archView = document.querySelectorAll('[class*="z-30"]');

  return { labels, archViewCount: archView.length, sidebarOpen: !!archPanel };
});
console.log('X-ray labels:', JSON.stringify(xrayState.labels));
console.log('Architecture panels (z-30):', xrayState.archViewCount);
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/mode-xray.png' });

// 3. Check App.jsx conditions
console.log('\n=== APP STATE CHECK ===');
const appState = await page.evaluate(() => {
  // Try to find React fiber to check state
  const root = document.getElementById('root');
  const fiber = root?._reactRootContainer?._internalRoot?.current;
  return { hasFiber: !!fiber };
});
console.log('React fiber:', JSON.stringify(appState));

await browser.close();
