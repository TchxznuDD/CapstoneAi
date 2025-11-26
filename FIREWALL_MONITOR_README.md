# Firewall Monitor Dashboard

## Overview
A comprehensive read-only firewall monitoring dashboard built with React that displays real-time firewall activity, blocked threats, and network statistics using mock data.

## Features

### 1. **Active Firewall Rules Table**
- Displays all configured firewall rules
- Columns: Rule Name, Source IP, Destination IP, Port, Protocol, Action (Allow/Block), Status
- Color-coded action badges (green for ALLOW, red for BLOCK)
- Protocol badges with distinct colors (TCP, UDP, ICMP, etc.)
- 10 pre-configured rules including SSH, HTTP/HTTPS, DNS, and security rules

### 2. **Blocked Connection Attempts Table**
- Real-time monitoring of blocked connection attempts
- Columns: Time, Source IP, Destination IP, Port, Protocol, Reason
- 15 mock blocked connection records
- Color-coded malicious IPs in red
- Common blocking reasons: SSH brute-force, blacklisted IPs, Telnet blocking, etc.

### 3. **Advanced Filtering System**
- Filter by Source IP address
- Filter by Destination IP address
- Date range filtering (From/To dates)
- Real-time filter results counter
- Clear filters button
- Filters apply only to blocked connections table

### 4. **Bandwidth Usage Visualization**
Uses **Chart.js** and **react-chartjs-2** for professional charts:

#### a) **Bandwidth Usage Chart (Line Chart)**
- 24-hour traffic visualization
- Inbound and Outbound traffic tracking
- Time series data with 2-hour intervals
- Interactive tooltips showing exact values
- Dual-axis display for comparison

#### b) **Protocol Distribution Chart (Doughnut Chart)**
- Visual breakdown of traffic by protocol
- Categories: TCP, UDP, ICMP, HTTP/HTTPS, Other
- Color-coded segments with percentages
- Interactive legend

#### c) **Blocked Attempts by Reason Chart (Bar Chart)**
- Top reasons for blocking connections
- Categories: SSH Brute-Force, Blacklisted IP, Telnet Blocked, Unauthorized Port, Rate Limit
- Sorted by frequency
- Red color scheme for security emphasis

### 5. **Statistics Overview**
Four stat cards displaying:
- **Active Rules**: Number of active rules out of total
- **Blocked Today**: Total blocked connection attempts
- **Unique Attackers**: Count of distinct malicious IP addresses
- **Allow/Block Rules**: Breakdown of rule types

### 6. **Refresh Functionality**
- Manual refresh button with icon
- Reloads all mock data
- Updates "Last updated" timestamp
- Success notification on refresh

### 7. **Responsive Design**
- Desktop-optimized layout (1200px+)
- Tablet support (768px - 1200px)
- Mobile-friendly (< 768px)
- Adaptive grid layouts
- Horizontal scroll for tables on small screens

## Technical Stack

### Dependencies
```json
{
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "react-router-dom": "^5.2.0",
  "chart.js": "latest",
  "react-chartjs-2": "latest"
}
```

### File Structure
```
src/
├── views/
│   ├── FirewallMonitor.js    # Main dashboard component
│   └── FirewallMonitor.css   # Styling for dashboard
├── components/
│   └── Header.js             # Navigation header
└── index.js                  # Routing configuration
```

## Component Architecture

### FirewallMonitor Component
Main functional component with the following features:

**State Management:**
- `rules` - Active firewall rules (10 items)
- `blockedConnections` - Blocked attempts (15 items)
- `filters` - Filter state (sourceIP, destIP, dateFrom, dateTo)
- `notification` - Toast notification state
- `lastRefresh` - Last refresh timestamp

**Key Functions:**
1. `handleRefresh()` - Reloads mock data
2. `handleFilterChange(e)` - Updates filter state
3. `getFilteredBlockedConnections()` - Applies filters to data
4. `handleClearFilters()` - Resets all filters
5. `showNotification(message, type)` - Displays toast messages

**Chart.js Setup:**
- Registers required Chart.js components (CategoryScale, LinearScale, etc.)
- Configures responsive options
- Custom color schemes matching the design system

## Mock Data Structure

