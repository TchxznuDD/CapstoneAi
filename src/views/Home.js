import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Home.css';
import { mockRecords } from '../data/Matrix.js';

export default function Home() {
  // Mocked summary values - replace with real data integration later
  const [summary, setSummary] = useState({ totalPCs: 12, pcsOnline: 9, serversOnline: 2, firewallOnline: true, backupsSuccessful: 42 });

  useEffect(() => {
    // If the app exposes live data in window.__dashboardData, prefer it
    try {
      const remote = window.__dashboardData;
      if (remote && typeof remote === 'object') {
        setSummary(s => ({ ...s, ...remote }));
      }
    } catch (e) {}
  }, []);

  // derive simple risk counts from mockRecords
  const riskCounts = mockRecords.reduce((acc, r) => {
    const level = (r.riskLevel || 'UNKNOWN').toUpperCase();
    acc[level] = (acc[level] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {});

  const extremeCount = riskCounts['EXTREME'] || 0;
  const highCount = riskCounts['HIGH'] || 0;
  const mediumCount = riskCounts['MEDIUM'] || 0;
  const lowCount = riskCounts['LOW'] || 0;

  // derived friendly metrics for dashboard
  const pcOnlinePercent = summary.totalPCs ? Math.round((summary.pcsOnline / summary.totalPCs) * 100) : 0;
  const backupRecent = '2 hours ago';
  const systemHealth = Math.max(28, 100 - ((extremeCount * 18) + (highCount * 8)));

  // Compact MikroTik mock (reused from ServerStatus example)
  const router = {
    name: 'MikroTik RB750Gr3',
    subtitle: 'RouterOS v7.14 (hEX)',
    status: 'online',
    ip: '192.168.1.1',
    uptime: '31 days, 8 hours',
    cpu: 19.2,
    memory: { usedMB: 84, totalMB: 256 },
    system: {
      model: 'RB750Gr3 (hEX)',
      firmware: '7.14 (stable)',
      temperature: '46°C',
      dhcpLeases: 58,
      activeConns: 1342
    }
  };

  const nextBackup = 'Today 02:00 AM';

  function runBackup() {
    alert('Backup job queued — check Backups for status.');
  }

  return (
    <div className="dashboard-root">
      <Header active="home" />

      <div className="hero-row">
        <div className="page-hero">
          <div className="hero-text">
            <h2>Overview</h2>
            <p>Quick summary of the network, servers, firewall and backups.</p>
          </div>
        </div>
        <div className="external-refresh">
          <button className="refresh-btn" onClick={() => window.location.reload()}>Refresh ↻</button>
        </div>
      </div>

      <section className="stats-grid" aria-label="At a glance summary">
        <Link to="/computer" className="home-card-link" aria-label="Go to Devices">
          <div className="stat-card stat-total">
          <div>
            <div className="label">Endpoints</div>
            <div className="value">{summary.totalPCs}</div>
            <div className="stat-desc">Total endpoints monitored (desktops, laptops, servers).</div>
          </div>
          <div className="stat-icon">
            <div className="icon-bg">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16v10H4z" opacity=".95"/><path d="M2 18h20v2H2z"/></svg>
            </div>
          </div>
          </div>
        </Link>

        <Link to="/computer" className="home-card-link" aria-label="Go to Computers">
          <div className="stat-card stat-online">
          <div>
            <div className="label">PCs Online</div>
            <div className="value green">{summary.pcsOnline}</div>
            <div className="stat-desc">{pcOnlinePercent}% of devices are online right now.</div>
            <div className="progress-bar" aria-hidden>
              <div className="progress-fill" style={{ width: `${pcOnlinePercent}%` }} />
            </div>
          </div>
          <div className="stat-icon">
            <div className="icon-bg"><svg className="stat-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>
          </div>
          </div>
        </Link>

        <Link to="/server-status" className="home-card-link" aria-label="Go to Server Status">
          <div className="stat-card stat-online">
          <div>
            <div className="label">Servers Online</div>
            <div className="value">{summary.serversOnline}</div>
            <div className="stat-desc">Key backend servers currently responding.</div>
          </div>
          <div className="stat-icon">
            <div className="icon-bg"><svg className="stat-svg" viewBox="0 0 24 24"><path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"/></svg></div>
          </div>
          </div>
        </Link>

        <Link to="/firewall/monitor" className="home-card-link" aria-label="Go to Firewall Monitor">
          <div className="stat-card">
            <div>
              <div className="label">Firewall</div>
              <div className="value">{summary.firewallOnline ? 'Online' : 'Offline'}</div>
              <div className="stat-desc">Gateway protection status — essential for blocking attacks.</div>
            </div>
            <div className="stat-icon">
              <div className="icon-bg"><svg className="stat-svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg></div>
            </div>
          </div>
        </Link>

        <Link to="/backup" className="home-card-link" aria-label="Go to Backup Management">
          <div className="stat-card">
            <div>
              <div className="label">Backups Successful</div>
              <div className="value">{summary.backupsSuccessful}</div>
              <div className="stat-desc">Last successful backup: {backupRecent}.</div>
            </div>
            <div className="stat-icon">
              <div className="icon-bg"><svg className="stat-svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
            </div>
          </div>
        </Link>

        <Link to="/risk-assessment" className="home-card-link" aria-label="Go to Risk Assessment">
          <div className="stat-card">
          <div>
            <div className="label">Risk Items</div>
            <div className="value">{mockRecords.length}</div>
            <div className="home-summary-badges">
              <span className="home-badge extreme">{extremeCount} EXTREME</span>
              <span className="home-badge high">{highCount} HIGH</span>
              <span className="home-badge medium">{mediumCount} MEDIUM</span>
              <span className="home-badge low">{lowCount} LOW</span>
            </div>
            <div className="stat-desc">Known issues needing attention — click to see details.</div>
          </div>
          <div className="stat-icon">
            <div className="icon-bg">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"/></svg>
            </div>
          </div>
          </div>
        </Link>
      </section>

      {/* Two-column panels: system health / quick actions and alerts/recent risks */}
      <section className="home-panels" aria-label="Dashboard panels" style={{ marginTop: 18 }}>
        <div className="left-panel">
          <div className="pro-card mikrotik-card">
            <h4>MikroTik Summary</h4>
            <div className="mikro-row">
              <div className="mikro-meta">
                <div className="mikro-name">{router.name}</div>
                <div className="mikro-sub">{router.subtitle} <span className={`server-badge ${router.status}`}>{router.status}</span></div>
                <div className="mikro-info">
                  <div><strong>IP:</strong> {router.ip}</div>
                  <div><strong>Uptime:</strong> {router.uptime}</div>
                  <div><strong>Firmware:</strong> {router.system.firmware}</div>
                </div>
                <div className="mikro-actions">
                  <button className="action-btn" onClick={runBackup}>Run Backup</button>
                  <Link to="/server-status" className="action-btn">Full Router</Link>
                </div>
              </div>
              <div className="mikro-side">
                <div className="mikro-sched">
                  <div className="sched-label">Next Auto-Backup</div>
                  <div className="sched-time">{nextBackup}</div>
                </div>
                <div className="mikro-stats">
                  <div className="mini-stat"><span>Conns</span><strong>{router.system.activeConns}</strong></div>
                  <div className="mini-stat"><span>Leases</span><strong>{router.system.dhcpLeases}</strong></div>
                </div>
              </div>
            </div>
            <div className="mikro-recent">
              <h5>Recent Risks (router)</h5>
              <ul>
                {mockRecords.slice(0,4).map((r, i) => (
                  <li key={i}><strong>{r.asset}</strong> — <span className="muted">{r.riskLevel} • {r.impact || r.threats}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="pro-card stats-pane">
            <h4>Statistics Overview</h4>
            <div className="stat-block">
              <div className="stat-row">
                <div className="stat-label">Extreme</div>
                <div className="stat-bar"><div className="stat-fill" style={{ width: `${Math.round((extremeCount / Math.max(1, mockRecords.length)) * 100)}%` }} /></div>
                <div className="stat-value">{extremeCount}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label">High</div>
                <div className="stat-bar"><div className="stat-fill high" style={{ width: `${Math.round((highCount / Math.max(1, mockRecords.length)) * 100)}%` }} /></div>
                <div className="stat-value">{highCount}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Medium</div>
                <div className="stat-bar"><div className="stat-fill medium" style={{ width: `${Math.round((mediumCount / Math.max(1, mockRecords.length)) * 100)}%` }} /></div>
                <div className="stat-value">{mediumCount}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Low</div>
                <div className="stat-bar"><div className="stat-fill low" style={{ width: `${Math.round((lowCount / Math.max(1, mockRecords.length)) * 100)}%` }} /></div>
                <div className="stat-value">{lowCount}</div>
              </div>
            </div>
          </div>

          
        </div>
      </section>

      

      <section className="buildings-col">
        <div className="building">
          <div className="building-head">
            <div className="building-title-row">
              <div className="location-icon">🏢</div>
              <div>
                <h3 className="building-title">Computers</h3>
                <div className="building-sub">Quick glance of workstation availability</div>
              </div>
            </div>
            <div className="building-status">
              <div className="status-pill online"><span className="label">Online</span><span className="count">{summary.pcsOnline}</span></div>
              <div className="status-pill"><span className="label">Total</span><span className="count">{summary.totalPCs}</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
