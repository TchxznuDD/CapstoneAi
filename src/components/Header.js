import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../views/Computer.css';

export default function Header({ active }) {
  return (
    <header className="app-header">
      <div className="brand">
        <img src="fatima-logo.png" alt="logo" />
        <div>
          <h1>Barangay Fatima</h1>
          <p>Network Monitoring Dashboard</p>
        </div>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/computer" className={`nav-item ${active === 'computers' ? 'active' : ''}`}>Computers</Link>
        <Link to="/server-status" className={`nav-item ${active === 'server-status' ? 'active' : ''}`}>Server Status</Link>
        <a href="#" className="nav-item">Firewall</a>
        <a href="#" className="nav-item">Backup</a>
      </nav>

      <div className="header-right">
        <AdminDropdown />
      </div>
    </header>
  );
}

function AdminDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const history = useHistory();

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

  function handleLogout() {
    try { sessionStorage.setItem('bfris_logged_out', '1'); } catch(e) {}
    window.__bfris_onpop = function () {
      try { if (sessionStorage.getItem('bfris_logged_out')) history.replace('/'); } catch(e) {}
    };
    window.addEventListener('popstate', window.__bfris_onpop);
    history.replace('/');
    try { window.history.pushState(null, '', window.location.href); } catch(e) {}
    setOpen(false);
  }

  return (
    <div className="dropdown" ref={ref}>
      <button className="dropdown-toggle" onClick={() => setOpen(s => !s)} aria-haspopup="true" aria-expanded={open}>Admin ▾</button>
      {open && (
        <ul className="dropdown-menu" role="menu">
          <li role="menuitem"><a href="#">Profile</a></li>
          <li role="menuitem"><a href="#">Settings</a></li>
          <li role="menuitem"><a href="#">Help</a></li>
          <li role="menuitem"><a href="#">User Manual</a></li>
          <li role="menuitem"><button className="link-like" onClick={handleLogout}>Logout</button></li>
        </ul>
      )}
    </div>
  );
}
