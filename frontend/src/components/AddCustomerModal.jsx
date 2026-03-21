import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { customersAPI } from '../lib/api';

const AddCustomerModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '', state: '', pincode: '', gstin: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await customersAPI.create(form);
      if (result.id) {
        onSuccess();
        onClose();
        setForm({ name: '', email: '', phone: '', city: '', state: '', pincode: '', gstin: '', address: '' });
      } else {
        // Handle validation errors from backend
        const firstError = Object.values(result)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Failed to create customer.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-2xl">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add New Customer</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">Full Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="Enter full name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">Email *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">Phone *</label>
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="10-digit number" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">City *</label>
                <input name="city" required value={form.city} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">State</label>
                <input name="state" value={form.state} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="e.g. Maharashtra" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="400001" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">GSTIN</label>
                <input name="gstin" value={form.gstin} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="Optional" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 caps tracking-wider uppercase">Address</label>
              <textarea name="address" rows="3" value={form.address} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none" placeholder="Complete address..."></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
