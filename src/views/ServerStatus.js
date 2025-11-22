import React from 'react';
import Header from '../components/Header';
import './Computer.css';
import './ServerStatus.css';

export default function ServerStatus() {
  const server = {
    name: 'Ubuntu-Server-01',
    subtitle: 'Ubuntu 22.04 LTS (Jammy Jellyfish)',
    status: 'online',
    ip: '192.168.1.5',
    uptime: '47 days, 12 hours',
    cpu: 23.5,
    memory: { usedGB: 38.2, totalGB: 64 },
    disk: { usedGB: 847, totalGB: 2000 },
    netIn: '156.3 MB/s',
    netOut: '89.7 MB/s',
    specs: {
      cpu: 'Intel Xeon E5-2680 v4',
      memory: '64 GB DDR4',
      storage: '2 TB NVMe SSD',
      network: '10 Gigabit Ethernet'
    },
    system: {
      kernel: '5.15.0-91-generic',
      arch: 'x86_64',
      virt: 'KVM',
      lastBoot: '2024-09-18 14:23:15',
      loadAvg: '2.34, 2.18, 2.05',
      processes: '287 running'
    }
  };

  const pct = (used, total) => Math.round((used / total) * 1000) / 10;

  return (
    <div className="dashboard-root">
      <Header active="server-status" />

      <div className="hero-row">
        <div className="page-hero">
          <div className="hero-text">
            <h2>Server Status</h2>
            <p>Real-time monitoring of server infrastructure</p>
          </div>
        </div>

        <div className="external-refresh">
          <button className="refresh-btn">Refresh ↻</button>
        </div>
      </div>

      {/* stats cards removed for Server Status as requested */}

      <main className="buildings-col">
        <article className="building">
          <div className="server-card">
          <header className="server-head">
            <div>
              <h2 className="server-name">{server.name}</h2>
              <div className="server-sub">{server.subtitle} <span className={`server-badge ${server.status}`}>{server.status}</span></div>
            </div>
            <div className="server-meta">
              <div>IP Address<br/><strong>{server.ip}</strong></div>
              <div>Uptime<br/><strong>{server.uptime}</strong></div>
            </div>
          </header>

          <section className="specs-grid">
            <div className="spec">
              <h4>Processor</h4>
              <p>{server.specs.cpu}</p>
            </div>
            <div className="spec">
              <h4>Memory</h4>
              <p>{server.specs.memory}</p>
            </div>
            <div className="spec">
              <h4>Storage</h4>
              <p>{server.specs.storage}</p>
            </div>
            <div className="spec">
              <h4>Network</h4>
              <p>{server.specs.network}</p>
            </div>
          </section>

          <section className="metrics">
            <h3>Performance Metrics</h3>
            <div className="metric">
              <div className="metric-row">
                <span>CPU Usage</span>
                <span className="metric-value">{server.cpu}%</span>
              </div>
              <div className="metric-bar"><div className="metric-fill cpu" style={{width:`${server.cpu}%`}}/></div>
            </div>

            <div className="metric">
              <div className="metric-row">
                <span>Memory Usage</span>
                <span className="metric-value">{server.memory.usedGB} GB / {server.memory.totalGB} GB ({pct(server.memory.usedGB, server.memory.totalGB)}%)</span>
              </div>
              <div className="metric-bar"><div className="metric-fill mem" style={{width:`${pct(server.memory.usedGB, server.memory.totalGB)}%`}}/></div>
            </div>

            <div className="metric">
              <div className="metric-row">
                <span>Disk Usage</span>
                <span className="metric-value">{server.disk.usedGB} GB / {server.disk.totalGB} GB ({pct(server.disk.usedGB, server.disk.totalGB)}%)</span>
              </div>
              <div className="metric-bar"><div className="metric-fill disk" style={{width:`${pct(server.disk.usedGB, server.disk.totalGB)}%`}}/></div>
            </div>

            <div className="network-row">
              <div className="net-box">
                <div className="net-label">Network In</div>
                <div className="net-value">{server.netIn}</div>
              </div>
              <div className="net-box">
                <div className="net-label">Network Out</div>
                <div className="net-value">{server.netOut}</div>
              </div>
            </div>
          </section>

          <section className="system-info">
            <h4>System Information</h4>
            <div className="info-grid">
              <div><strong>Kernel Version</strong><div>{server.system.kernel}</div></div>
              <div><strong>Architecture</strong><div>{server.system.arch}</div></div>
              <div><strong>Virtualization</strong><div>{server.system.virt}</div></div>
              <div><strong>Last Boot</strong><div>{server.system.lastBoot}</div></div>
              <div><strong>Load Average</strong><div>{server.system.loadAvg}</div></div>
              <div><strong>Processes</strong><div>{server.system.processes}</div></div>
            </div>
          </section>
          </div>
        </article>
      </main>
    </div>
  );
}
