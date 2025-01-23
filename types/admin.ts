export interface AdminVariable {
  id: number;
  name: string;
  value?: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  chartGroup?: string;
  date?: string;
  
  // Historical Data
  p21?: number;
  por?: number;
  
  // Accounts Payable
  total?: number;
  overdue?: number;
  
  // Customers
  newCustomers?: number;
  prospects?: number;
  
  // Site Distribution
  columbus?: number;
  addison?: number;
  lakeCity?: number;
  
  // Daily Shipments
  shipments?: number;
}

export interface DatabaseConnections {
  p21: {
    host: string;
    database: string;
    username: string;
    password: string;
  };
}
