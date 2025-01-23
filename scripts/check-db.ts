import { sqliteClient } from '../lib/db/sqlite-config';

interface TableInfo {
  name: string;
}

async function checkDatabase() {
  try {
    console.log('Tables in the database:');
    const tables = sqliteClient.getTables() as TableInfo[];
    console.log(tables);

    for (const table of tables) {
      console.log(`\nSchema for table ${table.name}:`);
      const schema = sqliteClient.getTableSchema(table.name);
      console.log(schema);

      console.log(`\nContents of table ${table.name}:`);
      const contents = sqliteClient.execute(`SELECT * FROM ${table.name}`);
      console.log(contents);
    }
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
