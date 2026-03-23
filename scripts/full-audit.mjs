import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('hylion_intro_seen', 'true');
  localStorage.setItem('hylion_member', 'delta1');
});
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 8000));

// ══════════════════════════════════════════════════════════════
// 1. WORK MODE — 대시보드
// ══════════════════════════════════════════════════════════════
console.log('═══ 1. WORK MODE (delta1) ═══');
const workAnalysis = await page.evaluate(() => {
  const issues = [];
  const dash = document.querySelector('[class*="glass-panel"]:not(nav)');
  if (!dash) return { error: 'no dashboard' };

  // A. 모든 요소의 overflow 확인
  dash.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > 420 && r.left < 420) {
      const text = el.textContent?.trim().slice(0, 30);
      if (text && el.children.length === 0) {
        issues.push({ type: 'overflow', text, right: Math.round(r.right) });
      }
    }
  });

  // B. 패딩 0px 요소 (Tailwind 안 먹는 곳)
  const zeropad = [];
  dash.querySelectorAll('div, label, button, span').forEach(el => {
    const s = window.getComputedStyle(el);
    const cls = el.className || '';
    if (cls.includes && (cls.includes('p-') || cls.includes('px-') || cls.includes('py-'))) {
      const pl = parseFloat(s.paddingLeft);
      const pt = parseFloat(s.paddingTop);
      if (pl === 0 && pt === 0) {
        zeropad.push({ class: cls.slice(0, 50), text: el.textContent?.trim().slice(0, 20) });
      }
    }
  });

  // C. cursor:pointer 남아있는 곳 (body 아닌)
  const falseCursor = [];
  dash.querySelectorAll('*').forEach(el => {
    const s = window.getComputedStyle(el);
    if (s.cursor === 'pointer' && el.tagName !== 'BUTTON' && el.tagName !== 'A' && el.tagName !== 'INPUT' && el.tagName !== 'LABEL') {
      if (!el.onclick && el.children.length === 0 && el.textContent?.trim()) {
        falseCursor.push({ tag: el.tagName, text: el.textContent.trim().slice(0, 25) });
      }
    }
  });

  return { overflows: issues.slice(0, 5), zeropadCount: zeropad.length, zeroPadSamples: zeropad.slice(0, 3), falseCursorCount: falseCursor.length, falseCursorSamples: falseCursor.slice(0, 5) };
});
console.log('Overflows beyond 420px:', workAnalysis.overflows?.length || 0);
workAnalysis.overflows?.forEach(o => console.log(`  "${o.text}" right=${o.right}px`));
console.log('Elements with Tailwind padding class but 0px computed:', workAnalysis.zeropadCount);
workAnalysis.zeroPadSamples?.forEach(z => console.log(`  "${z.text}" class="${z.class}"`));
console.log('False cursor:pointer (non-interactive):', workAnalysis.falseCursorCount);
workAnalysis.falseCursorSamples?.forEach(f => console.log(`  [${f.tag}] "${f.text}"`));

await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/audit-work.png' });

// ══════════════════════════════════════════════════════════════
// 2. EXPLORE MODE — 기본
// ══════════════════════════════════════════════════════════════
console.log('\n═══ 2. EXPLORE MODE ═══');
let btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('탐색')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/audit-explore.png' });

// Click model → sidebar
await page.mouse.click(700, 450);
await new Promise(r => setTimeout(r, 2000));

const sidebarIssues = await page.evaluate(() => {
  const panel = document.querySelector('[class*="slide-in-right"]');
  if (!panel) return { error: 'no sidebar' };
  const issues = { textOverlaps: 0, zeroGaps: 0, outsideViewport: 0 };

  // Check elements outside viewport
  panel.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && el.textContent?.trim() && el.children.length === 0) {
      if (r.right > 1440 || r.left < 1060) issues.outsideViewport++;
    }
  });

  // Check vertical gaps between siblings
  const scrollEl = panel.querySelector('[class*="overflow"]') || panel;
  const sections = Array.from(scrollEl.children);
  for (let i = 0; i < sections.length - 1; i++) {
    const r1 = sections[i].getBoundingClientRect();
    const r2 = sections[i + 1].getBoundingClientRect();
    if (r2.top - r1.bottom < 4 && r1.height > 0 && r2.height > 0) issues.zeroGaps++;
  }

  return issues;
});
console.log('Sidebar issues:', JSON.stringify(sidebarIssues));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/audit-sidebar.png' });

