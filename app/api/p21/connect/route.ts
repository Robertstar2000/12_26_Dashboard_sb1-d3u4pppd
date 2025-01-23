import { NextResponse } from 'next/server';
import { sqliteClient } from '@/lib/db/sqlite-config';

export async function POST(request: Request) {
  try {
    const connections = await request.json();

    // Store connection settings in admin_variables table
    sqliteClient.execute({
      sql: `
        INSERT INTO admin_variables (name, value)
        VALUES 
          ('p21_host', ?),
          ('p21_database', ?),
          ('p21_username', ?),
          ('p21_password', ?)
        ON CONFLICT(name) DO UPDATE SET
          value = excluded.value
      `,
      args: [
        connections.p21.host,
        connections.p21.database,
        connections.p21.username,
        connections.p21.password
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing P21 connection:', error);
    return NextResponse.json(
      { error: 'Failed to store P21 connection settings' },
      { status: 500 }
    );
  }
}
