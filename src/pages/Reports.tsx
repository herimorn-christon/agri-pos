import { useState } from 'react';
import Card from '../components/ui/Card';
import { LineChart, FileSpreadsheet, Download } from 'lucide-react';
import { ReportFilters, ReportData } from '../lib/types';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    category: 'all',
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // In a real app, fetch report data from database
      // For demo, using mock data
      const mockData: ReportData = {
        title: 'Sales Report',
        subtitle: `${filters.dateFrom} to ${filters.dateTo}`,
        columns: [
          { key: 'date', label: 'Date' },
          { key: 'category', label: 'Category' },
          { key: 'product', label: 'Product' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'amount', label: 'Amount' },
        ],
        data: [
          {
            date: '2024-03-10',
            category: 'Livestock',
            product: 'Cattle',
            quantity: 2,
            amount: 2500,
          },
          {
            date: '2024-03-11',
            category: 'Crops',
            product: 'Corn',
            quantity: 500,
            amount: 750,
          },
        ],
        summary: {
          total_sales: 3250,
          total_items: 2,
        },
      };

      setReportData(mockData);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In a real app, implement export functionality
    alert('Export functionality will be implemented here');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Reports
      </h1>

      <Card
        title="Generate Report"
        subtitle="Select parameters to generate your report"
        icon={<LineChart size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="livestock">Livestock</option>
              <option value="crops">Crops</option>
              <option value="inventory">Inventory</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={generateReport}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FileSpreadsheet size={16} className="mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </Card>

      {reportData && (
        <Card
          title={reportData.title}
          subtitle={reportData.subtitle}
          className="mt-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  {reportData.columns.map(column => (
                    <th
                      key={column.key}
                      className="px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-200 dark:border-neutral-700"
                  >
                    {reportData.columns.map(column => (
                      <td
                        key={column.key}
                        className="px-4 py-2 text-neutral-600 dark:text-neutral-400"
                      >
                        {column.key === 'amount' ? `$${row[column.key]}` : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {reportData.summary && (
                <tfoot className="bg-neutral-50 dark:bg-neutral-800 font-medium">
                  <tr>
                    <td colSpan={3} className="px-4 py-2">
                      Total
                    </td>
                    <td className="px-4 py-2">
                      {reportData.summary.total_items}
                    </td>
                    <td className="px-4 py-2">
                      ${reportData.summary.total_sales}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={exportReport}
              className="btn btn-outline"
            >
              <Download size={16} className="mr-2" />
              Export Report
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;