import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Package, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, confirmPassword } = form;

        // Trim values to handle whitespace/autocomplete quirks
        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanPhone = phone.trim();

        if (!cleanName || !cleanEmail || !cleanPhone || !password || !confirmPassword) {
            console.error("Validation failed. Form state:", { cleanName, cleanEmail, cleanPhone, password: !!password, confirmPassword: !!confirmPassword });
            setError('Please fill in all fields.'); return;
        }
        if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
            setError('Please enter a valid email address.'); return;
        }
        if (!/^\d{10}$/.test(cleanPhone)) {
            setError('Phone number must be exactly 10 digits.'); return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.'); return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.'); return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await register({ 
                name: cleanName, 
                email: cleanEmail, 
                phone: cleanPhone, 
                password 
            });
            setLoading(false);
            if (result.success) {
                alert('Account created successfully! You can now log in.');
                navigate('/login');
            } else {
                setError(result.error || 'Registration failed. Try a different email.');
            }
        } catch (err) {
            setLoading(false);
            setError('An unexpected error occurred. Please check your connection.');
        }
    };

    const Field = ({ label, name, type = 'text', placeholder, rightEl }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full h-10 px-3 pr-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {rightEl}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-800 to-sky-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-3 border border-white/20">
                        <Package className="h-7 w-7 text-sky-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">LogisticsERP</h1>
                    <p className="text-indigo-200 mt-1 text-sm">Create your account</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-5">Register</h2>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Full Name" name="name" placeholder="John Doe" />
                        <Field label="Email Address" name="email" type="email" placeholder="john@example.com" />
                        <Field label="Phone Number" name="phone" placeholder="9876543210" />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    className="w-full h-10 px-3 pr-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat password"
                                    className="w-full h-10 px-3 pr-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button type="button" onClick={() => setShowConfirmPass(p => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600">
                                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-2"
                        >
                            {loading ? (
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <><UserPlus className="h-4 w-4" />Create Account</>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
