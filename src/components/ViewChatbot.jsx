import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { mockRecords } from '../data/Matrix';
import './ViewChatbot.css';

function buildRiskCounts() {
  return mockRecords.reduce(
    (acc, item) => {
      const level = (item.riskLevel || 'UNKNOWN').toUpperCase();
      acc[level] = (acc[level] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { total: 0 }
  );
}

function getViewSummary(pathname) {
  const risk = buildRiskCounts();

  if (pathname.startsWith('/home')) {
    return [
      'Home summary:',
      '- 12 endpoints, 9 PCs online (75%).',
      '- 2 servers online and firewall is online.',
      '- 42 successful backups reported.',
      `- Risk distribution: ${risk.EXTREME || 0} EXTREME, ${risk.HIGH || 0} HIGH, ${risk.MEDIUM || 0} MEDIUM, ${risk.LOW || 0} LOW.`
    ].join('\n');
  }

  if (pathname.startsWith('/computer')) {
    return [
      'Computer monitoring summary:',
      '- Total endpoints: 12 (9 online, 3 offline).',
      '- Revenue Building: 4 online, 0 offline.',
      '- VAWC Building: 1 online, 2 offline.',
      '- Legislative Building: 4 online, 1 offline.'
    ].join('\n');
  }

  if (pathname.startsWith('/risk-assessment')) {
    return [
      'Risk assessment summary:',
      `- Total risk records: ${risk.total}.`,
      `- EXTREME: ${risk.EXTREME || 0}`,
      `- HIGH: ${risk.HIGH || 0}`,
      `- MEDIUM: ${risk.MEDIUM || 0}`,
      `- LOW: ${risk.LOW || 0}`
    ].join('\n');
  }

  if (pathname.startsWith('/server-status')) {
    return [
      'Infrastructure summary:',
      '- Server Ubuntu-Server-01 is online (CPU 23.5%, memory 38.2/64 GB, disk 847/2000 GB).',
      '- Router MikroTik RB750Gr3 is online (CPU 19.2%, memory 84/256 MB).',
      '- Throughput shown for WAN and LAN in/out traffic.'
    ].join('\n');
  }

  if (pathname.startsWith('/backup/history')) {
    return [
      'Backup history summary:',
      '- 6 mock backup records are available across multiple dates.',
      '- Backup types include automatic and manual entries.',
      '- Date filtering supports quick restore and delete actions.'
    ].join('\n');
  }

  if (pathname.startsWith('/backup')) {
    return [
      'Backup management summary:',
      '- Storage used: 12.4 GB.',
      '- Total backups: 5.',
      '- Success rate: 80%.',
      '- Auto-backup settings: enabled by default (daily at 17:00).'
    ].join('\n');
  }

  if (pathname.startsWith('/firewall/monitor')) {
    return [
      'Firewall monitor summary:',
      '- 10 active firewall rules are configured.',
      '- 15 recent blocked connection attempts are listed.',
      '- Protocol distribution: TCP 45%, UDP 25%, ICMP 10%, HTTP/HTTPS 15%, Other 5%.'
    ].join('\n');
  }

  if (pathname.startsWith('/settings')) {
    return [
      'Settings summary:',
      '- Notification toggles are enabled by default.',
      '- Auto-refresh is enabled with a 30-second interval.',
      '- Session timeout is set to 60 minutes.',
      '- Dark mode and display preferences can be changed here.'
    ].join('\n');
  }

  if (pathname.startsWith('/user-manual')) {
    return [
      'User manual summary:',
      '- Contains sections for onboarding, monitoring, firewall, backups, settings, and troubleshooting.',
      '- Includes a download interaction with status notifications.'
    ].join('\n');
  }

  return 'I can summarize this page. Ask: Summarize this view.';
}

function getGlobalSummary() {
  const risk = buildRiskCounts();
  return [
    'Dashboard-wide summary:',
    '- Endpoints: 12 total, 9 online, 3 offline.',
    '- Infrastructure: server and router are online.',
    '- Backup posture: 5 backups, 80% success, 12.4 GB used.',
    '- Firewall posture: 10 active rules, 15 recent blocked attempts.',
    `- Risk posture: ${risk.total} total records (${risk.EXTREME || 0} EXTREME, ${risk.HIGH || 0} HIGH, ${risk.MEDIUM || 0} MEDIUM, ${risk.LOW || 0} LOW).`
  ].join('\n');
}

function resolveBotResponse(input, pathname) {
  const text = (input || '').toLowerCase();

  if (
    text.includes('all') ||
    text.includes('overall') ||
    text.includes('dashboard') ||
    text.includes('global')
  ) {
    return getGlobalSummary();
  }

  if (text.includes('home')) return getViewSummary('/home');
  if (text.includes('computer')) return getViewSummary('/computer');
  if (text.includes('risk')) return getViewSummary('/risk-assessment');
  if (text.includes('server') || text.includes('infrastructure')) return getViewSummary('/server-status');
  if (text.includes('firewall')) return getViewSummary('/firewall/monitor');
  if (text.includes('backup history')) return getViewSummary('/backup/history');
  if (text.includes('backup')) return getViewSummary('/backup');
  if (text.includes('setting')) return getViewSummary('/settings');
  if (text.includes('manual')) return getViewSummary('/user-manual');

  if (
    text.includes('summary') ||
    text.includes('summarize') ||
    text.includes('this view') ||
    text.includes('this page')
  ) {
    return getViewSummary(pathname);
  }

  return 'Try one of these: Summarize this view, Summarize firewall monitor, or Give me overall dashboard summary.';
}

export default function ViewChatbot() {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const shouldHide = useMemo(() => pathname === '/', [pathname]);

  const [messages, setMessages] = useState([
    {
      id: 'greeting',
      role: 'bot',
      text: 'I am your dashboard assistant. Ask me to summarize this view or the whole dashboard.'
    }
  ]);

  useEffect(() => {
    if (shouldHide) return;

    setMessages((prev) => {
      const hasCurrentRouteHint = prev.some((m) => m.id === `route-${pathname}`);
      if (hasCurrentRouteHint) return prev;

      return [
        ...prev,
        {
          id: `route-${pathname}`,
          role: 'bot',
          text: `You are viewing ${pathname}. Ask: Summarize this view.`
        }
      ];
    });
  }, [pathname, shouldHide]);

  if (shouldHide) {
    return null;
  }

  function pushUserAndBotMessage(userText, botText) {
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text: userText },
      { id: `b-${Date.now()}-${Math.random()}`, role: 'bot', text: botText }
    ]);
  }

  function sendPrompt(userText) {
    const localResponse = resolveBotResponse(userText, pathname);
    setIsLoading(true);

    window.setTimeout(() => {
      pushUserAndBotMessage(userText, localResponse);
      setIsLoading(false);
    }, 180);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    sendPrompt(trimmed);
    setInput('');
  }

  function handleQuickAction(action) {
    if (isLoading) return;
    sendPrompt(action);
  }

  return (
    <div className="view-chatbot-shell" aria-live="polite">
      {isOpen && (
        <section className="view-chatbot-panel" role="dialog" aria-label="View summary chatbot">
          <header className="view-chatbot-header">
            <div>
              <h3>AI View Summary</h3>
              <p>Context-aware dashboard assistant</p>
            </div>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              x
            </button>
          </header>

          <div className="view-chatbot-quick-actions">
            <button type="button" onClick={() => handleQuickAction('Summarize this view')} disabled={isLoading}>
              This view
            </button>
            <button type="button" onClick={() => handleQuickAction('Overall dashboard summary')} disabled={isLoading}>
              Overall
            </button>
            <button type="button" onClick={() => handleQuickAction('Summarize firewall monitor')} disabled={isLoading}>
              Firewall
            </button>
          </div>

          {isLoading && (
            <div className="view-chatbot-loading">Thinking...</div>
          )}

          <div className="view-chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`msg-row ${message.role === 'user' ? 'user' : 'bot'}`}
              >
                <div className="msg-bubble">
                  {message.text.split('\n').map((line, index) => (
                    <p key={`${message.id}-${index}`}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form className="view-chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a view summary..."
              aria-label="Chat input"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Send'}</button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="view-chatbot-fab"
        hidden={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Hide chatbot' : 'Open chatbot'}
      >
        Chat
      </button>
    </div>
  );
}
