import React from 'react';
import Header from '../components/Header';
import './BackupManagement.css';
import DatabaseIcon from '../assets/Database.svg';
import BakaupIcon from '../assets/Bakaup.svg';
import BakaupOrange from '../assets/BakaupOrange.svg';
import checkIcon from '../assets/CheckNew.svg';

export default function BackupManagement() {
  const stats = {
    storageUsed: '12.4 GB',
    totalBackups: 5,
    successRate: '80%'
  };

  const history = [
    { id:1, date:'2025-11-05', type:'automatic', size:'2.4 GB' },
    { id:2, date:'2025-11-04', type:'automatic', size:'2.3 GB' },
    { id:3, date:'2025-11-03', type:'automatic', size:'2.3 GB' },
    { id:4, date:'2025-11-02', type:'manual', size:'2.2 GB' },
  ];

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
          <div className="metric-card">
            <p className="label">Storage Used</p>
            <p className="value">{stats.storageUsed}</p>
            <div className="note">▲ 24.8%</div>
            <div className="stat-icon"><div className="icon-bg"><img src={DatabaseIcon} alt="storage"/></div></div>
          </div>

          <div className="metric-card">
            <p className="label">Total Backups</p>
            <p className="value">{stats.totalBackups}</p>
            <div className="note green">▲ Active</div>
            <div className="stat-icon"><div className="icon-bg"><img src={BakaupIcon} alt="backups"/></div></div>
          </div>

          <div className="metric-card">
            <p className="label">Success Rate</p>
            <p className="value">{stats.successRate}</p>
            <div className="note">▲ Excellent</div>
            <div className="stat-icon"><div className="icon-bg green"><img src={checkIcon} alt="success"/></div></div>
          </div>
        </section>

        <section className="left-panel">
          <div className="card manual-backup">
            <div className="manual-top">
              <div className="manual-thumb"><img src={BakaupOrange} alt="backup"/></div>
              <div className="manual-info">
                <h3>Manual Backup</h3>
                <p className="muted">Create an immediate backup of your data</p>
                <div className="muted small">Last manual backup: 2025-11-02 · 2.2 GB</div>
              </div>
            </div>

            <div className="manual-actions">
              <div className="backup-progress">
                <div className="progress-bar" aria-hidden>
                  <div className="progress" style={{width: '0%'}}></div>
                </div>
                <div className="muted small">No recent successful backups</div>
              </div>
              <div className="actions">
                <button className="btn primary">Start Backup</button>
                <button className="btn secondary">View Backups</button>
              </div>
            </div>
          </div>

          <div className="card auto-settings">
            <h3>Automatic Backup Settings</h3>
            <p className="muted">Configure scheduled automatic backups</p>
            <div className="form-row small">
              <label>Enable Automatic Backup</label>
              <div className="toggle">●</div>
            </div>
            <div className="form-row small">
              <label>Backup Frequency</label>
              <input value="Daily" readOnly />
            </div>
            <div className="form-row small">
              <label>Backup Time</label>
              <input value="5:00 p.m" readOnly />
            </div>
            <div style={{marginTop:12}}>
              <button className="btn primary" style={{width:'100%'}}>Save Settings</button>
            </div>
          </div>
          <div className="card history">
            <h3>Backup History</h3>
            <div className="history-list">
              {history.map(h => (
                <div key={h.id} className="history-item">
                  <div className="hi-left">
                    <div className={`status-dot ${h.type}`}></div>
                    <div>
                      <div className="hi-date">{h.date} <span className="muted small">05:00 PM · {h.size}</span></div>
                      <div className="muted small">{h.type}</div>
                    </div>
                  </div>
                  <div className="hi-actions">
                    <button className="btn">Restore</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
