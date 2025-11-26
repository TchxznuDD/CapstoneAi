import React, { useState } from 'react';
import Header from '../components/Header';
import './Settings.css';

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

  // Notification toast state
  const [notification, setNotification] = useState(null);

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
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('New password and confirmation do not match.', 'error');
      return;
    }
    // TODO: API call to change password
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
