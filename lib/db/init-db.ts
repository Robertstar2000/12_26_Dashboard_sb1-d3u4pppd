import { sqliteClient } from './sqlite-config';

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Create metrics table
    try {
      console.log('Creating metrics table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          value REAL NOT NULL,
          change REAL DEFAULT 0,
          trend TEXT CHECK(trend IN ('up', 'down', 'neutral')) DEFAULT 'neutral'
        )
      `);
      console.log('Metrics table created successfully');
    } catch (error) {
      console.error('Error creating metrics table:', error);
      throw error;
    }

    // Create historical_data table
    try {
      console.log('Creating historical_data table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS historical_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          p21 REAL NOT NULL,
          por REAL NOT NULL
        )
      `);
      console.log('Historical data table created successfully');
    } catch (error) {
      console.error('Error creating historical_data table:', error);
      throw error;
    }

    // Create accounts_payable table
    try {
      console.log('Creating accounts_payable table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS accounts_payable (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          total REAL NOT NULL,
          overdue REAL NOT NULL
        )
      `);
      console.log('Accounts payable table created successfully');
    } catch (error) {
      console.error('Error creating accounts_payable table:', error);
      throw error;
    }

    // Create customers table
    try {
      console.log('Creating customers table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          new_customers INTEGER NOT NULL,
          prospects INTEGER NOT NULL
        )
      `);
      console.log('Customers table created successfully');
    } catch (error) {
      console.error('Error creating customers table:', error);
      throw error;
    }

    // Create products table
    try {
      console.log('Creating products table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          value REAL NOT NULL,
          category TEXT CHECK(category IN ('online', 'inside', 'outside')) NOT NULL
        )
      `);
      console.log('Products table created successfully');
    } catch (error) {
      console.error('Error creating products table:', error);
      throw error;
    }

    // Create site_distribution table
    try {
      console.log('Creating site_distribution table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS site_distribution (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          columbus REAL NOT NULL,
          addison REAL NOT NULL,
          lake_city REAL NOT NULL
        )
      `);
      console.log('Site distribution table created successfully');
    } catch (error) {
      console.error('Error creating site_distribution table:', error);
      throw error;
    }

    // Create daily_shipments table
    try {
      console.log('Creating daily_shipments table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS daily_shipments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          shipments INTEGER NOT NULL
        )
      `);
      console.log('Daily shipments table created successfully');
    } catch (error) {
      console.error('Error creating daily_shipments table:', error);
      throw error;
    }

    // Create admin_variables table
    try {
      console.log('Creating admin_variables table...');
      sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS admin_variables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          chart_group TEXT NOT NULL,
          calculation TEXT NOT NULL,
          sql_expression TEXT NOT NULL,
          p21_data_dictionary TEXT NOT NULL,
          extracted_value TEXT,
          secondary_value TEXT,
          update_time TEXT,
          historical_date TEXT,
          p21 TEXT,
          por TEXT,
          accounts_payable_date TEXT,
          total TEXT,
          overdue TEXT,
          customers_date TEXT,
          new_customers TEXT,
          prospects TEXT,
          inventory_value_date TEXT,
          inventory TEXT,
          turnover TEXT,
          columbus TEXT,
          addison TEXT,
          lake_city TEXT,
          value TEXT,
          sub_group TEXT
        )
      `);
      console.log('Admin variables table created successfully');
    } catch (error) {
      console.error('Error creating admin_variables table:', error);
      throw error;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export default initializeDatabase;
