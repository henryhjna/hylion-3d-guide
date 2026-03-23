import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Test both views
for (const view of ['all', 'delta1']) {
  await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_intro_seen', 'true'); });
  if (view === 'delta1') {
    await page.evaluateOnNewDocument(() => { localStorage.setItem('hylion_member', 'delta1'); });
  } else {
    await page.evaluateOnNewDocument(() => { localStorage.removeItem('hylion_member'); });
  }
  await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
  await new Promise(r => setTimeout(r, 6000));

  const measurements = await page.evaluate((viewName) => {
    const dash = document.querySelector('[class*="glass-panel"]:not(nav)');
    if (!dash) return { error: 'no dashboard' };
    const scroll = dash.querySelector('[class*="overflow-y-auto"]');
    if (!scroll) return { error: 'no scroll area' };

    const res = { view: viewName, scrollPadding: {}, sections: [], allGaps: [] };

    // Scroll area padding
    const ss = window.getComputedStyle(scroll);
    res.scrollPadding = { top: ss.paddingTop, right: ss.paddingRight, bottom: ss.paddingBottom, left: ss.paddingLeft, gap: ss.gap };

    // Measure every direct child of scroll area
    const children = Array.from(scroll.children);
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const firstText = el.querySelector('h2, h3, span, div, label');

      res.sections.push({
        idx: i,
        tag: el.tagName,
        height: Math.round(rect.height),
        padding: style.padding,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        preview: (el.textContent || '').trim().slice(0, 40),
      });

      // Gap to next sibling
      if (i < children.length - 1) {
        const nextRect = children[i + 1].getBoundingClientRect();
        const gap = Math.round(nextRect.top - rect.bottom);
        res.allGaps.push({ between: `${i}-${i+1}`, gap, from: (el.textContent||'').trim().slice(0,20), to: (children[i+1].textContent||'').trim().slice(0,20) });
      }
    }

    // Measure checklist items spacing (if member view)
    const labels = scroll.querySelectorAll('label');
    if (labels.length > 1) {
      res.checklistGaps = [];
      for (let i = 0; i < Math.min(labels.length - 1, 5); i++) {
        const r1 = labels[i].getBoundingClientRect();
        const r2 = labels[i + 1].getBoundingClientRect();
        res.checklistGaps.push({
          gap: Math.round(r2.top - r1.bottom),
          item1Height: Math.round(r1.height),
          item1Padding: window.getComputedStyle(labels[i]).padding,
        });
      }
    }

    // Nav measurements
    const nav = document.querySelector('nav');
    if (nav) {
      const navStyle = window.getComputedStyle(nav);
      res.nav = { height: nav.offsetHeight, padding: navStyle.padding };
      // Nav children spacing
      const navChildren = Array.from(nav.children);
      res.navChildrenGaps = [];
      for (let i = 0; i < navChildren.length - 1; i++) {
        const r1 = navChildren[i].getBoundingClientRect();
        const r2 = navChildren[i + 1].getBoundingClientRect();
        res.navChildrenGaps.push({ gap: Math.round(r2.left - r1.right) });
      }
    }

    return res;
  }, view);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`VIEW: ${view}`);
  console.log(`${'='.repeat(60)}`);
  console.log('Scroll padding:', JSON.stringify(measurements.scrollPadding));
  console.log('Nav:', JSON.stringify(measurements.nav));
  console.log('Nav children gaps:', JSON.stringify(measurements.navChildrenGaps));

  console.log('\nSections:');
  measurements.sections?.forEach(s => {
    console.log(`  [${s.idx}] h=${s.height}px pad="${s.padding}" mt="${s.marginTop}" mb="${s.marginBottom}" "${s.preview}"`);
  });

  console.log('\nSection gaps:');
  measurements.allGaps?.forEach(g => {
    const status = g.gap > 40 ? '⚠️ TOO BIG' : g.gap < 8 ? '❌ TOO SMALL' : '✅';
    console.log(`  ${status} ${g.gap}px between "${g.from}" and "${g.to}"`);
  });

  if (measurements.checklistGaps) {
    console.log('\nChecklist item gaps:');
    measurements.checklistGaps.forEach((g, i) => {
      const status = g.gap > 24 ? '⚠️ TOO BIG' : g.gap < 4 ? '❌ TOO SMALL' : '✅';
      console.log(`  ${status} ${g.gap}px (item h=${g.item1Height}px pad="${g.item1Padding}")`);
    });
  }

  await page.screenshot({ path: `C:/Projects/hylion-3d-guide/measure-${view}.png` });
}

await browser.close();
