import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../views/Computer.css';

export default function Header({ active }) {
  const history = useHistory();

  function handleBrandClick(e) {
    // Prevent default Link navigation so we can control scroll behaviour
    e.preventDefault();
    const target = '/computer';
    if (history.location && history.location.pathname === target) {
      // already on computer page — scroll to top smoothly
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
      return;
    }
    // navigate then scroll to top after a short delay so the target page rendered
    history.push(target);
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); } }, 120);
  }

  return (
    <header className="app-header">
      <Link to="/computer" className="brand" onClick={handleBrandClick} aria-label="Go to Computers">
        <img src="/fatima-logo.png" alt="logo" />
        <div>
          <h1>Barangay Fatima</h1>
          <p>Network Monitoring Dashboard</p>
        </div>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/computer" className={`nav-item ${active === 'computers' ? 'active' : ''}`}>Computers</Link>
        <Link to="/server-status" className={`nav-item ${active === 'server-status' ? 'active' : ''}`}>Server Status</Link>
        <a href="#" className="nav-item">Firewall</a>
            <Link to="/backup" className={`nav-item ${active === 'backup' ? 'active' : ''}`}>Backup</Link>
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
      <ul className={`dropdown-menu ${open ? 'open' : ''}`} role="menu" aria-hidden={!open}>
        <li role="menuitem"><a href="#">Settings</a></li>
        <li role="menuitem"><a href="#">Help</a></li>
        <li role="menuitem"><a href="#">User Manual</a></li>
        <li role="menuitem"><button className="link-like" onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
}
