import { useState, useEffect, useRef } from 'react';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function exportBackup() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('hylion_')) {
      data[key] = localStorage.getItem(key);
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hylion-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  localStorage.setItem('hylion_last_backup', new Date().toISOString());
}

function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith('hylion_')) {
            localStorage.setItem(key, value);
          }
        }
        localStorage.setItem('hylion_last_backup', new Date().toISOString());
        resolve();
        window.location.reload();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function checkDataReset() {
  const backupTimestamp = localStorage.getItem('hylion_last_backup');
  if (!backupTimestamp) return false;
  // If a backup existed before but hylion_ data keys are now empty
  let hasEmptyData = false;
  let hasAnyKey = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('hylion_') && key !== 'hylion_last_backup') {
      hasAnyKey = true;
      const val = localStorage.getItem(key);
      if (!val || val === '' || val === '{}' || val === '[]') {
        hasEmptyData = true;
      }
    }
  }
  return hasAnyKey && hasEmptyData;
}

export default function DataBackup({ memberId }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'needBackup' | 'dataReset' | 'done'
  const [showDone, setShowDone] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (checkDataReset()) {
      setStatus('dataReset');
      return;
    }

    const lastBackup = localStorage.getItem('hylion_last_backup');
    if (!lastBackup || Date.now() - new Date(lastBackup).getTime() > THREE_DAYS_MS) {
      setStatus('needBackup');
    }
  }, [memberId]);

  const handleBackup = () => {
    exportBackup();
    setShowDone(true);
    setStatus('idle');
    setTimeout(() => setShowDone(false), 2000);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importBackup(file);
  };

  if (showDone) {
    return (
      <div style={styles.banner(styles.greenBorder)}>
        <span style={styles.text}>&#10003; &#48177;&#50629; &#50756;&#47308;</span>
      </div>
    );
  }

  if (status === 'dataReset') {
    return (
      <div style={styles.banner(styles.orangeBorder)}>
        <span style={styles.text}>&#9888;&#65039; &#45936;&#51060;&#53552;&#44032; &#52488;&#44592;&#54868;&#46108; &#44163; &#44057;&#49845;&#45768;&#45796;</span>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <button style={styles.button(styles.orangeBtn)} onClick={() => fileRef.current?.click()}>
          &#48177;&#50629; &#44032;&#51256;&#50724;&#44592;
        </button>
      </div>
    );
  }

  if (status === 'needBackup') {
    return (
      <div style={styles.banner(styles.yellowBorder)}>
        <span style={styles.text}>&#128230; &#45936;&#51060;&#53552; &#48177;&#50629;&#51012; &#44428;&#51109;&#54633;&#45768;&#45796;</span>
        <button style={styles.button(styles.yellowBtn)} onClick={handleBackup}>
          &#51648;&#44552; &#48177;&#50629;
        </button>
      </div>
    );
  }

  return null;
}

const styles = {
  yellowBorder: { borderColor: '#f5c842' },
  orangeBorder: { borderColor: '#ff8c00' },
  greenBorder: { borderColor: '#00ff88' },
  yellowBtn: { background: 'rgba(245, 200, 66, 0.15)', color: '#f5c842', borderColor: '#f5c842' },
  orangeBtn: { background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00', borderColor: '#ff8c00' },
  banner: (borderStyle) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px 16px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: `1px solid ${borderStyle.borderColor}`,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
  }),
  text: {
    fontSize: '13px',
    color: '#e0e0e0',
    fontFamily: 'Orbitron, sans-serif',
    whiteSpace: 'nowrap',
  },
  button: (variant) => ({
    padding: '6px 14px',
    fontSize: '12px',
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 600,
    border: `1px solid ${variant.borderColor}`,
    borderRadius: '6px',
    background: variant.background,
    color: variant.color,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s',
  }),
};
