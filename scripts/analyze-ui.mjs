import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 6000));

// Screenshot: All view
await page.screenshot({ path: '/tmp/ui-all.png' });

// δ1 member
const buttons = await page.$$('button');
for (const btn of buttons) {
  const t = await page.evaluate(el => el.textContent, btn);
  if (t.trim() === 'δ1') { await btn.click(); break; }
}
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '/tmp/ui-delta1.png' });

// Analyze dashboard
const analysis = await page.evaluate(() => {
  const res = { smallFont: [], tightSpacing: [], noBackground: [], overlapping: [] };

  // 1. 대시보드 내 모든 텍스트 요소의 font-size
  const dash = document.querySelector('[class*="glass-panel"]:not(nav)');
  if (!dash) return { error: 'No dashboard' };

  dash.querySelectorAll('*').forEach(el => {
    const s = window.getComputedStyle(el);
    const fs = parseFloat(s.fontSize);
    const rect = el.getBoundingClientRect();
    if (el.children.length === 0 && el.textContent.trim() && rect.width > 0) {
      if (fs < 13) res.smallFont.push({ text: el.textContent.trim().slice(0,40), fs, tag: el.tagName });
    }
  });

  // 2. 대시보드 직계 자식들 간의 간격
  const scrollArea = dash.querySelector('[class*="overflow-y-auto"]');
  if (scrollArea) {
    const children = Array.from(scrollArea.children);
    for (let i = 0; i < children.length - 1; i++) {
      const r1 = children[i].getBoundingClientRect();
      const r2 = children[i+1].getBoundingClientRect();
      const gap = r2.top - r1.bottom;
      if (gap < 12) res.tightSpacing.push({ between: i + '-' + (i+1), gap: Math.round(gap), el1: children[i].textContent?.trim().slice(0,20), el2: children[i+1].textContent?.trim().slice(0,20) });
    }

    // 3. 패딩/마진 실제 값
    const ss = window.getComputedStyle(scrollArea);
    res.scrollAreaPadding = { left: ss.paddingLeft, right: ss.paddingRight, top: ss.paddingTop, bottom: ss.paddingBottom, gap: ss.gap };
  }

  // 4. backdrop-filter 확인
  const dashStyle = window.getComputedStyle(dash);
  res.dashBackdrop = dashStyle.backdropFilter || dashStyle.webkitBackdropFilter || 'NONE';
  res.dashBackground = dashStyle.backgroundColor;
  res.dashBorderRight = dashStyle.borderRight;

  return res;
});

console.log('=== DASHBOARD ANALYSIS ===');
console.log('Backdrop filter:', analysis.dashBackdrop);
console.log('Background:', analysis.dashBackground);
console.log('Border right:', analysis.dashBorderRight);
console.log('Scroll area padding:', JSON.stringify(analysis.scrollAreaPadding));
console.log('\nSmall font (< 13px):', analysis.smallFont?.length || 0);
analysis.smallFont?.slice(0, 10).forEach(el => console.log('  ' + el.fs + 'px "' + el.text + '"'));
console.log('\nTight spacing (< 12px gap):', analysis.tightSpacing?.length || 0);
analysis.tightSpacing?.forEach(s => console.log('  ' + s.gap + 'px between "' + s.el1 + '" and "' + s.el2 + '"'));

await browser.close();
