import React, { useState } from 'react';
import Header from '../components/Header';
import './Firewall.css';

export default function Firewall() {
  const [rules, setRules] = useState([
    { id: 1, status: true, priority: 1, name: 'Allow SSH', description: 'Allow SSH access from anywhere', protocol: 'TCP', source: '0.0.0.0\nPort: ANY', destination: '192.168.1.5\nPort: 22', action: 'ALLOW' },
    { id: 2, status: true, priority: 2, name: 'Allow HTTP/HTTPS', description: '', protocol: 'TCP', source: '0.0.0.0\nPort: ANY', destination: '192.168.1.5\nPort: 80,443', action: 'ALLOW' },
    { id: 3, status: true, priority: 3, name: 'Block Suspicious IP', description: 'Block known malicious IP', protocol: 'ALL', source: '203.0.113.45\nPort: ANY', destination: '192.168.1.5\nPort: ANY', action: 'BLOCK' },
    { id: 4, status: true, priority: 4, name: 'Allow DNS', description: 'Allow DNS queries to Google DNS', protocol: 'UDP', source: '192.168.1.0/24\nPort: ANY', destination: '8.8.8.8\nPort: 53', action: 'ALLOW' },
    { id: 5, status: false, priority: 5, name: 'Block FTP', description: 'Block FTP for security', protocol: 'TCP', source: '0.0.0.0\nPort: ANY', destination: '192.168.1.5\nPort: 21', action: 'BLOCK' },
    { id: 6, status: true, priority: 6, name: 'Allow MySQL', description: 'Allow MySQL access from local', protocol: 'TCP', source: '192.168.1.0/24\nPort: ANY', destination: '192.168.1.5\nPort: 3306', action: 'ALLOW' },
    { id: 7, status: true, priority: 7, name: 'Block Telnet', description: 'Block insecure Telnet protocol', protocol: 'TCP', source: '0.0.0.0\nPort: ANY', destination: '192.168.1.5\nPort: 23', action: 'BLOCK' },
  ]);

  const [notification, setNotification] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, ruleId: null, ruleName: '' });
  const [deletePassword, setDeletePassword] = useState('');

  function showNotification(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

  const stats = {
    active: rules.filter(r => r.status && r.action === 'ALLOW').length,
    allow: rules.filter(r => r.action === 'ALLOW').length,
    block: rules.filter(r => r.action === 'BLOCK').length,
    total: rules.length,
  };

  function toggleRule(id) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
  }

  function handleAddRule() {
    showNotification('Add Rule functionality coming soon!', 'info');
  }

  function handleEditRule(id) {
    showNotification('Edit Rule functionality coming soon!', 'info');
  }

  function handleDeleteRule(id) {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      setDeleteModal({ open: true, ruleId: id, ruleName: rule.name });
      setDeletePassword('');
    }
  }

  function confirmDeleteRule() {
    if (deletePassword !== 'admin') {
      showNotification('Incorrect password. Please try again.', 'error');
      return;
    }
    setRules(prev => prev.filter(r => r.id !== deleteModal.ruleId));
    showNotification('Firewall rule deleted successfully!', 'success');
    setDeleteModal({ open: false, ruleId: null, ruleName: '' });
    setDeletePassword('');
  }

  function closeDeleteModal() {
    setDeleteModal({ open: false, ruleId: null, ruleName: '' });
    setDeletePassword('');
  }

  return (
    <div className="dashboard-root firewall-root">
      <Header active="firewall" />

      <div className="hero-row">
        <div className="page-hero">
          <div className="hero-text">
            <h2>Firewall Management</h2>
            <p>Configure and monitor network security rules</p>
          </div>
        </div>
      </div>

      <main>
        <section className="stats-grid firewall-stats">
          <div className="stat-card">
            <div>
              <p className="label">Active Rules</p>
              <p className="value">{stats.active}</p>
            </div>
            <div className="stat-icon">
              <div className="icon-bg active">
                <svg viewBox="0 0 24 24" fill="currentColor" className="stat-svg">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="label">Allow Rules</p>
              <p className="value green">{stats.allow}</p>
            </div>
            <div className="stat-icon">
              <div className="icon-bg green">
                <svg viewBox="0 0 24 24" fill="currentColor" className="stat-svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="label">Block Rules</p>
              <p className="value red">{stats.block}</p>
            </div>
            <div className="stat-icon">
              <div className="icon-bg red">
                <svg viewBox="0 0 24 24" fill="currentColor" className="stat-svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="label">Total Rules</p>
              <p className="value">{stats.total}</p>
            </div>
            <div className="stat-icon">
              <div className="icon-bg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="stat-svg">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="card firewall-rules">
          <div className="card-header">
            <h3>Firewall Rules</h3>
            <button className="btn primary" onClick={handleAddRule}>+ Add Rule</button>
          </div>

          <div className="rules-table">
            <div className="rules-header">
              <div className="col-status">Status</div>
              <div className="col-priority">Priority</div>
              <div className="col-name">Name</div>
              <div className="col-protocol">Protocol</div>
              <div className="col-source">Source</div>
              <div className="col-destination">Destination</div>
              <div className="col-action">Action</div>
              <div className="col-actions">Actions</div>
            </div>

            <div className="rules-body">
              {rules.map(rule => (
                <div key={rule.id} className="rule-row">
                  <div className="col-status">
                    <label className="toggle-switch">
                      <input type="checkbox" checked={rule.status} onChange={() => toggleRule(rule.id)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="col-priority">{rule.priority}</div>
                  <div className="col-name">
                    <div className="rule-name">{rule.name}</div>
                    {rule.description && <div className="rule-desc">{rule.description}</div>}
                  </div>
                  <div className="col-protocol">
                    <span className={`protocol-badge ${rule.protocol.toLowerCase()}`}>{rule.protocol}</span>
                  </div>
                  <div className="col-source">
                    <pre>{rule.source}</pre>
                  </div>
                  <div className="col-destination">
                    <pre>{rule.destination}</pre>
                  </div>
                  <div className="col-action">
                    <span className={`action-badge ${rule.action.toLowerCase()}`}>{rule.action}</span>
                  </div>
                  <div className="col-actions">
                    <button className="icon-btn edit" onClick={() => handleEditRule(rule.id)} title="Edit Rule">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDeleteRule(rule.id)} title="Delete Rule">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <div className="toast-icon">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <div className="toast-message">{notification.message}</div>
        </div>
      )}

      {deleteModal.open && (
        <div className="modal modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3>Delete Firewall Rule</h3>
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
              <p>Are you sure you want to delete <strong>{deleteModal.ruleName}</strong>? This action cannot be undone.</p>
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
              <button className="btn" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn primary" onClick={confirmDeleteRule}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