// ══════════════════════════════════════════════════════════════
// 3. EXPLORE + X-RAY (no sidebar)
// ══════════════════════════════════════════════════════════════
console.log('\n═══ 3. X-RAY MODE ═══');
// Close sidebar first
await page.mouse.click(400, 300);
await new Promise(r => setTimeout(r, 1000));

// Toggle xray
btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('내부')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/audit-xray.png' });

// ══════════════════════════════════════════════════════════════
// 4. EXPLORE + SCENARIO (no sidebar)
// ══════════════════════════════════════════════════════════════
console.log('\n═══ 4. SCENARIO MODE ═══');
// Toggle scenario
btns = await page.$$('button');
for (const b of btns) { const t = await page.evaluate(el => el.textContent, b); if (t.includes('시나')) { await b.click(); break; } }
await new Promise(r => setTimeout(r, 2000));

const scenarioIssues = await page.evaluate(() => {
  // Find scenario panel
  const allDivs = document.querySelectorAll('div');
  let scenarioEl = null;
  for (const d of allDivs) {
    if (d.textContent?.includes('시나리오 레벨') && d.offsetHeight > 50) { scenarioEl = d; break; }
  }
  if (!scenarioEl) return { error: 'no scenario panel' };
  const r = scenarioEl.getBoundingClientRect();
  return { found: true, rect: { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) } };
});
console.log('Scenario panel:', JSON.stringify(scenarioIssues));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/audit-scenario.png' });

// ══════════════════════════════════════════════════════════════
// 5. NAV BAR element sizes
// ══════════════════════════════════════════════════════════════
console.log('\n═══ 5. NAV BAR ═══');
const navIssues = await page.evaluate(() => {
  const nav = document.querySelector('nav');
  if (!nav) return { error: 'no nav' };
  const issues = [];
  nav.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    // Elements clipped by nav height
    if (r.bottom > 64 && r.top < 64 && el.textContent?.trim() && el.children.length === 0) {
      issues.push({ text: el.textContent.trim().slice(0, 20), bottom: Math.round(r.bottom) });
    }
    // Elements too small to click
    if ((el.tagName === 'BUTTON' || el.onclick) && (r.width < 24 || r.height < 24)) {
      issues.push({ text: el.textContent?.trim().slice(0, 15), type: 'too-small', w: Math.round(r.width), h: Math.round(r.height) });
    }
  });
  return issues;
});
console.log('Nav issues:', navIssues.length);
navIssues.forEach?.(i => console.log(`  ${i.type || 'clip'}: "${i.text}" ${i.bottom ? 'bottom=' + i.bottom : i.w + 'x' + i.h}`));

// ══════════════════════════════════════════════════════════════
// 6. SEARCH MODAL (Cmd+K)
// ══════════════════════════════════════════════════════════════
console.log('\n═══ 6. SEARCH MODAL ═══');
await page.keyboard.down('Control');
await page.keyboard.press('k');
await page.keyboard.up('Control');
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/audit-search.png' });

const searchOk = await page.evaluate(() => {
  const modal = document.querySelector('[class*="z-\\[90\\]"], [class*="z-90"]');
  const input = document.querySelector('input[type="text"]');
  return { modalFound: !!modal, inputFound: !!input, inputFocused: document.activeElement === input };
});
console.log('Search:', JSON.stringify(searchOk));

// Close search
await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 500));

// ══════════════════════════════════════════════════════════════
// 7. COPILOT BUTTON
// ══════════════════════════════════════════════════════════════
console.log('\n═══ 7. COPILOT ═══');
const copilotBtn = await page.evaluate(() => {
  const allBtns = document.querySelectorAll('button, div');
  for (const b of allBtns) {
    if (b.textContent?.includes('🤖') && b.offsetWidth > 30 && b.offsetWidth < 80) {
      const r = b.getBoundingClientRect();
      return { found: true, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    }
  }
  return { found: false };
});
console.log('Copilot button:', JSON.stringify(copilotBtn));

console.log('\n═══ AUDIT COMPLETE ═══');
await browser.close();
