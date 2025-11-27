import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './Settings.css';
import { getDeletePasskey, setDeletePasskey, resetDeletePasskey, DEFAULT_PASSKEY } from '../utils/passkey';
import { getAdminPassword, setAdminPassword, getJuniorPassword, setJuniorPassword, DEFAULT_JUNIOR_PASSWORD } from '../utils/auth';
import { getDarkMode, setDarkMode } from '../utils/theme';

export default function Settings() {
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [backupAlerts, setBackupAlerts] = useState(true);
  const [offlineAlerts, setOfflineAlerts] = useState(true);

  // Auto-refresh settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');

  // Display settings
  const [compactView, setCompactView] = useState(false);
  const [showUptime, setShowUptime] = useState(true);
  const [darkMode, setDarkModeState] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60'); // in minutes, default 1 hour

  // Notification toast state
  const [notification, setNotification] = useState(null);

  // Admin Passkey state
  const [currentPasskey, setCurrentPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);

  // Junior Staff password state
  const [juniorCurrent, setJuniorCurrent] = useState('');
  const [juniorNew, setJuniorNew] = useState('');
  const [juniorConfirm, setJuniorConfirm] = useState('');
  const [showJuniorPassword, setShowJuniorPassword] = useState(false);

  useEffect(() => {
    setCurrentPasskey(getDeletePasskey());
    setJuniorCurrent(getJuniorPassword());
    setDarkModeState(getDarkMode());
  }, []);

  function showNotification(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSavePassword() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showNotification('Please fill in all password fields.', 'error');
      return;
    }
    // verify current password matches stored admin password
    if (passwordForm.currentPassword !== getAdminPassword()) {
      showNotification('Current password is incorrect.', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('New password and confirmation do not match.', 'error');
      return;
    }
    if (passwordForm.newPassword.trim().length < 4) {
      showNotification('New password must be at least 4 characters.', 'error');
      return;
    }
    setAdminPassword(passwordForm.newPassword.trim());
    showNotification('Password changed successfully!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  function handleSaveNotifications() {
    showNotification('Notification settings saved!', 'success');
  }

  function handleSaveDisplay() {
    showNotification('Display settings saved!', 'success');
  }

  function handleSaveRefresh() {
    showNotification('Auto-refresh settings saved!', 'success');
  }

  function handleSavePasskey() {
    if (!newPasskey || !newPasskey.trim()) {
      showNotification('Please enter a new Admin Passkey.', 'error');
      return;
    }
    if (newPasskey !== confirmPasskey) {
      showNotification('Admin Passkey and confirmation do not match.', 'error');
      return;
    }
    if (newPasskey.trim().length < 6) {
      showNotification('Admin Passkey must be at least 6 characters.', 'error');
      return;
    }
    setDeletePasskey(newPasskey.trim());
    setCurrentPasskey(getDeletePasskey());
    setNewPasskey('');
    setConfirmPasskey('');
    showNotification('Admin Passkey updated successfully!', 'success');
  }

  function handleResetPasskey() {
    resetDeletePasskey();
    setCurrentPasskey(getDeletePasskey());
    setNewPasskey('');
    setConfirmPasskey('');
    showNotification(`Admin Passkey reset to default (${DEFAULT_PASSKEY}).`, 'success');
  }

  function handleSaveJuniorPassword() {
    if (!juniorNew || !juniorNew.trim()) {
      showNotification('Please enter a new Junior Staff password.', 'error');
      return;
    }
    if (juniorNew !== juniorConfirm) {
      showNotification('Junior Staff password and confirmation do not match.', 'error');
      return;
    }
    if (juniorNew.trim().length < 4) {
      showNotification('Junior Staff password must be at least 4 characters.', 'error');
      return;
    }
    setJuniorPassword(juniorNew.trim());
    setJuniorCurrent(getJuniorPassword());
    setJuniorNew('');
    setJuniorConfirm('');
    showNotification('Junior Staff password updated successfully!', 'success');
  }

  return (
    <div className="dashboard-root settings-root">
      <Header active="settings" />

      <div className="hero-row">
        <div className="page-hero header-text">
          <div className="hero-text">
            <h2>Settings</h2>
            <p>Manage your dashboard preferences and account settings</p>
          </div>
        </div>
      </div>

      <main className="settings-grid">
        {/* Junior Staff Password Section */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Junior Staff Password</h3>
            <p className="muted small">Controls login for Junior Staff app (no username enforcement)</p>
          </div>
          <div className="card-body">
            <div className="form-row">
              <label>Current Password</label>
              <div style={{display:'flex', gap:8}}>
                <input type={showJuniorPassword ? 'text' : 'password'} value={juniorCurrent} readOnly />
                <button className="btn" onClick={() => setShowJuniorPassword(s => !s)}>{showJuniorPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div className="form-row">
              <label>New Password</label>
              <input type="password" value={juniorNew} onChange={e => setJuniorNew(e.target.value)} placeholder="Enter new junior staff password" />
            </div>
            <div className="form-row">
              <label>Confirm New Password</label>
              <input type="password" value={juniorConfirm} onChange={e => setJuniorConfirm(e.target.value)} placeholder="Confirm new junior staff password" />
            </div>
            <div className="card-actions">
              <button className="btn primary" onClick={handleSaveJuniorPassword}>Save Junior Password</button>
            </div>
          </div>
        </section>
        {/* Admin Passkey Section */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Admin Passkey</h3>
            <p className="muted small">Used to authorize deletes in Admin and Junior Staff apps</p>
          </div>
          <div className="card-body">
            <div className="form-row">
              <label>Current Passkey</label>
              <div style={{display:'flex', gap:8}}>
                <input type={showPasskey ? 'text' : 'password'} value={currentPasskey} readOnly />
                <button className="btn" onClick={() => setShowPasskey(s => !s)}>{showPasskey ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div className="form-row">
              <label>New Passkey</label>
              <input
                type="password"
                value={newPasskey}
                onChange={e => setNewPasskey(e.target.value)}
                placeholder="Enter new admin passkey"
              />
            </div>
            <div className="form-row">
              <label>Confirm New Passkey</label>
              <input
                type="password"
                value={confirmPasskey}
                onChange={e => setConfirmPasskey(e.target.value)}
                placeholder="Confirm new admin passkey"
              />
            </div>
            <div className="card-actions" style={{display:'flex', gap:8}}>
              <button className="btn primary" onClick={handleSavePasskey}>Save Passkey</button>
              <button className="btn" onClick={handleResetPasskey}>Reset to Default</button>
            </div>
          </div>
        </section>
        {/* Password Section */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Change Password</h3>
            <p className="muted small">Update your account password</p>
          </div>
          <div className="card-body">
            <div className="form-row">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-row">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-row">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>
            <div className="card-actions">
              <button className="btn primary" onClick={handleSavePassword}>Change Password</button>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Notifications</h3>
            <p className="muted small">Configure alert preferences</p>
          </div>
          <div className="card-body">
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Email Notifications</div>
                <div className="muted small">Receive email alerts for important events</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Desktop Alerts</div>
                <div className="muted small">Show browser notifications</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={desktopAlerts} onChange={e => setDesktopAlerts(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Backup Alerts</div>
                <div className="muted small">Notify when backups complete or fail</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={backupAlerts} onChange={e => setBackupAlerts(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Offline Alerts</div>
                <div className="muted small">Alert when computers go offline</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={offlineAlerts} onChange={e => setOfflineAlerts(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="card-actions">
              <button className="btn primary" onClick={handleSaveNotifications}>Save Notifications</button>
            </div>
          </div>
        </section>

        {/* Auto-refresh Section */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Auto-Refresh</h3>
            <p className="muted small">Automatically update dashboard data</p>
          </div>
          <div className="card-body">
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Enable Auto-Refresh</div>
                <div className="muted small">Refresh data periodically</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="form-row">
              <label>Refresh Interval (seconds)</label>
              <select value={refreshInterval} onChange={e => setRefreshInterval(e.target.value)} disabled={!autoRefresh}>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds (Default)</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
              </select>
            </div>

            <div className="card-actions">
              <button className="btn primary" onClick={handleSaveRefresh} disabled={!autoRefresh}>Save Auto-Refresh</button>
            </div>
          </div>
        </section>

        {/* Display Settings Section */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Display Settings</h3>
            <p className="muted small">Customize dashboard appearance</p>
          </div>
          <div className="card-body">
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Compact View</div>
                <div className="muted small">Show more information in less space</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={compactView} onChange={e => setCompactView(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Show Uptime</div>
                <div className="muted small">Display uptime on computer cards</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={showUptime} onChange={e => setShowUptime(e.target.checked)} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Dark Mode</div>
                <div className="muted small">Use dark color scheme</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={darkMode} onChange={e => { setDarkModeState(e.target.checked); setDarkMode(e.target.checked); }} />
                <span className="slider" aria-hidden></span>
              </label>
            </div>

            <div className="form-row">
              <label>Session Timeout</label>
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
                <option value="never">Never (Not Recommended)</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour (Default)</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="480">8 hours</option>
              </select>
              <div className="muted small" style={{marginTop: '6px'}}>Automatically log out after period of inactivity</div>
            </div>

            <div className="card-actions">
              <button className="btn primary" onClick={handleSaveDisplay}>Save Display</button>
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
    </div>
  );
}
