import Database from 'better-sqlite3';

let db: Database.Database | null = null;

// This code will only run on the server side
const initializeDb = () => {
  if (!db) {
    try {
      db = new Database('local.db');
      // Enable foreign keys
      db.pragma('foreign_keys = ON');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return db;
};

export const sqliteClient = {
  execute: (query: string | { sql: string; args?: any[] }) => {
    const database = initializeDb();
    
    try {
      if (typeof query === 'string') {
        // For SELECT queries
        if (query.trim().toLowerCase().startsWith('select')) {
          return database.prepare(query).all();
        }
        // For other queries (INSERT, UPDATE, DELETE, CREATE, etc.)
        return database.prepare(query).run();
      } else {
        // For parameterized queries
        if (query.sql.trim().toLowerCase().startsWith('select')) {
          return database.prepare(query.sql).all(query.args || []);
        }
        return database.prepare(query.sql).run(query.args || []);
      }
    } catch (error) {
      console.error('SQLite error:', error);
      throw error;
    }
  },
  
  getTables: () => {
    const database = initializeDb();
    return database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  },
  
  getTableSchema: (tableName: string) => {
    const database = initializeDb();
    return database.prepare(`PRAGMA table_info(${tableName})`).all();
  }
};
