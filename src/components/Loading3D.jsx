const keyframesInjected = (() => {
  if (typeof document === 'undefined') return false;
  const id = 'hylion-loading3d-keyframes';
  if (document.getElementById(id)) return true;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    @keyframes holoShimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulseRing {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.15); opacity: 1; }
    }
    @keyframes dotPulse {
      0%, 80%, 100% { opacity: 0.3; }
      40% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  return true;
})();

export default function Loading3D({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Pulse ring */}
        <div style={styles.ringOuter}>
          <div style={styles.ringInner} />
        </div>

        {/* Shimmer text */}
        <div style={styles.text}>
          3D 모델 로딩 중
          <span style={styles.dots}>
            <span style={{ ...styles.dot, animationDelay: '0s' }}>.</span>
            <span style={{ ...styles.dot, animationDelay: '0.2s' }}>.</span>
            <span style={{ ...styles.dot, animationDelay: '0.4s' }}>.</span>
          </span>
        </div>

        {/* Indeterminate progress bar */}
        <div style={styles.progressTrack}>
          <div style={styles.progressBar} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 50,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  ringOuter: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: '#00f0ff',
    borderBottomColor: '#00f0ff',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 20px rgba(0, 240, 255, 0.1)',
    animation: 'pulseRing 1.8s ease-in-out infinite',
  },
  text: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '2px',
    color: 'transparent',
    backgroundImage: 'linear-gradient(90deg, #00f0ff 0%, #ffffff 50%, #00f0ff 100%)',
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    animation: 'holoShimmer 2.5s linear infinite',
  },
  dots: {
    display: 'inline-flex',
    marginLeft: '2px',
  },
  dot: {
    animation: 'dotPulse 1.2s ease-in-out infinite',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: 'transparent',
    backgroundImage: 'linear-gradient(90deg, #00f0ff 0%, #ffffff 50%, #00f0ff 100%)',
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
  },
  progressTrack: {
    width: '160px',
    height: '3px',
    borderRadius: '2px',
    background: 'rgba(0, 240, 255, 0.15)',
    overflow: 'hidden',
  },
  progressBar: {
    width: '40%',
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
    animation: 'holoShimmer 1.5s linear infinite',
    backgroundSize: '200% auto',
  },
};
