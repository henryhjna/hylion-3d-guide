import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0a0c14',
    primaryColor: '#1e1040',
    primaryTextColor: '#e0ddd5',
    primaryBorderColor: '#c084fc',
    lineColor: '#6e8efb',
    secondaryColor: '#0d2a28',
    tertiaryColor: '#2a1f10',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '12px',
  },
});

let idCounter = 0;

export default function MermaidBlock({ code }) {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;
    const id = `mermaid-${++idCounter}`;
    mermaid.render(id, code)
      .then(({ svg: rendered }) => { setSvg(rendered); setError(null); })
      .catch(() => setError(true));
  }, [code]);

  if (error) {
    return (
      <pre className="text-xs text-[#9aa0b8] bg-[#ffffff05] p-3 rounded overflow-x-auto">
        {code}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-4 overflow-x-auto bg-[#0a0c14] rounded-lg p-4 border border-[#ffffff08]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
