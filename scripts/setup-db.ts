import initializeDatabase from '../lib/db/init-db';

console.log('Initializing database...');
initializeDatabase().catch(console.error);
