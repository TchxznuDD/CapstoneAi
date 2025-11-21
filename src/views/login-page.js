import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./login-page.css";

export default function LoginPage() {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [toast, setToast] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = { username: '', password: '' };
    const missing = [];
    if (!username || !username.trim()) { nextErrors.username = 'Username is required'; missing.push('Username'); }
    if (!password || !password.trim()) { nextErrors.password = 'Password is required'; missing.push('Password'); }
    setErrors(nextErrors);
    if (missing.length) {
      const msg = `Please provide: ${missing.join(', ')}`;
      setToast(msg);
      // clear toast after 3s
      window.clearTimeout(window._loginToastTimer);
      window._loginToastTimer = window.setTimeout(() => setToast(''), 3000);
      return;
    }
    // simple client-side 'login' behavior: navigate to computer dashboard
    history.push('/computer');
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <img src="/fatima-logo.png" alt="Fatima Logo" className="login-logo" />
        <h2>Welcome to Barangay Fatima</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <svg className="input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
            </svg>
                <input type="text" name="username" placeholder="Admin" className={`login-input ${errors.username ? 'invalid' : ''}`} value={username} onChange={e => { setUsername(e.target.value); if (errors.username) setErrors(es => ({...es, username: ''})); }} aria-invalid={errors.username ? 'true' : 'false'} />
          </div>

          <div className="input-row">
            <svg className="input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 0 0-12 0v2H4v10h16V11h-2zm-8-2a4 4 0 0 1 8 0v2H10V9z" />
            </svg>
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" className={`login-input ${errors.password ? 'invalid' : ''}`} value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(es => ({...es, password: ''})); }} aria-invalid={errors.password ? 'true' : 'false'} />
            <button type="button" className="eye-btn" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(s => !s)}>
              {showPassword ? (
                <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5c-7 0-11 6.5-11 7s4 7 11 7 11-6.5 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
              ) : (
                <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4.5C7 4.5 3 8 1 12c2 4 6 7.5 11 7.5s9-3.5 11-7.5c-2-4-6-7.5-11-7.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>
              )}
            </button>
                
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
            {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
      </div>
    </div>
  );
}
