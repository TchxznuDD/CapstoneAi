import React, { useEffect, useState } from 'react';

export default function AssetPreloader({ assets = [], timeout = 6000, onComplete, minVisible = 800, logo = null }) {
  const [loaded, setLoaded] = useState(false); // assets finished (or timed out)
  const [fadingOut, setFadingOut] = useState(false); // start fade-out transition
  const [finished, setFinished] = useState(false); // overlay fully hidden and can unmount
  const [progress, setProgress] = useState({ done: 0, total: assets.length });
  const startRef = React.useRef(Date.now());

  useEffect(() => {
    if (!assets || assets.length === 0) {
      setLoaded(true);
      return;
    }

    let done = 0;
    const imgs = [];
    let timer = null;

    function markLoaded() {
      done += 1;
      setProgress({ done, total: assets.length });
      if (done >= assets.length) {
        clearTimeout(timer);
        setLoaded(true);
      }
    }

    assets.forEach(src => {
      const img = new Image();
      imgs.push(img);
      img.onload = markLoaded;
      img.onerror = () => {
        // count errors as loaded to avoid blocking the UI
        console.warn('Asset failed to load:', src);
        markLoaded();
      };
      img.src = src;
    });

    // safety timeout in case some assets hang
    timer = setTimeout(() => {
      console.warn('AssetPreloader timeout — continuing');
      setLoaded(true);
    }, timeout);

    return () => {
      clearTimeout(timer);
      imgs.forEach(i => { i.onload = null; i.onerror = null; });
    };
  }, [assets, timeout]);

  // When assets finish loading (or timeout), begin the fade-out after `minVisible` ms
  React.useEffect(() => {
    if (!loaded) return;
    const elapsed = Date.now() - (startRef.current || Date.now());
    const remaining = Math.max(0, minVisible - elapsed);
    const t = setTimeout(() => {
      setFadingOut(true);
    }, remaining);
    return () => clearTimeout(t);
  }, [loaded, minVisible]);

  // unmount only after fade-out transition completes
  if (finished) return null;

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  const overlayStyle = {
    position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
    background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    opacity: fadingOut ? 0 : 1,
    transition: 'opacity 320ms ease',
    pointerEvents: fadingOut ? 'none' : 'auto'
  };
  const boxStyle = { textAlign: 'center', color: '#111' };
  const spinnerStyle = { width: 64, height: 64, display: 'inline-block', borderRadius: 8, background: 'linear-gradient(90deg,#ff7b00,#ff4b00)', animation: 'apulse 900ms infinite ease-in-out' };
  const logoStyle = { width: 64, height: 64, display: 'block', margin: '0 auto', objectFit: 'contain' };

  return (
    <div
      style={overlayStyle}
      role="status"
      aria-live="polite"
      onTransitionEnd={() => {
        if (fadingOut) {
          setFinished(true);
          if (typeof onComplete === 'function') {
            try { onComplete(); } catch (e) { console.warn('onComplete callback error', e); }
          }
        }
      }}
    >
      <div style={boxStyle}>
        <div style={{marginBottom:12}}>
          {logo ? (
            <img src={logo} alt="logo" style={logoStyle} />
          ) : (
            <div style={spinnerStyle}></div>
          )}
        </div>
        <div style={{fontSize:16, fontWeight:700}}>Loading</div>
        <div style={{marginTop:6, color:'#666'}}>{pct}%</div>
        <style>{`@keyframes apulse { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(0.88); opacity: 0.8 } 100% { transform: scale(1); opacity: 1 } }`}</style>
      </div>
    </div>
  );
}
