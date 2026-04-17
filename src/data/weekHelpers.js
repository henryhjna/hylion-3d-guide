// HYlion — 6주 카운트다운 week helper
// weekKey: 'W-6' | 'W-5' | 'W-4' | 'W-3' | 'W-2' | 'W-1' | 'final'

import { TIMELINE } from './timeline';

export const WEEK_KEYS = ['W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'final'];

export const WEEK_INDEX = {
  'W-6': -6, 'W-5': -5, 'W-4': -4, 'W-3': -3, 'W-2': -2, 'W-1': -1, 'final': 0,
};

export const WEEK_LABELS = {
  'W-6': 'W-6', 'W-5': 'W-5', 'W-4': 'W-4', 'W-3': 'W-3', 'W-2': 'W-2', 'W-1': 'W-1', 'final': '발표주',
};

// 발표주 시작일(2026-06-01) 기준 역산. 오늘 → weekKey.
export function getCurrentWeekKey(now = new Date()) {
  const finalStart = new Date('2026-06-01');
  const diffMs = finalStart - now;
  const diffWeeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
  if (diffWeeks <= 0) return 'final';
  if (diffWeeks >= 6) return 'W-6';
  return `W-${diffWeeks}`;
}

export function getWeekIndex(weekKey) {
  return WEEK_INDEX[weekKey] ?? -6;
}

export function getNextWeekKey(weekKey) {
  const i = WEEK_KEYS.indexOf(weekKey);
  if (i < 0 || i >= WEEK_KEYS.length - 1) return null;
  return WEEK_KEYS[i + 1];
}

export function getPrevWeekKey(weekKey) {
  const i = WEEK_KEYS.indexOf(weekKey);
  if (i <= 0) return null;
  return WEEK_KEYS[i - 1];
}

export function getWeekData(weekKey) {
  return TIMELINE.find(t => t.weekKey === weekKey);
}

// W-6=0, W-1=5, final=6 → 0..6 percent (총 7 단계)
export function getWeekProgress(weekKey) {
  const i = WEEK_KEYS.indexOf(weekKey);
  if (i < 0) return 0;
  return Math.round((i / (WEEK_KEYS.length - 1)) * 100);
}
