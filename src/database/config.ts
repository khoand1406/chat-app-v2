import { Connection, ConnectionConfiguration } from 'tedious';

const config: ConnectionConfiguration= {
  server: 'DESKTOP-Q6BEF3C',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    database: 'ChatApp',
  },
  authentication: {
    type: 'default',
    options: {
      userName: 'khoand',
      password: '12345',
    },
  },
};

export const connection = new Connection(config);

connection.on('connect', (err) => {
  if (err) console.error('DB connection error:', err);
  else console.log('✅ Connected to MSSQL');
});

connection.connect();