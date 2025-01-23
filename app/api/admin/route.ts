import { NextResponse } from 'next/server';
import { sqliteClient } from '@/lib/db/sqlite-config';

export async function GET() {
  try {
    console.log('Fetching admin data...');

    // Check table contents
    const tables = ['metrics', 'historical_data', 'accounts_payable', 'customers', 'site_distribution', 'daily_shipments', 'products'];
    tables.forEach(table => {
      const count = sqliteClient.execute(`SELECT COUNT(*) as count FROM ${table}`)[0].count;
      console.log(`${table} count:`, count);
      const sample = sqliteClient.execute(`SELECT * FROM ${table} LIMIT 1`);
      console.log(`${table} sample:`, sample);
    });

    // Fetch metrics
    const metricsData = sqliteClient.execute('SELECT * FROM metrics');
    const metrics = metricsData.map(metric => ({
      id: metric.id,
      name: metric.name,
      value: Number(metric.value),
      change: Number(metric.change),
      trend: metric.trend,
      chartGroup: 'Metrics'
    }));
    
    // Fetch historical data - last 12 months
    const historicalDataRaw = sqliteClient.execute(`
      SELECT * FROM historical_data 
      WHERE date >= date('now', '-12 months') 
      ORDER BY date DESC
    `);
    const historicalData = historicalDataRaw.map(item => ({
      id: item.id,
      name: 'Historical Data',
      date: item.date,
      p21: Number(item.p21),
      por: Number(item.por),
      change: 0,
      trend: 'neutral',
      chartGroup: 'Historical Data'
    }));
    
    // Fetch accounts payable - last 12 months
    const accountsPayableRaw = sqliteClient.execute(`
      SELECT * FROM accounts_payable 
      WHERE date >= date('now', '-12 months') 
      ORDER BY date DESC
    `);
    const accountsPayable = accountsPayableRaw.map(item => ({
      id: item.id,
      name: 'Accounts Payable',
      date: item.date,
      total: Number(item.total),
      overdue: Number(item.overdue),
      change: 0,
      trend: 'neutral',
      chartGroup: 'Accounts Payable'
    }));
    
    // Fetch customers data - last 12 months
    const customersRaw = sqliteClient.execute(`
      SELECT * FROM customers 
      WHERE date >= date('now', '-12 months') 
      ORDER BY date DESC
    `);
    const customers = customersRaw.map(item => ({
      id: item.id,
      name: 'Customer Data',
      date: item.date,
      newCustomers: Number(item.new_customers),
      prospects: Number(item.prospects),
      change: 0,
      trend: 'neutral',
      chartGroup: 'Customer Data'
    }));
    
    // Fetch products data
    const productsRaw = sqliteClient.execute('SELECT * FROM products');
    const products = productsRaw.map(product => ({
      id: product.id,
      name: product.name,
      value: Number(product.value),
      category: product.category,
      change: 0,
      trend: 'neutral',
      chartGroup: 'Products'
    }));
    
    // Fetch site distribution - last 2 entries
    const siteDistributionRaw = sqliteClient.execute(`
      SELECT * FROM site_distribution 
      ORDER BY date DESC LIMIT 2
    `);
    const siteDistribution = siteDistributionRaw.map(item => ({
      id: item.id,
      name: 'Site Distribution',
      date: item.date,
      columbus: Number(item.columbus),
      addison: Number(item.addison),
      lakeCity: Number(item.lake_city),
      change: 0,
      trend: 'neutral',
      chartGroup: 'Site Distribution'
    }));
    
    // Fetch daily shipments - last 7 days
    const dailyShipmentsRaw = sqliteClient.execute(`
      SELECT * FROM daily_shipments 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC
    `);
    const dailyShipments = dailyShipmentsRaw.map(item => ({
      id: item.id,
      name: 'Daily Shipments',
      date: item.date,
      shipments: Number(item.shipments),
      change: 0,
      trend: 'neutral',
      chartGroup: 'Daily Shipments'
    }));

    // Log transformed data
    console.log('Transformed data counts:', {
      metrics: metrics.length,
      historicalData: historicalData.length,
      accountsPayable: accountsPayable.length,
      customers: customers.length,
      products: products.length,
      siteDistribution: siteDistribution.length,
      dailyShipments: dailyShipments.length
    });

    return NextResponse.json({
      metrics,
      historicalData,
      accountsPayable,
      customers,
      products,
      siteDistribution,
      dailyShipments
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
