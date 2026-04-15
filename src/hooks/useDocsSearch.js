import { useState, useEffect, useCallback, useRef } from 'react';
import { COMPONENTS } from '../data/components';
import { GLOSSARY } from '../data/glossary';
import { RESOURCES } from '../data/resources';

const DOC_FILES = [
  { id: 'plan', name: '기획서 v13', path: `${import.meta.env.BASE_URL}assets/docs/기획서_v13.md` },
  { id: 'guide', name: '실행가이드 v13', path: `${import.meta.env.BASE_URL}assets/docs/실행가이드_v13.md` },
  { id: 'dgx', name: 'DGX Spark 가이드', path: `${import.meta.env.BASE_URL}assets/docs/DGX_Spark_가이드.md` },
];

const SECTION_PART_MAP = {
  '7.1': ['left_leg', 'right_leg'],
  '7.2': ['torso'],
  '7.3': ['head'],
  '7.4': ['torso'],
  '7.5': ['torso'],
  '7.6': ['head', 'torso'],
  '7.7': ['torso'],
  '7.8': ['left_arm', 'right_arm', 'left_leg', 'right_leg'],
  '7.9': ['torso'],
  '7.10': ['left_arm', 'right_arm'],
  '4': ['left_arm', 'right_arm'],
  '5': ['torso'],
  '3': ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg'],
  '6': [],
};

function parseMarkdownSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;
  let headingPath = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      if (current && current.content.trim()) sections.push(current);
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      headingPath = headingPath.slice(0, level - 1);
      headingPath.push(title);

      current = {
        title,
        heading: line,
        headingPath: [...headingPath],
        content: '',
        level,
      };
    } else if (current) {
      current.content += line + '\n';
    }
  }
  if (current && current.content.trim()) sections.push(current);
  return sections;
}

function extractSectionNumber(title) {
  const match = title.match(/^(\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
}

export function useDocsSearch() {
  const [index, setIndex] = useState([]);
  const [rawDocs, setRawDocs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const indexRef = useRef([]);

  useEffect(() => {
    async function buildIndex() {
      const entries = [];
      const docs = {};

      for (const file of DOC_FILES) {
        try {
          const content = await fetch(file.path).then(r => r.text());
          docs[file.id] = content;
          const sections = parseMarkdownSections(content);

          for (const section of sections) {
            entries.push({
              fileId: file.id,
              fileName: file.name,
              sectionTitle: section.title,
              heading: section.heading,
              headingPath: section.headingPath,
              content: section.content,
              preview: section.content.replace(/[#*|\-\[\]`]/g, '').trim().slice(0, 120),
              level: section.level,
              searchText: (section.title + ' ' + section.content).toLowerCase(),
            });
          }
        } catch (e) {
          console.warn(`Failed to load ${file.path}:`, e);
        }
      }

      // Extend with components, glossary, resources
      try {
        Object.entries(COMPONENTS).forEach(([id, c]) => {
          entries.push({
            type: 'component', icon: '📦', fileId: 'components', fileName: '부품',
            sectionTitle: `${c.name} — ${c.category}`,
            heading: '', headingPath: [],
            content: `${c.usage?.description || ''} ${JSON.stringify(c.specs || {})}`,
            preview: c.usage?.description || c.name,
            level: 1, searchText: `${c.name} ${c.category} ${c.usage?.description || ''} ${Object.values(c.specs || {}).join(' ')}`.toLowerCase(),
            componentId: id,
          });
        });
      } catch {}

      try {
        Object.entries(GLOSSARY).forEach(([term, data]) => {
          entries.push({
            type: 'glossary', icon: '📖', fileId: 'glossary', fileName: '용어',
            sectionTitle: data.full ? `${term} (${data.full})` : term,
            heading: '', headingPath: [],
            content: data.definition || '',
            preview: (data.definition || '').slice(0, 100),
            level: 1, searchText: `${term} ${data.full || ''} ${data.definition || ''} ${(data.related || []).join(' ')}`.toLowerCase(),
          });
        });
      } catch {}

      try {
        Object.entries(RESOURCES).forEach(([id, r]) => {
          entries.push({
            type: 'resource', icon: '🔗', fileId: 'resources', fileName: '리소스',
            sectionTitle: r.label,
            heading: '', headingPath: [],
            content: r.tags?.join(' ') || '',
            preview: r.url,
            level: 1, searchText: `${r.label} ${(r.tags || []).join(' ')} ${r.category || ''}`.toLowerCase(),
            url: r.url,
          });
        });
      } catch {}

      setIndex(entries);
      setRawDocs(docs);
      indexRef.current = entries;
      setIsLoading(false);
    }

    buildIndex();
  }, []);

  const search = useCallback((query) => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    return indexRef.current
      .map(entry => {
        let score = 0;
        const titleLower = entry.sectionTitle.toLowerCase();

        for (const term of terms) {
          if (titleLower.includes(term)) score += 10;
          if (titleLower.split(/\s+/).some(w => w.startsWith(term))) score += 5;
          if (entry.searchText.includes(term)) score += 1;
          const count = (entry.searchText.match(new RegExp(term, 'g')) || []).length;
          score += Math.min(count, 5);
        }

        return { ...entry, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, []);

  const getRelatedParts = useCallback((entry) => {
    const secNum = extractSectionNumber(entry.sectionTitle);
    if (secNum && SECTION_PART_MAP[secNum]) return SECTION_PART_MAP[secNum];
    const parent = extractSectionNumber(entry.headingPath[0] || '');
    if (parent && SECTION_PART_MAP[parent]) return SECTION_PART_MAP[parent];
    return [];
  }, []);

  return { index, rawDocs, search, getRelatedParts, isLoading };
}