### Firewall Rules
```javascript
{
  id: number,
  ruleName: string,
  sourceIP: string,
  destIP: string,
  port: string,
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL',
  action: 'ALLOW' | 'BLOCK',
  status: 'Active'
}
```

### Blocked Connections
```javascript
{
  id: number,
  time: string,           // Format: 'YYYY-MM-DD HH:MM:SS'
  sourceIP: string,
  destIP: string,
  port: string,
  protocol: 'TCP' | 'UDP' | 'ICMP',
  reason: string
}
```

### Bandwidth Data
```javascript
{
  labels: string[],       // Time labels
  datasets: [{
    label: string,
    data: number[],       // Mbps values
    borderColor: string,
    backgroundColor: string
  }]
}
```

## Styling Features

### Color Scheme
- **Primary Orange**: `#ff7b00` (buttons, highlights)
- **Success Green**: `#0b8f36` (allow rules, success messages)
- **Error Red**: `#d62828` (block rules, blocked IPs)
- **Warning Orange**: `#ff9800` (warnings)
- **Blue**: `#36a2eb` (TCP protocol)
- **Yellow**: `#d89e00` (UDP protocol)
- **Purple**: `#9966ff` (ICMP protocol)

### Design Patterns
- **Card-based layout** with subtle shadows
- **Gradient backgrounds** for stat icons
- **Hover effects** on interactive elements
- **Smooth transitions** (140ms - 300ms)
- **Professional badges** for protocols and actions
- **Monospace fonts** for IP addresses and codes

## Usage

### Accessing the Dashboard
Navigate to `/firewall/monitor` in your application.

### Using Filters
1. Enter Source IP or Destination IP in the filter fields
2. Select date range using Date From and Date To
3. Click "Clear Filters" to reset
4. Filter results show count of matched connections

### Reading Charts
- **Bandwidth Chart**: Hover over lines to see exact Mbps values
- **Protocol Distribution**: Click legend items to toggle protocol visibility
- **Blocked Attempts**: Hover bars to see exact counts

### Refreshing Data
Click the "Refresh" button in the top-right to reload all mock data.

## Customization

### Adding New Rules
Edit `mockFirewallRules` array in `FirewallMonitor.js`:
```javascript
const mockFirewallRules = [
  {
    id: 11,
    ruleName: 'Your Rule Name',
    sourceIP: '0.0.0.0/0',
    destIP: '192.168.1.5',
    port: '8080',
    protocol: 'TCP',
    action: 'ALLOW',
    status: 'Active'
  },
  // ... existing rules
];
```

### Adding Blocked Connections
Edit `mockBlockedConnections` array:
```javascript
const mockBlockedConnections = [
  {
    id: 16,
    time: '2025-11-27 15:00:00',
    sourceIP: '1.2.3.4',
    destIP: '192.168.1.5',
    port: '22',
    protocol: 'TCP',
    reason: 'Your reason here'
  },
  // ... existing connections
];
```

### Modifying Charts
Charts use Chart.js configuration objects. To customize:

1. **Change colors**: Edit `backgroundColor` and `borderColor` in datasets
2. **Update data**: Modify the `data` arrays in chart objects
3. **Add options**: Extend the `options` object in chart components

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- IE11 not supported (requires polyfills)

## Performance Notes
- Mock data embedded in component (no API calls)
- Chart.js renders efficiently with hardware acceleration
- Tables support up to 100 rows without pagination
- Filtering is client-side and instant

## Future Enhancements (When Connecting to Real API)
1. Replace mock data with API endpoints
2. Add real-time WebSocket updates
3. Implement pagination for large datasets
4. Add export functionality (CSV, PDF)
5. Include date range presets (Today, Last 7 days, etc.)
6. Add rule editing capabilities
7. Implement sorting on table columns
8. Add search functionality
9. Include notification system for critical events
10. Add historical data comparison

## Testing the UI
1. Navigate to `/firewall/monitor`
2. Verify all 4 stat cards display correctly
3. Check all 3 charts render properly
4. Test filter functionality with sample IPs
5. Click refresh and verify timestamp updates
6. Test responsive design by resizing browser
7. Verify table scrolling on small screens
8. Check toast notifications appear on refresh/filter actions

## Notes
- All data is **read-only** - no modifications possible
- No actual firewall integration - purely visual dashboard
- Perfect for demonstrations, mockups, and UI testing
- Fully responsive and production-ready styling
