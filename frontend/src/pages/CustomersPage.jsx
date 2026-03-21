import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Plus, Phone, Mail, MapPin, User, RefreshCw } from 'lucide-react';
import { customersAPI } from '../lib/api';
import AddCustomerModal from '../components/AddCustomerModal';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = async (q = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await customersAPI.list(q);
      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        setError('Could not load customers.');
      }
    } catch {
      setError('Backend not reachable. Start the Django server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchCustomers(e.target.value);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-500 text-sm mt-1">{customers.length} registered customers</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>

        {/* Modal */}
        <AddCustomerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchCustomers(search);
            // Optionally could show a success toast here
          }}
        />

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchCustomers(search)} className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 h-10 mb-6 gap-2 max-w-sm shadow-sm">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, city..."
            className="text-sm border-none focus:outline-none flex-1 bg-transparent"
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Customers', value: customers.length, color: 'text-indigo-600' },
            { label: 'Mumbai', value: customers.filter(c => c.city === 'Mumbai').length, color: 'text-sky-600' },
            { label: 'Bengaluru', value: customers.filter(c => c.city === 'Bengaluru').length, color: 'text-sky-600' },
            { label: 'Total States', value: new Set(customers.map(c => c.state)).size, color: 'text-green-600' },
          ].map(stat => (
            <Card key={stat.label} className="text-center p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
          </div>
        )}

        {/* Customer Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map(customer => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {customer.name.charAt(0)}
                    </div>
                    {customer.gstin && (
                      <span className="text-xs bg-gray-100 text-gray-600 font-mono px-2 py-1 rounded">
                        {customer.gstin}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{customer.name}</h3>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />{customer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />{customer.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />{customer.city}{customer.state ? `, ${customer.state}` : ''}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">View</Button>
                    <Button variant="secondary" size="sm" className="flex-1 text-xs">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {customers.length === 0 && !error && (
              <div className="col-span-3 text-center py-16 text-gray-400">
                <User className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No customers found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomersPage;
