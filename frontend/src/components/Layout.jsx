import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, Truck, Users, Search, Bell, LogOut, BarChart3 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { icon: <Truck />, label: 'Shipments', to: '/' },
    { icon: <Users />, label: 'Customers', to: '/customers' },
    { icon: <Package />, label: 'Inventory', to: '/inventory' },
];

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-6 bg-indigo-950 flex-shrink-0">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Package className="h-6 w-6 text-sky-400" />
                        <span>LogisticsERP</span>
                    </div>
                    <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-4 space-y-1 flex-1">
                    {NAV_ITEMS.map(item => {
                        const isActive = item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                `}
                            >
                                {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-indigo-800 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
                    <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 w-64">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search HAWB, Client..."
                            className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
                        />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
