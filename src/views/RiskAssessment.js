import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { getAdminPassword } from '../utils/auth';
import { FaInfoCircle } from 'react-icons/fa';
import Header from '../components/Header';
import './RiskAssessment.css';
import { mockRecords, assets, riskMatrix } from '../data/Matrix';

const VULNERABILITY_SUGGESTIONS = [
  'NO FIREWALL',
  'NO BACKUP',
  'Unpatched Software Versions',
  'NO MONITORING DASHBOARD',
  'SLOW ACCESS TO BFRIS DUE TO PAGE BOTTLENECKS',
];

const SEVERITY_OPTIONS = ['Acceptable', 'Tolerable', 'Undesirable', 'Intolerable'];
const LIKELIHOOD_OPTIONS = ['Improbable', 'Possible', 'Probable'];

function getRiskLevel(severity, likelihood) {
  if (!riskMatrix[likelihood] || !riskMatrix[likelihood][severity]) {
    return 'UNKNOWN';
  }
  return riskMatrix[likelihood][severity];
}

import { createPortal } from 'react-dom';

export default function RiskAssessment() {
  const fallbackMock = [
    { id: 'r1', asset: (Array.isArray(assets) && assets[0]) || 'Server and Host', vulnerability: 'NO FIREWALL', severity: 'Intolerable', likelihood: 'Probable', riskLevel: 'EXTREME' },
    { id: 'r2', asset: (Array.isArray(assets) && assets[1]) || 'Database', vulnerability: 'NO BACKUP', severity: 'Undesirable', likelihood: 'Possible', riskLevel: 'HIGH' },
  ];

  const [records, setRecords] = useState(Array.isArray(mockRecords) && mockRecords.length ? mockRecords : fallbackMock);
  const defaultAsset = (Array.isArray(assets) && assets.includes('Server and Host')) ? 'Server and Host' : ((Array.isArray(assets) && assets.length) ? assets[0] : '');
  const [asset, setAsset] = useState(defaultAsset);
  const [vuln, setVuln] = useState('');
  const [impact, setImpact] = useState('');
  const [threats, setThreats] = useState('');
  const [severity, setSeverity] = useState('Undesirable');
  const [likelihood, setLikelihood] = useState('Possible');
  const [showVulnInfo, setShowVulnInfo] = useState(false);
  const vulnAnchorRef = useRef(null);
  const [vulnAnchorRect, setVulnAnchorRect] = useState(null);
  const [showImpactInfo, setShowImpactInfo] = useState(false);
  const impactAnchorRef = useRef(null);
  const [impactAnchorRect, setImpactAnchorRect] = useState(null);
  const [showThreatsInfo, setShowThreatsInfo] = useState(false);
  const threatsAnchorRef = useRef(null);
  const [threatsAnchorRect, setThreatsAnchorRect] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef(null);

  // Update anchor rect when any tooltip opens or on resize/scroll
  useEffect(() => {
    function updateRect() {
      if (vulnAnchorRef.current) setVulnAnchorRect(vulnAnchorRef.current.getBoundingClientRect());
      if (impactAnchorRef.current) setImpactAnchorRect(impactAnchorRef.current.getBoundingClientRect());
      if (threatsAnchorRef.current) setThreatsAnchorRect(threatsAnchorRef.current.getBoundingClientRect());
    }
    if (showVulnInfo || showImpactInfo || showThreatsInfo) updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [showVulnInfo, showImpactInfo, showThreatsInfo]);

  // Portal tooltip component
  function TooltipPortal({ anchorRect, anchorRef, onClose, children }) {
    const elRef = useRef(null);
    const contentRef = useRef(null);
    const [style, setStyle] = useState({ visibility: 'hidden' });

    if (!elRef.current) elRef.current = document.createElement('div');

    useEffect(() => {
      const el = elRef.current;
      el.className = 'vuln-tooltip-portal-root';
      document.body.appendChild(el);
      return () => {
        try { document.body.removeChild(el); } catch (e) {}
      };
    }, []);

    // compute placement after the tooltip content mounts so we can measure its height
    useLayoutEffect(() => {
      if (!anchorRect || !contentRef.current) return;
      const padding = 8;
      const maxWidth = Math.min(640, window.innerWidth - 32);
      const tooltipRect = contentRef.current.getBoundingClientRect();
      const spaceAbove = anchorRect.top;
      const spaceBelow = window.innerHeight - anchorRect.bottom;
      let top;
      let placement = 'below';
      if (spaceBelow < tooltipRect.height + 16 && spaceAbove > spaceBelow) {
        // place above
        top = window.scrollY + anchorRect.top - padding - tooltipRect.height;
        placement = 'above';
      } else {
        // place below
        top = window.scrollY + anchorRect.bottom + padding;
        placement = 'below';
      }
      let left = window.scrollX + Math.max(8, anchorRect.left);
      if (left + maxWidth + 24 > window.scrollX + window.innerWidth) left = window.scrollX + window.innerWidth - maxWidth - 16;
      setStyle({ position: 'absolute', top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, maxWidth: `${maxWidth}px`, zIndex: 9999, visibility: 'visible' });
    }, [anchorRect, children]);

    // outside click / Esc to close
    useEffect(() => {
      function onKey(e) { if (e.key === 'Escape') onClose(); }
      function onDown(e) {
        const el = elRef.current;
        if (!el) return;
        if (!el.contains(e.target) && !(anchorRef && anchorRef.current && anchorRef.current.contains(e.target))) {
          onClose();
        }
      }
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onDown);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onDown);
      };
    }, [onClose]);

    const content = (
      <div style={style} className="vuln-tooltip" role="status" aria-live="polite" ref={contentRef}>
        {children}
      </div>
    );
    return createPortal(content, elRef.current);
  }

  function showToast(msg, duration = 3500) {
    setToast(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    toastTimerRef.current = setTimeout(() => {
      setToast('');
      toastTimerRef.current = null;
    }, duration);
  }

  function clearToast() {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast('');
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && toast) clearToast();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toast]);

  const handleAddRisk = (e) => {
    e.preventDefault();
    if (!vuln || !vuln.trim()) {
      showToast('Please describe the vulnerability in plain language (a short sentence).');
      return;
    }
    if (!impact || !impact.trim()) {
      showToast('Please describe the impact in plain language.');
      return;
    }
    if (!threats || !threats.trim()) {
      showToast('Please describe the threats in plain language.');
      return;
    }
    const level = getRiskLevel(severity, likelihood);
    const newRecord = {
      id: `r${Date.now()}`,
      asset,
      vulnerability: vuln.trim() || '—',
      impact: impact.trim() || '—',
      threats: threats.trim() || '—',
      severity,
      likelihood,
      riskLevel: level,
    };
    setRecords(prev => [newRecord, ...prev]);
    setVuln('');
    setImpact('');
    setThreats('');
  };

  const handleDelete = (id) => {
    // open password confirmation modal instead of immediate delete
    setDeleteTargetId(id);
    setDeletePassword('');
    setDeleteModalOpen(true);
  };

  // delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeleteTargetId('');
    setDeletePassword('');
  }

  function handleConfirmDelete() {
    if (deletePassword !== getAdminPassword()) {
      showToast('Incorrect password. Please try again.');
      return;
    }
    setRecords(prev => prev.filter(r => r.id !== deleteTargetId));
    showToast('Risk deleted successfully!');
    closeDeleteModal();
  }

  const riskCounts = records.reduce((acc, record) => {
    const level = record.riskLevel || getRiskLevel(
      record.severity || 'Undesirable',
      record.likelihood || 'Possible'
    );
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  return (
    <div className="firewall-monitor-root dashboard-root">
      <Header active="risk" />

      <div className="hero-row">
        <div className="page-hero">
          <div className="hero-text">
            <h2>Risk Assessment</h2>
            <p>Create and view risk items using the severity/likelihood matrix.</p>
          </div>
          <div className="external-refresh">
            {/* keep space for actions if needed */}
          </div>
        </div>
      </div>

      <section className="monitor-stats">
        <div className="stat-card stat-extreme">
          <div>
            <p className="label">Extreme</p>
            <p className="value" style={{ color: '#d62828' }}>{riskCounts['EXTREME'] || 0}</p>
          </div>
          <div className="stat-icon">
            <div className="icon-bg" style={{ color: '#d62828' }}>
              <svg viewBox="0 0 24 24" className="stat-svg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card stat-high">
          <div>
            <p className="label">High</p>
            <p className="value" style={{ color: '#ff9800' }}>{riskCounts['HIGH'] || 0}</p>
          </div>
          <div className="stat-icon">
            <div className="icon-bg" style={{ color: '#ff9800' }}>
              <svg viewBox="0 0 24 24" className="stat-svg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card stat-medium">
          <div>
            <p className="label">Medium</p>
            <p className="value" style={{ color: '#1976d2' }}>{riskCounts['MEDIUM'] || 0}</p>
          </div>
          <div className="stat-icon">
            <div className="icon-bg" style={{ color: '#1976d2' }}>
              <svg viewBox="0 0 24 24" className="stat-svg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card stat-low">
          <div>
            <p className="label">Low</p>
            <p className="value" style={{ color: '#0b8f36' }}>{riskCounts['LOW'] || 0}</p>
          </div>
          <div className="stat-icon">
            <div className="icon-bg" style={{ color: '#0b8f36' }}>
              <svg viewBox="0 0 24 24" className="stat-svg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.5l-4.5-4.5 1.41-1.41L11 13.67l5.09-5.09L17.5 10l-6.5 6.5z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="two-column-cards">
        <div className="chart-card chart-left">
          <div className="card-header">
            <h3>Create Risk</h3>
          </div>
          <div className="card-body">
            <form className="form-grid" onSubmit={handleAddRisk} autoComplete="off" style={{ width: '100%' }}>
              <div className="form-left">
                <div className="row">
                  <label>Asset</label>
                  <div className="select-wrapper">
                    <select value={asset} onChange={(e) => setAsset(e.target.value)}>
                      {Array.isArray(assets) && assets.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="row" style={{ position: 'relative' }}>
                  <label>Vulnerability <span ref={vulnAnchorRef} className="info-icon" onClick={() => setShowVulnInfo(!showVulnInfo)} role="button" tabIndex={0} aria-label="Vulnerability help"><FaInfoCircle /></span></label>
                  <input type="text" value={vuln} onChange={(e) => setVuln(e.target.value)} placeholder="Describe vulnerability" />

                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ display: 'block', marginBottom: 6 }}>Impact <span ref={impactAnchorRef} className="info-icon" onClick={() => setShowImpactInfo(!showImpactInfo)} role="button" tabIndex={0} aria-label="Impact help"><FaInfoCircle /></span></label>
                      <input type="text" value={impact} onChange={(e) => setImpact(e.target.value)} placeholder="Describe impact" />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>Threats <span ref={threatsAnchorRef} className="info-icon" onClick={() => setShowThreatsInfo(!showThreatsInfo)} role="button" tabIndex={0} aria-label="Threats help"><FaInfoCircle /></span></label>
                      <input type="text" value={threats} onChange={(e) => setThreats(e.target.value)} placeholder="Describe threats" />
                    </div>
                  </div>

                  {showVulnInfo && vulnAnchorRect && (
                    <TooltipPortal anchorRect={vulnAnchorRect} anchorRef={vulnAnchorRef} onClose={() => setShowVulnInfo(false)}>
                      <p style={{ margin: 0 }}>Tell us in plain language what the problem is and how it affects people. Example phrases you can use: <strong>"No firewall on server"</strong>, <strong>"Backups not taken"</strong>, <strong>"Slow page causing delays"</strong>, or <strong>"Outdated software"</strong>. A short sentence is enough.</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" className="btn small" onClick={() => setShowVulnInfo(false)}>Got it</button>
                      </div>
                    </TooltipPortal>
                  )}

                  {showImpactInfo && impactAnchorRect && (
                    <TooltipPortal anchorRect={impactAnchorRect} anchorRef={impactAnchorRef} onClose={() => setShowImpactInfo(false)}>
                      <p style={{ margin: 0 }}>Impact: describe the effect on systems, data, or people. Example: <strong>"System and data breach"</strong> or <strong>"Slow response to outages"</strong>.</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" className="btn small" onClick={() => setShowImpactInfo(false)}>Got it</button>
                      </div>
                    </TooltipPortal>
                  )}

                  {showThreatsInfo && threatsAnchorRect && (
                    <TooltipPortal anchorRect={threatsAnchorRect} anchorRef={threatsAnchorRef} onClose={() => setShowThreatsInfo(false)}>
                      <p style={{ margin: 0 }}>Threats: list likely threat actors or causes (e.g. <strong>"External threats, Hackers"</strong>, <strong>"Employee maintenance lapses"</strong>).</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" className="btn small" onClick={() => setShowThreatsInfo(false)}>Got it</button>
                      </div>
                    </TooltipPortal>
                  )}
                </div>

                <div className="row two-cols">
                  <div>
                    <label>Severity</label>
                    <div className="select-wrapper">
                      <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        {SEVERITY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label>Likelihood</label>
                    <div className="select-wrapper">
                      <select value={likelihood} onChange={(e) => setLikelihood(e.target.value)}>
                        {LIKELIHOOD_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="form-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="external-refresh refresh-btn" type="submit" style={{ background: 'linear-gradient(90deg,#ff9800,#ff6b00)', border: '2px solid #ff9800', color: '#fff', padding: '10px 18px', borderRadius: 18, fontWeight: 800 }}>Add Risk</button>
                </div>
              </aside>
            </form>
          </div>
        </div>

        <div className="chart-card chart-right">
          <div className="card-header">
            <h3>Existing Risks</h3>
          </div>
          <div className="card-body">
            <div className="monitor-table" style={{ width: '100%' }}>
              <div className="card-header">
                <p className="muted">All recorded risks</p>
              </div>
              <div style={{ padding: 0 }}>
                <div className="table-wrapper">
                  <table className="risk-table">
                    <thead>
                        <tr>
                          <th>Asset</th>
                          <th>Vulnerability</th>
                          <th>Impact</th>
                          <th>Threats</th>
                          <th>Severity</th>
                          <th>Likelihood</th>
                          <th>Risk Level</th>
                          <th className="actions-col" aria-label="Actions">⋯</th>
                        </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="no-records">No risk records yet</td>
                        </tr>
                        ) : records.map(r => (
                            <tr key={r.id}>
                              <td>{r.asset}</td>
                              <td>{r.vulnerability}</td>
                              <td>{r.impact}</td>
                              <td>{r.threats}</td>
                              <td>{r.severity}</td>
                              <td>{r.likelihood}</td>
                              <td><span className={`risk-badge risk-${(r.riskLevel||'UNKNOWN').toLowerCase()}`}>{r.riskLevel}</span></td>
                              <td>
                                <button className="delete-icon-btn" onClick={() => handleDelete(r.id)} title="Delete risk">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z" fill="currentColor"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {toast && (
        <div className={`toast-notification error`} role="status" aria-live="polite">
          <div className="toast-icon">!</div>
          <div className="toast-message">{toast}</div>
        </div>
      )}
      <DeleteConfirmModal open={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleConfirmDelete} risk={records.find(r => r.id === deleteTargetId)} password={deletePassword} setPassword={setDeletePassword} />
    </div>
  );
}

function StatCard({ label, count, color }) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value" style={{ color }}>{count}</p>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, onClose, onConfirm, risk, password, setPassword }) {
  if (!open) return null;
  const name = risk ? `${risk.vulnerability}` : '';
  return (
    <div className="modal modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>Delete Risk</h3>
        <div className="warning-row">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="url(#warnGradient)"/>
            <path d="M16 10v8M16 22v1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="warnGradient" x1="2" y1="2" x2="30" y2="30">
                <stop offset="0%" stopColor="#ff9800"/>
                <stop offset="100%" stopColor="#ff6b00"/>
              </linearGradient>
            </defs>
          </svg>
          <p>Are you sure you want to delete <strong style={{ color: '#e53935' }}>{name}</strong>? This action cannot be undone.</p>
        </div>
        <div className="form-row">
          <label>Enter password to confirm:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
          />
        </div>
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}