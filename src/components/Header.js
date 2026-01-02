import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Header.css';
import fatimaLogo from '../assets/fatima-logo.png';

export default function Header({ active }) {
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Real-time clock and date state (24-hour, white, small)
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  });
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function scrollTop() {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
  }

  function handleBrandClick(e) {
    // Prevent default Link navigation so we can control scroll behaviour
    e.preventDefault();
    const target = '/home';
    if (history.location && history.location.pathname === target) {
      // already on computer page — scroll to top smoothly
      scrollTop();
      return;
    }
    // navigate then scroll to top after a short delay so the target page rendered
    history.push(target);
    setTimeout(scrollTop, 120);
  }

  function handleNavClick(e, target) {
    e.preventDefault();
    if (history.location && history.location.pathname === target) {
      scrollTop();
      return;
    }
    history.push(target);
    setTimeout(scrollTop, 120);
  }

  // Close drawer smoothly, then navigate so the closing animation is visible
  function navigateClose(target) {
    setDrawerOpen(false);
    // match CSS transition (~220ms)
    setTimeout(() => {
      if (history.location && history.location.pathname === target) {
        scrollTop();
        return;
      }
      history.push(target);
      setTimeout(scrollTop, 120);
    }, 220);
  }

  // Close drawer with Escape and prevent body scroll while open
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (drawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [drawerOpen]);

  return (
    <header className="app-header">
      <div className="header-nav-group">
        <button className="hamburger-btn" aria-label="Open navigation" onClick={() => setDrawerOpen(s => !s)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <Link to="/home" className="brand" onClick={(e)=>{ setDrawerOpen(false); handleBrandClick(e); }} aria-label="Go to Home">
          <img src={fatimaLogo} alt="logo" />
          <div>
            <h1>Barangay Fatima</h1>
            <p>Network Monitoring Dashboard</p>
          </div>
        </Link>
      </div>

      

      {/* Side drawer for small screens / hamburger menu */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`} role="dialog" aria-hidden={!drawerOpen}>
        <div className="drawer-header">
          <strong>Menu</strong>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <div className="drawer-links">
          <a href="/home" onClick={(e)=>{ e.preventDefault(); navigateClose('/home'); }} className={`nav-item ${active === 'home' ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3l9 8h-3v7h-12v-7h-3l9-8z" fill="currentColor"/></svg>
            </span>
            Home
          </a>

          <a href="/computer" onClick={(e)=>{ e.preventDefault(); navigateClose('/computer'); }} className={`nav-item ${active === 'computers' ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M3 5h18v11h-18zM1 19h22v2h-22z" fill="currentColor"/></svg>
            </span>
            Computers
          </a>

          <a href="/server-status" onClick={(e)=>{ e.preventDefault(); navigateClose('/server-status'); }} className={`nav-item ${active === 'server-status' ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 6h16v4h-16zM4 12h16v2h-16zM4 16h16v2h-16z" fill="currentColor"/></svg>
            </span>
            Infrastructure
          </a>

          <a href="/firewall/monitor" onClick={(e)=>{ e.preventDefault(); navigateClose('/firewall/monitor'); }} className={`nav-item ${active === 'firewall-monitor' ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/></svg>
            </span>
            Firewall Monitor
          </a>

          <a href="/risk-assessment" onClick={(e)=>{ e.preventDefault(); navigateClose('/risk-assessment'); }} className={`nav-item ${active === 'risk' ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/></svg>
            </span>
            Risk Assessment
          </a>

          <a href="/backup" onClick={(e)=>{ e.preventDefault(); navigateClose('/backup'); }} className={`nav-item ${active === 'backup' ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M19 15v-2h-4v-3l-5 4 5 4v-3h4zM5 7v2h4v3l5-4-5-4v3h-4z" fill="currentColor"/></svg>
            </span>
            Backup
          </a>
        </div>
      </div>
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Real-time clock, left of NotificationBell */}
        <span style={{ color: 'white', fontSize: '0.95em', fontWeight: 400, letterSpacing: '0.05em', minWidth: 90, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span>{currentTime}</span>
          <span style={{ fontSize: '0.8em', opacity: 0.85 }}>{currentDate}</span>
        </span>
        <NotificationBell />
        <AdminDropdown />
      </div>
    </header>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef(null);

  const recentNotifications = [
    { id: 1, type: 'offline', message: 'Revenue PC-01 went offline', time: '2 hours ago' },
    { id: 2, type: 'online', message: 'Legislative PC-03 is back online', time: '4 hours ago' },
    { id: 3, type: 'backup', message: 'Backup completed successfully', time: '6 hours ago' },
    { id: 4, type: 'warning', message: 'High CPU usage on Server-01', time: '8 hours ago' },
    { id: 5, type: 'offline', message: 'VAWC Station went offline', time: '12 hours ago' },
  ];

  const olderNotifications = [
    { id: 6, type: 'online', message: 'Revenue PC-02 is back online', time: '1 day ago' },
    { id: 7, type: 'backup', message: 'Scheduled backup completed', time: '1 day ago' },
    { id: 8, type: 'offline', message: 'Legislative PC-04 went offline', time: '2 days ago' },
    { id: 9, type: 'firewall', message: 'Firewall rule updated', time: '2 days ago' },
    { id: 10, type: 'backup', message: 'Manual backup initiated', time: '3 days ago' },
    { id: 11, type: 'online', message: 'Server-01 rebooted successfully', time: '3 days ago' },
    { id: 12, type: 'warning', message: 'Low disk space warning', time: '4 days ago' },
    { id: 13, type: 'offline', message: 'Network timeout detected', time: '5 days ago' },
    { id: 14, type: 'backup', message: 'Backup restoration completed', time: '6 days ago' },
    { id: 15, type: 'online', message: 'All systems operational', time: '1 week ago' },
  ];

  const displayedNotifications = showAll ? [...recentNotifications, ...olderNotifications] : recentNotifications;
  const unreadCount = recentNotifications.length;

  function getNotificationIcon(type) {
    switch(type) {
      case 'offline':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
          </svg>
        );
      case 'online':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case 'backup':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        );
      case 'firewall':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
    }
  }

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

  return (
    <div className="notification-dropdown" ref={ref}>
      <button className="notification-bell" onClick={() => setOpen(s => !s)} aria-label="Notifications" aria-haspopup="true" aria-expanded={open}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/>
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      <div className={`notification-panel ${open ? 'open' : ''}`}>
        <div className="notification-header">
          <h4>Notifications</h4>
          <span className="notification-count">{unreadCount} new</span>
        </div>
        <div className="notification-list">
          {displayedNotifications.map(notif => (
            <div key={notif.id} className={`notification-item ${notif.type}`}>
              <span className="notif-icon">{getNotificationIcon(notif.type)}</span>
              <div className="notif-content">
                <p className="notif-message">{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="notification-footer">
            <button className="view-all-btn" onClick={() => setShowAll(true)}>View Previous Notifications</button>
          </div>
        )}
      </div>
    </div>
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
        <li role="menuitem"><Link to="/settings" onClick={(e)=>{ e.preventDefault(); setOpen(false); history.push('/settings'); setTimeout(()=>{ try{ window.scrollTo({top:0, behavior:'smooth'});}catch(_){ window.scrollTo(0,0);} }, 120); }}>Settings</Link></li>
        <li role="menuitem"><Link to="/user-manual" onClick={(e)=>{ e.preventDefault(); setOpen(false); history.push('/user-manual'); setTimeout(()=>{ try{ window.scrollTo({top:0, behavior:'smooth'});}catch(_){ window.scrollTo(0,0);} }, 120); }}>User Manual</Link></li>
        <li role="menuitem"><button className="link-like" onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
}
