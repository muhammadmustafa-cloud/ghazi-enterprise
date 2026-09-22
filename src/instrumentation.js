export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { ensureDbReady } = await import('./lib/initDb');
      await ensureDbReady();
      console.log('✅ Database ready');
    } catch (err) {
      console.warn('⚠️  Database init failed — dev server will still start.');
      console.warn(`   ${err.message}`);
      console.warn('   Check DB_HOST / network in .env (Aiven dashboard → current hostname).');
    }
  }
}
