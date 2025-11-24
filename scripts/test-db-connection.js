require('dotenv/config');
const { Client } = require('pg');

const url = process.env.DATABASE_URL;
console.log('Using DATABASE_URL:', url);

(async () => {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log('PG connected successfully');
    const res = await client.query('SELECT NOW() as now');
    console.log('Query result:', res.rows[0]);
  } catch (err) {
    console.error('PG connection error:', err);
    process.exitCode = 1;
  } finally {
    try { await client.end(); } catch(e){}
  }
})();
