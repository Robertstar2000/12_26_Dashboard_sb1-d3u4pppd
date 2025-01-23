'use client';

import { DatabaseConnections, DatabaseConnectionState, AdminVariable } from '@/lib/types/dashboard';
import { useState } from 'react';
import { sqliteClient } from './sqlite-config';

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private sqlitePool = sqliteClient;
  private connectionState: DatabaseConnectionState = {
    isConnected: false,
    p21Connected: false,
    porConnected: false
  };

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async connect(connections: DatabaseConnections): Promise<DatabaseConnectionState> {
    try {
      // Test SQLite connection
      await this.sqlitePool.execute('SELECT 1');
      
      // Set all connection states to true since we're using a single SQLite database
      this.connectionState = {
        isConnected: true,
        p21Connected: true,
        porConnected: true
      };
      
      return { ...this.connectionState };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database connection error';
      this.connectionState = {
        isConnected: false,
        p21Connected: false,
        porConnected: false,
        lastError: errorMessage
      };
      throw new DatabaseError(errorMessage);
    }
  }

  public async disconnect(): Promise<void> {
    // Clean up connections
    this.connectionState = {
      isConnected: false,
      p21Connected: false,
      porConnected: false
    };
  }

  public async executeQuery(dictionary: string, query: string): Promise<any> {
    if (!this.connectionState.isConnected) {
      throw new DatabaseError('No active database connection');
    }

    try {
      // Execute the query using SQLite connection
      const result = await this.sqlitePool.execute(query);
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown query execution error';
      throw new DatabaseError(`Query execution failed: ${errorMessage}`);
    }
  }

  public getConnectionState(): DatabaseConnectionState {
    return { ...this.connectionState };
  }
}

export function useDatabase() {
  const [connectionState, setConnectionState] = useState<DatabaseConnectionState>({
    isConnected: false,
    p21Connected: false,
    porConnected: false
  });

  const connect = async (connections: DatabaseConnections) => {
    try {
      const dbManager = DatabaseManager.getInstance();
      const newState = await dbManager.connect(connections);
      setConnectionState(newState);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      setConnectionState({
        isConnected: false,
        p21Connected: false,
        porConnected: false,
        lastError: errorMessage
      });
      throw new DatabaseError(errorMessage);
    }
  };

  const disconnect = async () => {
    const dbManager = DatabaseManager.getInstance();
    await dbManager.disconnect();
    setConnectionState({
      isConnected: false,
      p21Connected: false,
      porConnected: false
    });
  };

  const executeQueries = async (adminData: AdminVariable[]): Promise<AdminVariable[]> => {
    const dbManager = DatabaseManager.getInstance();
    
    if (!connectionState.isConnected) {
      throw new DatabaseError('Database not connected');
    }

    return Promise.all(
      adminData.map(async (item) => {
        try {
          const sqlExpressions = item.sqlExpression.split('-- Second Query ------------------------------------------');
          const primaryValue = await dbManager.executeQuery(item.p21DataDictionary, sqlExpressions[0].trim());
          let secondaryValue = undefined;
          
          if (sqlExpressions.length > 1) {
            secondaryValue = await dbManager.executeQuery(item.p21DataDictionary, sqlExpressions[1].trim());
          }

          return {
            ...item,
            extractedValue: primaryValue,
            secondaryValue: secondaryValue,
            updateTime: new Date().toISOString(),
            connectionState: dbManager.getConnectionState()
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown query execution error';
          return {
            ...item,
            connectionState: {
              ...dbManager.getConnectionState(),
              lastError: errorMessage
            }
          };
        }
      })
    );
  };

  return {
    connectionState,
    connect,
    disconnect,
    executeQueries
  };
}
