import { sqliteClient } from './sqlite-config';

function generateRandomChange() {
  return (Math.random() * 10 - 5).toFixed(1);
}

function generateRandomTrend() {
  const rand = Math.random();
  return rand > 0.6 ? 'up' : rand > 0.3 ? 'down' : 'neutral';
}

function generateMonthlyDates(months: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setDate(1); // Set to first day of month
  
  for (let i = 0; i < months; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function generateDailyDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Generate dates
    const monthlyDates = generateMonthlyDates(12); // Last 12 months
    const dailyDates = generateDailyDates(7); // Last 7 days

    // Seed metrics table with initial data
    console.log('Seeding metrics table...');
    sqliteClient.execute(`
      INSERT OR REPLACE INTO metrics (name, value, change, trend)
      VALUES 
        ('total_orders', 12847, ${generateRandomChange()}, '${generateRandomTrend()}'),
        ('open_orders', 1563, ${generateRandomChange()}, '${generateRandomTrend()}'),
        ('in_process', 892, ${generateRandomChange()}, '${generateRandomTrend()}'),
        ('weekly_revenue', 1924500, ${generateRandomChange()}, '${generateRandomTrend()}'),
        ('open_invoices', 3842650, ${generateRandomChange()}, '${generateRandomTrend()}'),
        ('orders_backlogged', 743, ${generateRandomChange()}, '${generateRandomTrend()}'),
        ('total_sales_monthly', 8325000, ${generateRandomChange()}, '${generateRandomTrend()}')
    `);

    // Clear existing data from tables
    sqliteClient.execute('DELETE FROM historical_data');
    sqliteClient.execute('DELETE FROM accounts_payable');
    sqliteClient.execute('DELETE FROM customers');
    sqliteClient.execute('DELETE FROM site_distribution');
    sqliteClient.execute('DELETE FROM daily_shipments');

    // Seed historical_data table with monthly data
    console.log('Seeding historical_data table...');
    monthlyDates.forEach(date => {
      const p21Value = 1000000 + Math.random() * 500000;
      const porValue = 700000 + Math.random() * 300000;
      sqliteClient.execute({
        sql: `
          INSERT OR REPLACE INTO historical_data (date, p21, por)
          VALUES (?, ?, ?)
        `,
        args: [date, p21Value.toFixed(0), porValue.toFixed(0)]
      });
    });

    // Seed accounts_payable table with monthly data
    console.log('Seeding accounts_payable table...');
    monthlyDates.forEach(date => {
      const total = 400000 + Math.random() * 100000;
      const overdue = 50000 + Math.random() * 50000;
      sqliteClient.execute({
        sql: `
          INSERT OR REPLACE INTO accounts_payable (date, total, overdue)
          VALUES (?, ?, ?)
        `,
        args: [date, total.toFixed(0), overdue.toFixed(0)]
      });
    });

    // Seed customers table with monthly data
    console.log('Seeding customers table...');
    monthlyDates.forEach(date => {
      const newCustomers = Math.floor(20 + Math.random() * 10);
      const prospects = Math.floor(140 + Math.random() * 20);
      sqliteClient.execute({
        sql: `
          INSERT OR REPLACE INTO customers (date, new_customers, prospects)
          VALUES (?, ?, ?)
        `,
        args: [date, newCustomers, prospects]
      });
    });

    // Seed products table
    console.log('Seeding products table...');
    sqliteClient.execute(`
      INSERT OR REPLACE INTO products (name, value, category)
      VALUES 
        ('Product A', ${120000 + Math.random() * 10000}, 'online'),
        ('Product B', ${80000 + Math.random() * 10000}, 'inside'),
        ('Product C', ${190000 + Math.random() * 10000}, 'outside')
    `);

    // Seed site_distribution table with only 2 entries
    console.log('Seeding site_distribution table...');
    const siteDistributionDates = monthlyDates.slice(0, 2);
    siteDistributionDates.forEach(date => {
      const columbus = 400000 + Math.random() * 100000;
      const addison = 350000 + Math.random() * 60000;
      const lakeCity = 250000 + Math.random() * 80000;
      sqliteClient.execute({
        sql: `
          INSERT OR REPLACE INTO site_distribution (date, columbus, addison, lake_city)
          VALUES (?, ?, ?, ?)
        `,
        args: [date, columbus.toFixed(0), addison.toFixed(0), lakeCity.toFixed(0)]
      });
    });

    // Seed daily_shipments table with 7 days of data
    console.log('Seeding daily_shipments table...');
    dailyDates.forEach(date => {
      const shipments = Math.floor(230 + Math.random() * 20);
      sqliteClient.execute({
        sql: `
          INSERT OR REPLACE INTO daily_shipments (date, shipments)
          VALUES (?, ?)
        `,
        args: [date, shipments]
      });
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export default seedDatabase;

// Call the function when this file is run directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
