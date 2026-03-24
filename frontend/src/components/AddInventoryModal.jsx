import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { Button } from './ui/Button';
import { inventoryAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const AddInventoryModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  
  const [form, setForm] = useState({
    name: '', sku: '', category: '', stock: 0, unit: 'pcs', reorder_level: 10, location: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...form,
        stock: parseInt(form.stock, 10) || 0,
        reorder_level: parseInt(form.reorder_level, 10) || 10
      };
      
      const result = await inventoryAPI.create(dataToSubmit);
      if (result.id) {
        showToast(`Item ${result.sku} added to inventory.`, 'success');
        onSuccess();
        onClose();
        setForm({ name: '', sku: '', category: '', stock: 0, unit: 'pcs', reorder_level: 10, location: '' });
      } else {
        const errorMsg = result.error || 'Failed to add item.';
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none";
  const labelClasses = "block text-xs font-medium text-gray-700 mb-1 tracking-wider uppercase";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-2xl">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Add Inventory Item</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className={labelClasses}>Item Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} className={inputClasses} placeholder="e.g. Cardboard Box Large" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>SKU *</label>
              <input name="sku" required value={form.sku} onChange={handleChange} className={`${inputClasses} uppercase`} placeholder="e.g. CB-LRG-01" />
            </div>
            <div>
              <label className={labelClasses}>Category</label>
              <input name="category" value={form.category} onChange={handleChange} className={inputClasses} placeholder="e.g. Packaging" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Initial Stock</label>
              <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} className={inputClasses} placeholder="0" />
            </div>
            <div>
              <label className={labelClasses}>Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputClasses}>
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="liters">Liters (L)</option>
                <option value="boxes">Boxes</option>
                <option value="pallets">Pallets</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Reorder Level</label>
              <input type="number" min="0" name="reorder_level" value={form.reorder_level} onChange={handleChange} className={inputClasses} placeholder="10" />
            </div>
            <div>
              <label className={labelClasses}>Warehouse Location</label>
              <input name="location" value={form.location} onChange={handleChange} className={inputClasses} placeholder="e.g. A1-Bin4" />
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100 flex gap-3 mt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : 'Add to Inventory'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryModal;
