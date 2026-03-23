import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('hylion_intro_seen', 'true');
  localStorage.setItem('hylion_member', 'delta1');
});
await page.goto('http://localhost:5173/hylion-3d-guide/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(()=>{});
await new Promise(r => setTimeout(r, 6000));

await page.screenshot({ path: 'C:/Projects/hylion-3d-guide/ss-member.png' });

const memberAnalysis = await page.evaluate(() => {
  const dash = document.querySelector('[class*="glass-panel"]:not(nav)');
  if (!dash) return { error: 'no dash' };
  const scroll = dash.querySelector('[class*="overflow-y-auto"]');
  if (!scroll) return { error: 'no scroll' };

  const res = { sections: [], checklistItems: [], smallFont: [] };

  // Analyze each section in scroll area
  Array.from(scroll.children).forEach((child, i) => {
    const rect = child.getBoundingClientRect();
    const style = window.getComputedStyle(child);
    res.sections.push({
      index: i,
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      padding: style.padding,
      marginBottom: style.marginBottom,
      text: child.textContent?.trim().slice(0, 50),
      className: (child.className || '').slice(0, 60),
    });
  });

  // Find all checklist items
  dash.querySelectorAll('label').forEach(label => {
    const rect = label.getBoundingClientRect();
    const style = window.getComputedStyle(label);
    if (rect.height > 0) {
      res.checklistItems.push({
        height: Math.round(rect.height),
        padding: style.padding,
        text: label.textContent?.trim().slice(0, 40),
      });
    }
  });

  // Find ALL text elements and their sizes
  dash.querySelectorAll('*').forEach(el => {
    if (el.children.length === 0 && el.textContent?.trim()) {
      const fs = parseFloat(window.getComputedStyle(el).fontSize);
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && fs < 14) {
        res.smallFont.push({ fs, text: el.textContent.trim().slice(0, 30) });
      }
    }
  });

  return res;
});

console.log('=== MEMBER VIEW SECTIONS ===');
memberAnalysis.sections?.forEach(s => {
  console.log(`  [${s.index}] h=${s.height}px top=${s.top} pad="${s.padding}" mb="${s.marginBottom}"`);
  console.log(`       "${s.text}"`);
});

console.log('\n=== CHECKLIST ITEMS (' + (memberAnalysis.checklistItems?.length || 0) + ') ===');
memberAnalysis.checklistItems?.slice(0, 5).forEach(c => {
  console.log(`  h=${c.height}px pad="${c.padding}" "${c.text}"`);
});

console.log('\n=== TEXT < 14px (' + (memberAnalysis.smallFont?.length || 0) + ') ===');
memberAnalysis.smallFont?.slice(0, 10).forEach(f => {
  console.log(`  ${f.fs}px "${f.text}"`);
});

await browser.close();
