import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './BackupManagement.css';
import './BackupHistory.css';

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

export default function BackupHistory() {
  // Mock data only (stateful so delete can update)
  const [items, setItems] = useState([
    { id: 1, date: '2025-11-05T02:00:00', size: '2.4 GB', type: 'automatic' },
    { id: 2, date: '2025-11-04T02:00:00', size: '2.3 GB', type: 'automatic' },
    { id: 3, date: '2025-10-28T14:30:00', size: '2.1 GB', type: 'manual' },
    { id: 4, date: '2025-09-12T06:15:00', size: '1.9 GB', type: 'automatic' },
    { id: 5, date: '2024-12-31T23:59:00', size: '3.0 GB', type: 'manual' },
    { id: 6, date: '2024-11-15T11:00:00', size: '2.7 GB', type: 'automatic' },
  ]);

  const [deleting, setDeleting] = useState(null);

  const grouped = groupByYearMonth(items);

  function removeDay(year, month, day) {
    // remove all items that match year/month/day
    setItems(prev => prev.filter(it => {
      const d = new Date(it.date);
      return !(d.getFullYear() === Number(year) && d.toLocaleString(undefined, { month: 'long' }) === month && d.getDate() === Number(day));
    }));
  }

  return (
    <div className="dashboard-root backup-root backup-history">
      <Header active="backup" />

      <div className="hero-row">
        <div className="page-hero header-text">
          <div className="hero-text">
            <h2>Backup History</h2>
            <p>View your backups by year, month and day. This is a mock preview.</p>
          </div>
        </div>

        <div className="external-refresh" style={{alignSelf: 'center'}}>
          <Link to="/backup" className="refresh-btn">← Back</Link>
        </div>
      </div>

      <main className="backup-grid">
        {Object.keys(grouped).sort((a,b) => b - a).map(year => (
          <section key={year} className="card" style={{marginBottom:18}}>
            <h3 style={{marginBottom:12}}>{year}</h3>
            {Object.keys(grouped[year]).map(month => (
              <div key={month} style={{marginBottom:12}}>
                <h4 style={{margin:'6px 0', color:'#444'}}>{month}</h4>
                <div style={{display:'grid', gap:8}}>
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
                                <button className="btn danger" onClick={() => setDeleting({ year, month, day })}>Delete</button>
                                <button className="btn primary">Restore</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </section>
        ))}
      </main>
      {deleting && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="warning-row">
              <div className="modal-icon" aria-hidden>!</div>
              <div>
                <h3>Delete Backups</h3>
                <p>Are you sure you want to permanently delete all backups from <strong>{deleting.month} {deleting.day}, {deleting.year}</strong>? This cannot be undone.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn danger" onClick={() => { removeDay(deleting.year, deleting.month, deleting.day); setDeleting(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
