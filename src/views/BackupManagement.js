import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './BackupManagement.css';
import { ReactComponent as DatabaseIcon } from '../assets/Database.svg';
import { ReactComponent as BakaupIcon } from '../assets/Bakaup.svg';
import BakaupOrange from '../assets/BakaupOrange.svg';
import BakaupGlyph from '../assets/BakaupGlyph.svg';
import { ReactComponent as CheckIcon } from '../assets/CheckNew.svg';

export default function BackupManagement() {
  const stats = {
    storageUsed: '12.4 GB',
    totalBackups: 5,
    successRate: '80%'
  };

  const [historyList, setHistoryList] = useState([
    { id:1, date:'2025-11-05', type:'automatic', size:'2.4 GB' },
    { id:2, date:'2025-11-04', type:'automatic', size:'2.3 GB' },
    { id:3, date:'2025-11-03', type:'automatic', size:'2.3 GB' },
    { id:4, date:'2025-11-02', type:'manual', size:'2.2 GB' },
  ]);
  const [deleting, setDeleting] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  function showNotification(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

  function handleRestore() {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      showNotification('Backup restored successfully!', 'success');
    }, 2000);
  }

  function handleStartBackup() {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          showNotification('Backup Successfully Completed!', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }

  function groupByYearMonth(items) {
    const map = {};
    items.forEach(it => {
      const d = new Date(it.date);
      const year = d.getFullYear();
      const month = d.toLocaleString(undefined, { month: 'long' });
      const day = d.getDate();
      map[year] = map[year] || {};
      map[year][month] = map[year][month] || {};
      map[year][month][day] = map[year][month][day] || [];
      map[year][month][day].push(it);
    });
    return map;
  }

  const historyRef = useRef(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Automatic backup settings state
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [frequency, setFrequency] = useState('Daily');
  const [backupTime, setBackupTime] = useState('17:00');

  function handleSaveSettings() {
    showNotification('Backup settings saved successfully!', 'success');
  }

  function handleViewBackups() {
    // scroll to history section smoothly
    if (historyRef.current) {
      historyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function toggleHistory() {
    setShowAllHistory(v => !v);
    // if opening, also scroll so user sees the items
    if (!showAllHistory && historyRef.current) {
      setTimeout(() => historyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }

  return (
    <div className="dashboard-root backup-root">
      <Header active="backup" />

      <div className="hero-row">
        <div className="page-hero header-text">
          <div className="hero-text">
            <h2>Backup Management</h2>
            <p>Configure automatic backups and manage your data protection settings</p>
          </div>
        </div>
      </div>

      <main className="backup-grid">
        <section className="metrics-cards">
          <div className="metric-card storage">
            <p className="label">Storage Used</p>
            <p className="value">{stats.storageUsed}</p>
            <div className="note">▲ 24.8%</div>
            <div className="stat-icon"><div className="icon-bg storage"><DatabaseIcon className="stat-svg" aria-hidden="true" /></div></div>
          </div>

          <div className="metric-card total">
            <p className="label">Total Backups</p>
            <p className="value">{stats.totalBackups}</p>
            <div className="note green">▲ Active</div>
            <div className="stat-icon"><div className="icon-bg"><BakaupIcon className="stat-svg" aria-hidden="true" /></div></div>
          </div>

          <div className="metric-card">
            <p className="label">Success Rate</p>
            <p className="value">{stats.successRate}</p>
            <div className="note">▲ Excellent</div>
            <div className="stat-icon"><div className="icon-bg green"><CheckIcon className="stat-svg" aria-hidden="true" /></div></div>
          </div>
        </section>

        <section className="left-panel">
          <div className="card manual-backup">
            <div className="manual-top">
              <div className="manual-thumb"><img src={BakaupGlyph} alt="backup"/></div>
              <div className="manual-info">
                <div className="manual-head">
                  <h3>Manual Backup</h3>
                  <p className="muted">Create an immediate backup of your data</p>
                  <div className="muted small">Last manual backup: 2025-11-02 · 2.2 GB</div>
                </div>
              </div>
            </div>
            <div className="manual-inline">
              <div className="mini-progress" aria-hidden>
                <div className="mini-fill" style={{width: `${backupProgress}%`}}></div>
              </div>
              <div className="mini-label muted small">{backupProgress}%</div>
            </div>

            <div className="manual-actions">
              <div className="backup-progress">
                <div className="progress-bar" aria-hidden>
                  <div className="progress" style={{width: `${backupProgress}%`}}></div>
                </div>
                <div className="muted small">{isBackingUp ? 'Backup in progress...' : 'No recent successful backups'}</div>
              </div>
              <div className="actions">
                <button className="btn primary" onClick={handleStartBackup} disabled={isBackingUp}>
                  {isBackingUp ? 'Backing up...' : 'Start Backup'}
                </button>
                <button className="btn secondary" onClick={handleViewBackups}>View Backups</button>
              </div>
            </div>
          </div>

          <div className="card auto-settings stacked-format">
            <div className="auto-top">
              <div className="auto-thumb"><img src={BakaupGlyph} alt="automatic backup"/></div>
              <div className="auto-head">
                <h3>Automatic Backup Settings</h3>
                <p className="muted">Configure scheduled automatic backups</p>
              </div>
            </div>

            <div className="auto-inline">
              <div className="auto-inline-label muted">Automatic Backup</div>
              <label className="toggle-switch">
                <input type="checkbox" checked={autoEnabled} onChange={e => setAutoEnabled(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="form-row stack">
              <label>Backup Frequency</label>
              <div className="control">
                <FrequencyDropdown value={frequency} onChange={setFrequency} disabled={!autoEnabled} />
              </div>
            </div>

            <div className="form-row stack">
              <label>Backup Time</label>
              <div className="control">
                <input type="time" value={backupTime} onChange={e => setBackupTime(e.target.value)} disabled={!autoEnabled} />
              </div>
            </div>

            <div className="save-row">
              <button className="btn primary" onClick={handleSaveSettings} disabled={!autoEnabled} aria-disabled={!autoEnabled}>Save Settings</button>
            </div>
          </div>
          <div className="card history">
            <h3>Backup History</h3>
            <div className="history-list">
              {(() => {
                const grouped = groupByYearMonth(historyList);
                return Object.keys(grouped).sort((a,b) => b - a).map(year => (
                  <div key={year} style={{marginBottom:6}}>
                    <div style={{fontWeight:700, marginBottom:8}}>{year}</div>
                    {Object.keys(grouped[year]).map(month => (
                      <div key={month} style={{marginBottom:8}}>
                        <div style={{fontWeight:600, color:'#444'}}>{month}</div>
                        <div style={{display:'grid', gap:8, marginTop:8}}>
                          {Object.keys(grouped[year][month]).sort((a,b)=>b-a).map(day => {
                            const itemsForDay = grouped[year][month][day];
                            const rep = itemsForDay.find(i => i.type === 'automatic') || itemsForDay[0];
                            const repDate = new Date(rep.date);
                            const repTime = rep.type === 'automatic' ? new Date(repDate).setHours(17,0,0,0) : repDate;
                            const displayTime = new Date(repTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                              <div key={day} className="history-item" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                <div style={{flex:1, display:'flex', flexDirection:'column', gap:8}}>
                                  <div style={{display:'flex', gap:12, alignItems:'center'}}>
                                    <div className={`status-dot ${itemsForDay[0].type}`}></div>
                                    <div>
                                      <div className="hi-date">{month} {day}</div>
                                      <div className="muted small">{itemsForDay.length} backup(s)</div>
                                      <div className="muted small hi-time">{displayTime}</div>
                                    </div>
                                  </div>

                                  <div className="day-list">
                                    {itemsForDay.map(it => {
                                      const d = new Date(it.date);
                                      const timeVal = it.type === 'automatic' ? new Date(d).setHours(17,0,0,0) : d;
                                      const timeStr = new Date(timeVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                      return (
                                        <div key={it.id} className="day-entry">
                                          <div className="entry-time muted small">{timeStr}</div>
                                          <div className={`type-pill ${it.type}`}>{it.type}</div>
                                          <div className="muted small">{it.size}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div style={{width:160, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6}}>
                                  <div className="muted small">{itemsForDay.map(it => it.size).join(', ')}</div>
                                  <div style={{marginTop:'auto'}}>
                                    <div className="hi-actions" style={{display:'flex', gap:8}}>
                                      <button className="btn danger" onClick={() => { setDeleting({ year, month, day }); setDeletePassword(''); }}>Delete</button>
                                      <button className="btn primary" onClick={handleRestore} disabled={isRestoring}>
                                        {isRestoring ? 'Restoring...' : 'Restore'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()}

              <div ref={historyRef}></div>
              <div className="history-controls">
                {historyList.length > 3 && (
                  <Link to="/backup/history?scroll=top" className="btn secondary" state={{ scrollToTop: true }}>View more</Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      {deleting && (
        <div className="modal modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3>Delete Backup</h3>
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
              <p>Are you sure you want to permanently delete this backup? This action cannot be undone.</p>
            </div>
            <div className="form-row">
              <label>Enter password to confirm:</label>
              <input 
                type="password" 
                value={deletePassword} 
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => { setDeleting(null); setDeletePassword(''); }}>Cancel</button>
              <button className="btn primary" onClick={() => { 
                if (deletePassword !== 'admin') {
                  showNotification('Incorrect password. Please try again.', 'error');
                  return;
                }
                setHistoryList(prev => prev.filter(i => i.id !== deleting)); 
                showNotification('Backup deleted successfully!', 'success'); 
                setDeleting(null);
                setDeletePassword('');
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <div className="toast-icon">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <div className="toast-message">{notification.message}</div>
        </div>
      )}
    </div>
  );
}

function FrequencyDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function handleSelect(v) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div className="dropdown" ref={ref} style={{opacity: disabled ? 0.6 : 1}}>
      <button className="dropdown-toggle" onClick={() => !disabled && setOpen(s => !s)} aria-haspopup="true" aria-expanded={open} disabled={disabled}>
        {value} ▾
      </button>
      <ul className={`dropdown-menu ${open ? 'open' : ''}`} role="menu" aria-hidden={!open}>
        <li role="menuitem"><button className="link-like" onClick={() => handleSelect('Daily')}>Daily</button></li>
        <li role="menuitem"><button className="link-like" onClick={() => handleSelect('Weekly')}>Weekly</button></li>
        <li role="menuitem"><button className="link-like" onClick={() => handleSelect('Monthly')}>Monthly</button></li>
      </ul>
    </div>
  );
}
