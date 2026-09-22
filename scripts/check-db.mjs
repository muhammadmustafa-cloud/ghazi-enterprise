import dns from 'dns/promises';
import mysql from 'mysql2/promise';

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT) || 3306;

console.log('DB_HOST:', host);
console.log('DB_PORT:', port);
console.log('DB_SSL:', process.env.DB_SSL);

try {
  const { address } = await dns.lookup(host);
  console.log('✅ DNS resolved →', address);
} catch (e) {
  console.error('❌ DNS failed (ENOTFOUND):', e.message);
  console.error('');
  console.error('This is not a Next.js bug. Fix:');
  console.error('  1. Aiven Console → MySQL → Status must be RUNNING');
  console.error('  2. Copy Host again from Connection information');
  console.error('  3. ipconfig /flushdns  then retry');
  console.error('  4. Try phone hotspot or another network');
  console.error('  5. Or use local MySQL: DB_HOST=localhost DB_SSL=false');
  process.exit(1);
}

try {
  const conn = await mysql.createConnection({
    host,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  await conn.ping();
  console.log('✅ MySQL connected');
  await conn.end();
} catch (e) {
  console.error('❌ MySQL connection failed:', e.message);
  process.exit(1);
}
