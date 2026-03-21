import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Plus, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { inventoryAPI } from '../lib/api';

const StockBadge = ({ stock, reorder_level }) => {
  if (stock === 0) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>;
  if (stock <= reorder_level) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Low Stock</span>;
  return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">In Stock</span>;
};

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async (q = '', cat = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await inventoryAPI.list(q, cat === 'All' ? '' : cat);
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setError('Could not load inventory.');
      }
    } catch {
      setError('Backend not reachable. Start the Django server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchItems(e.target.value, filter);
  };

  const handleFilter = (cat) => {
    setFilter(cat);
    fetchItems(search, cat);
  };

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];
  const lowStockCount = items.filter(i => i.stock <= i.reorder_level && i.stock > 0).length;
  const outOfStockCount = items.filter(i => i.stock === 0).length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} items tracked</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchItems(search, filter)} className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
          </div>
        )}

        {/* Alert Banner */}
        {(lowStockCount > 0 || outOfStockCount > 0) && !error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Stock Alert</p>
              <p className="text-amber-700">
                {lowStockCount > 0 && <span>{lowStockCount} item(s) running low. </span>}
                {outOfStockCount > 0 && <span>{outOfStockCount} item(s) out of stock.</span>}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Items', value: items.length, color: 'text-indigo-600' },
            { label: 'In Stock', value: items.filter(i => i.stock > i.reorder_level).length, color: 'text-green-600' },
            { label: 'Low Stock', value: lowStockCount, color: 'text-amber-600' },
            { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-600' },
          ].map(s => (
            <Card key={s.label} className="text-center p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 h-10 gap-2 shadow-sm">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search SKU or name..."
              className="text-sm border-none focus:outline-none bg-transparent w-48"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => handleFilter(cat)}
                className={`px-3 h-10 rounded-md text-sm font-medium transition-colors ${
                  filter === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
          </div>
        )}

        {/* Table */}
        {!loading && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Item Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 text-gray-500">{item.location}</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {item.stock} <span className="text-gray-400 font-normal">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StockBadge stock={item.stock} reorder_level={item.reorder_level} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-xs text-indigo-600">Reorder</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-16 text-gray-400">No items found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default InventoryPage;
