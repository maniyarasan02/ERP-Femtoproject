import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { shipmentsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Search, Package, Plane, Truck, Ship, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  draft:            'bg-gray-100 text-gray-600',
  booked:           'bg-blue-100 text-blue-700',
  in_transit:       'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-amber-100 text-amber-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  draft:            'Draft',
  booked:           'Booked',
  in_transit:       'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

const ModeIcon = ({ mode }) => {
  if (mode === 'air')    return <Plane className="h-4 w-4 text-indigo-500" />;
  if (mode === 'sea')    return <Ship  className="h-4 w-4 text-blue-500"   />;
  return                        <Truck className="h-4 w-4 text-gray-500"   />;
};

export default function ShipmentsPage() {
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const [shipments, setShipments]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [hawbQuery, setHawbQuery]     = useState('');
  const [searching, setSearching]     = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await shipmentsAPI.list();
      setShipments(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load shipments', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── HAWB Search ── */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!hawbQuery.trim()) return;
    setSearching(true);
    setSearchResult(null);
    setSearchError('');
    try {
      const data = await shipmentsAPI.search(hawbQuery.trim());
      if (data.error) {
        setSearchError(data.error);
      } else {
        setSearchResult(data);
      }
    } catch {
      setSearchError('Could not connect. Try again.');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setHawbQuery('');
    setSearchResult(null);
    setSearchError('');
  };

  /* ── Status Update ── */
  const handleStatusChange = async (id, newStatus) => {
    const data = await shipmentsAPI.update(id, { status: newStatus });
    if (data.id) {
      showToast(`Status updated to ${STATUS_LABELS[newStatus]}`, 'success');
      loadAll();
      if (searchResult?.id === id) setSearchResult(data);
    } else {
      showToast(data.error || 'Update failed', 'error');
    }
  };

  /* ── Helpers ── */
  const ShipmentRow = ({ s }) => (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-mono text-sm font-semibold text-indigo-700">{s.hawb_number}</td>
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900 text-sm">{s.shipper_name}</p>
        <p className="text-xs text-gray-400">{s.shipper_city}</p>
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900 text-sm">{s.receiver_name}</p>
        <p className="text-xs text-gray-400">{s.receiver_city}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{s.destination || '—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <ModeIcon mode={s.transport_mode} />
          <span className="text-xs text-gray-500 capitalize">{s.transport_mode}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 font-medium">{s.chargeable_weight} kg</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
          {STATUS_LABELS[s.status] || s.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <select
          value={s.status}
          onChange={(e) => handleStatusChange(s.id, e.target.value)}
          className="text-xs border rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </td>
    </tr>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
            <p className="text-sm text-gray-500 mt-1">Search by HAWB or view all shipments</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> New Shipment
          </button>
        </div>

        {/* HAWB Search Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-500" /> Search by HAWB Number
          </h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={hawbQuery}
              onChange={(e) => setHawbQuery(e.target.value.toUpperCase())}
              placeholder="e.g. FLSK12345678"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={searching || !hawbQuery.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              {searching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {searching ? 'Searching...' : 'Search'}
            </button>
            {(searchResult || searchError) && (
              <button type="button" onClick={clearSearch}
                className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium">
                Clear
              </button>
            )}
          </form>

          {/* Search Error */}
          {searchError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ❌ {searchError}
            </div>
          )}

          {/* Search Result */}
          {searchResult && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">Found</p>
                  <p className="text-xl font-bold text-indigo-700 font-mono">{searchResult.hawb_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[searchResult.status]}`}>
                  {STATUS_LABELS[searchResult.status] || searchResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Shipper</p>
                  <p className="font-medium text-gray-900">{searchResult.shipper_name}</p>
                  <p className="text-gray-400 text-xs">{searchResult.shipper_city}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Receiver</p>
                  <p className="font-medium text-gray-900">{searchResult.receiver_name}</p>
                  <p className="text-gray-400 text-xs">{searchResult.receiver_city}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Route</p>
                  <p className="font-medium text-gray-900">{searchResult.origin} → {searchResult.destination}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Chargeable Weight</p>
                  <p className="font-bold text-indigo-700">{searchResult.chargeable_weight} kg</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Update Status:</span>
                <select
                  value={searchResult.status}
                  onChange={(e) => handleStatusChange(searchResult.id, e.target.value)}
                  className="text-xs border rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* All Shipments Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-500" />
              All Shipments
              <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                {shipments.length}
              </span>
            </h2>
            <button onClick={loadAll} className="text-gray-400 hover:text-indigo-600 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading...
            </div>
          ) : shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No shipments yet. Create your first shipment!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">HAWB</th>
                    <th className="px-4 py-3">Shipper</th>
                    <th className="px-4 py-3">Receiver</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Chg. Wt</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(s => <ShipmentRow key={s.id} s={s} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
