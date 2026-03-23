#!/usr/bin/env node
/**
 * HYlion 3D Guide — Data completeness validation
 * Run: node scripts/validateData.js
 */

import { TECH_TREE } from '../src/data/techTree.js';
import { MEMBERS } from '../src/data/members.js';
import { PARTS } from '../src/data/parts.js';

let COMPONENTS, GLOSSARY, TASK_HINTS, HANDOFFS, RESOURCES;
try { COMPONENTS = (await import('../src/data/components.js')).COMPONENTS; } catch { COMPONENTS = null; }
try { GLOSSARY = (await import('../src/data/glossary.js')).GLOSSARY; } catch { GLOSSARY = null; }
try { TASK_HINTS = (await import('../src/data/taskHints.js')).TASK_HINTS; } catch { TASK_HINTS = null; }
try { HANDOFFS = (await import('../src/data/handoffs.js')).HANDOFFS; } catch { HANDOFFS = null; }
try { RESOURCES = (await import('../src/data/resources.js')).RESOURCES; } catch { RESOURCES = null; }

const errors = [];
const warnings = [];

function check(condition, msg, isWarning = false) {
  if (!condition) (isWarning ? warnings : errors).push(msg);
}

// ── TechTree ──
console.log('\n=== TechTree ===');
const nodeIds = new Set(TECH_TREE.nodes.map(n => n.id));
check(TECH_TREE.nodes.length >= 60, `노드 수: ${TECH_TREE.nodes.length} (최소 60)`);
TECH_TREE.nodes.forEach(n => {
  n.dependencies.forEach(d => {
    check(nodeIds.has(d), `노드 "${n.id}" → 존재하지 않는 의존성 "${d}"`);
  });
});
const gates = TECH_TREE.nodes.filter(n => n.isGate);
check(gates.length >= 4, `게이트 수: ${gates.length} (최소 4)`);
console.log(`  노드: ${TECH_TREE.nodes.length}, 게이트: ${gates.length}`);

// ── Members ──
console.log('\n=== Members ===');
const memberIds = ['delta1', 'delta2', 'delta3', 'epsilon1', 'epsilon2'];
memberIds.forEach(id => {
  check(MEMBERS[id], `멤버 "${id}" 없음`);
  if (MEMBERS[id]) {
    for (let w = 0; w <= 10; w++) {
      check(MEMBERS[id].weeklyTasks?.[w], `${id} Week ${w} 데이터 없음`, true);
    }
  }
});

// ── Components ──
if (COMPONENTS) {
  console.log('\n=== Components ===');
  const compCount = Object.keys(COMPONENTS).length;
  check(compCount >= 15, `부품 수: ${compCount} (최소 15)`);
  Object.entries(COMPONENTS).forEach(([id, c]) => {
    check(c.name, `부품 "${id}" name 없음`);
    check(c.usage?.parts?.length > 0, `부품 "${id}" parts 매핑 없음`, true);
    check(c.links?.length > 0, `부품 "${id}" 외부 링크 없음`, true);
  });
  console.log(`  부품: ${compCount}개`);
} else {
  errors.push('components.js 로드 실패');
}

// ── TaskHints ──
if (TASK_HINTS) {
  console.log('\n=== TaskHints ===');
  const hintCount = Object.keys(TASK_HINTS).length;
  let missing = 0;
  TECH_TREE.nodes.forEach(n => {
    if (!TASK_HINTS[n.id]) { missing++; warnings.push(`힌트 누락: "${n.id}" (${n.label})`); }
  });
  check(missing === 0, `${missing}개 노드에 힌트 누락`);
  Object.entries(TASK_HINTS).forEach(([id, h]) => {
    check(h.summary, `힌트 "${id}" summary 없음`);
  });
  console.log(`  힌트: ${hintCount}개, 누락: ${missing}개`);
} else {
  errors.push('taskHints.js 로드 실패');
}

// ── Glossary ──
if (GLOSSARY) {
  console.log('\n=== Glossary ===');
  const termCount = Object.keys(GLOSSARY).length;
  check(termCount >= 30, `용어 수: ${termCount} (최소 30)`);
  Object.entries(GLOSSARY).forEach(([term, data]) => {
    check(data.definition, `용어 "${term}" definition 없음`);
  });
  console.log(`  용어: ${termCount}개`);
} else {
  errors.push('glossary.js 로드 실패');
}

// ── Handoffs ──
if (HANDOFFS) {
  console.log('\n=== Handoffs ===');
  const handoffCount = Object.keys(HANDOFFS).length;
  check(handoffCount >= 10, `인수인계 수: ${handoffCount} (최소 10)`);
  Object.entries(HANDOFFS).forEach(([key, h]) => {
    check(h.what, `인수인계 "${key}" what 없음`);
    check(h.from, `인수인계 "${key}" from 없음`);
    check(h.to, `인수인계 "${key}" to 없음`);
  });
  console.log(`  인수인계: ${handoffCount}개`);
} else {
  errors.push('handoffs.js 로드 실패');
}

// ── Resources ──
if (RESOURCES) {
  console.log('\n=== Resources ===');
  const resCount = Object.keys(RESOURCES).length;
  check(resCount >= 20, `리소스 수: ${resCount} (최소 20)`);
  console.log(`  리소스: ${resCount}개`);
} else {
  errors.push('resources.js 로드 실패');
}

// ── Results ──
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 데이터 완전성 검증 통과');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ 오류 ${errors.length}개:`);
    errors.forEach(e => console.log(`  ❌ ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️ 경고 ${warnings.length}개:`);
    warnings.slice(0, 20).forEach(w => console.log(`  ⚠️ ${w}`));
    if (warnings.length > 20) console.log(`  ... (${warnings.length - 20}개 더)`);
  }
}

process.exit(errors.length > 0 ? 1 : 0);
