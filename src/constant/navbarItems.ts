export const navbarItems = [
  {
    name: 'Network',
    to: '/networks',
    items: [
      {label: 'Networks', to: '/networks'},
      {
        label: 'Regions',
        to: '/regions',
      },
      {label: 'Stations', to: '/stations'},
      {label: 'Links', to: '/links'},
      {label: 'Map View', to: '/map'},
    ],
  },
  {
    name: 'Configuration',
    to: '/configuration',
    items: [
      {
        label: 'System Settings',
        to: '/system-settings',
      },
      {
        label: 'Alarm Types',
        to: '/alarm-types',
      },
      {
        label: 'Optical Routes',
        to: '/optical-routes',
      },
      {
        label: 'Remote Test Units',
        to: '/remote-test-units',
      },
      {
        label: 'All RTU Status',
        to: '/all-rtu-status',
      },
      {label: 'Threshold Settings', to: '/threshold-settings'},
      {label: 'System Maintenance', to: '/system-maintenance'},
    ],
  },
  {
    name: 'Monitoring',
    to: '/monitoring',
    items: [
      {label: 'Alarms', to: '/alarms'},
      {
        label: 'Status',
        to: '/status',
      },
      {
        label: 'RTU Logs',
        to: '/rtu-logs',
      },
      {
        label: 'Test on Demand',
        to: '/test-on-demand',
      },
    ],
  },
  {
    name: 'Reporting',
    to: '/reporting',
    items: [
      {label: 'Result Browser', to: '/result-browser'},
      {label: 'Reports', to: '/reports'},
      {label: 'Report Schedule', to: '/report-schedule'},
      {label: 'Dashboard', to: '/dashboard'},
    ],
  },
  {
    name: 'User Management',
    to: '/user-management',
    items: [
      {label: 'Users', to: '/users'},
      {label: 'User Groups', to: '/user-groups'},
      {label: 'Duty Schedules', to: '/duty-schedules'},
    ],
  },
  {
    name: 'Help',
    to: '/help',
    items: [
      {label: 'Licensing', to: '/licensing'},
      {label: 'About', to: '/about'},
    ],
  },
];
