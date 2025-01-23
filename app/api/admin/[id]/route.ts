import { NextResponse } from 'next/server';
import { sqliteClient } from '@/lib/db/sqlite-config';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updates = await request.json();

    // Update the metric in the database
    sqliteClient.execute({
      sql: `
        UPDATE metrics
        SET value = ?, change = ?, trend = ?
        WHERE id = ?
      `,
      args: [updates.value, updates.change, updates.trend, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating metric:', error);
    return NextResponse.json(
      { error: 'Failed to update metric' },
      { status: 500 }
    );
  }
}
