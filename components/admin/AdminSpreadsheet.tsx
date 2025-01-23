import React from 'react';
import { AdminVariable } from '@/types/admin';
import { Input } from '@/components/ui/input';

interface AdminSpreadsheetProps {
  data: AdminVariable[];
  onVariableChange: (id: number, field: string, value: string) => void;
}

export default function AdminSpreadsheet({ data, onVariableChange }: AdminSpreadsheetProps) {
  const handleInputChange = (id: number, field: string, value: string) => {
    onVariableChange(id, field, value);
  };

  // Group data by chartGroup
  const groupedData = data.reduce((acc, item) => {
    const group = item.chartGroup || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, AdminVariable[]>);

  const renderTableRow = (variable: AdminVariable, group: string) => {
    switch (group) {
      case 'Metrics':
        return (
          <tr key={variable.id} className="border-b">
            <td className="p-2">{variable.name}</td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.value?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'value', e.target.value)}
                className="w-full"
              />
            </td>
            <td className="p-2">{variable.change}%</td>
            <td className="p-2">
              <span className={`text-${variable.trend === 'up' ? 'green' : 'red'}-500`}>
                {variable.trend}
              </span>
            </td>
          </tr>
        );
      case 'Historical Data':
        return (
          <tr key={variable.id} className="border-b">
            <td className="p-2">{variable.date}</td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.p21?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'p21', e.target.value)}
                className="w-full"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.por?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'por', e.target.value)}
                className="w-full"
              />
            </td>
          </tr>
        );
      case 'Accounts Payable':
        return (
          <tr key={variable.id} className="border-b">
            <td className="p-2">{variable.date}</td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.total?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'total', e.target.value)}
                className="w-full"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.overdue?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'overdue', e.target.value)}
                className="w-full"
              />
            </td>
          </tr>
        );
      case 'Customer Data':
        return (
          <tr key={variable.id} className="border-b">
            <td className="p-2">{variable.date}</td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.newCustomers?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'newCustomers', e.target.value)}
                className="w-full"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.prospects?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'prospects', e.target.value)}
                className="w-full"
              />
            </td>
          </tr>
        );
      case 'Site Distribution':
        return (
          <tr key={variable.id} className="border-b">
            <td className="p-2">{variable.date}</td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.columbus?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'columbus', e.target.value)}
                className="w-full"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.addison?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'addison', e.target.value)}
                className="w-full"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.lakeCity?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'lakeCity', e.target.value)}
                className="w-full"
              />
            </td>
          </tr>
        );
      case 'Daily Shipments':
        return (
          <tr key={variable.id} className="border-b">
            <td className="p-2">{variable.date}</td>
            <td className="p-2">
              <Input
                type="number"
                value={variable.shipments?.toString() || ''}
                onChange={(e) => handleInputChange(variable.id, 'shipments', e.target.value)}
                className="w-full"
              />
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableHeaders = (group: string) => {
    switch (group) {
      case 'Metrics':
        return (
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Value</th>
            <th className="p-2">Change</th>
            <th className="p-2">Trend</th>
          </tr>
        );
      case 'Historical Data':
        return (
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">P21</th>
            <th className="p-2">POR</th>
          </tr>
        );
      case 'Accounts Payable':
        return (
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Total</th>
            <th className="p-2">Overdue</th>
          </tr>
        );
      case 'Customer Data':
        return (
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">New Customers</th>
            <th className="p-2">Prospects</th>
          </tr>
        );
      case 'Site Distribution':
        return (
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Columbus</th>
            <th className="p-2">Addison</th>
            <th className="p-2">Lake City</th>
          </tr>
        );
      case 'Daily Shipments':
        return (
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Shipments</th>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedData).map(([group, variables]) => (
        <div key={group} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold">{group}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                {renderTableHeaders(group)}
              </thead>
              <tbody>
                {variables.map(variable => renderTableRow(variable, group))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}