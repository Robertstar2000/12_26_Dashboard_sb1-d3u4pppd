'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminVariable, DatabaseConnections } from '@/types/admin';

interface DataItem {
  id: number;
  name: string;
  value?: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  chartGroup?: string;
  date?: string;
  p21?: number;
  por?: number;
  total?: number;
  overdue?: number;
  newCustomers?: number;
  prospects?: number;
  columbus?: number;
  addison?: number;
  lakeCity?: number;
  shipments?: number;
}

export function useAdminData() {
  const [data, setData] = useState<AdminVariable[]>([]);
  const [editedData, setEditedData] = useState<AdminVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isRealTime, setIsRealTime] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: string }>({});
  const [p21Connected, setP21Connected] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch data');
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      // Transform all data into AdminVariable format
      const transformedData: AdminVariable[] = [];

      // Add metrics
      if (Array.isArray(result.metrics)) {
        transformedData.push(...result.metrics);
      }

      // Add historical data
      if (Array.isArray(result.historicalData)) {
        transformedData.push(...result.historicalData);
      }

      // Add accounts payable
      if (Array.isArray(result.accountsPayable)) {
        transformedData.push(...result.accountsPayable);
      }

      // Add customers
      if (Array.isArray(result.customers)) {
        transformedData.push(...result.customers);
      }

      // Add products
      if (Array.isArray(result.products)) {
        transformedData.push(...result.products);
      }

      // Add site distribution
      if (Array.isArray(result.siteDistribution)) {
        transformedData.push(...result.siteDistribution);
      }

      // Add daily shipments
      if (Array.isArray(result.dailyShipments)) {
        transformedData.push(...result.dailyShipments);
      }

      console.log('Transformed data:', transformedData);
      setData(transformedData);
      setEditedData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateVariable = useCallback((id: number, field: string, value: string) => {
    setEditedData(prevData => {
      const newData = [...prevData];
      const index = newData.findIndex(item => item.id === id);
      if (index !== -1) {
        newData[index] = {
          ...newData[index],
          [field]: value
        };
      }
      return newData;
    });

    setPendingChanges(prev => ({
      ...prev,
      [`${id}-${field}`]: value
    }));
  }, []);

  return {
    data,
    editedData,
    loading,
    error,
    isRunning,
    isRealTime,
    pendingChanges,
    p21Connected,
    refresh,
    updateVariable,
    setEditedData,
    setPendingChanges,
    setIsRunning,
    setIsRealTime,
    setP21Connected
  };
}