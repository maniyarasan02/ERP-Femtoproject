import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Package, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, showToast } = useAuth();

    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Reactive validation constants
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();
    
    const isNameValid = cleanName.length >= 2;
    const isEmailValid = /^\S+@\S+\.\S+$/.test(cleanEmail);
    const isPhoneValid = /^\d{10}$/.test(cleanPhone);
    const isPasswordValid = form.password.length >= 6;
    const isConfirmValid = form.password === form.confirmPassword && form.confirmPassword.length > 0;
    
    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmValid;

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Don't clear error here as it might trigger re-renders mid-step
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        setError('');
        try {
            const result = await register({ 
                name: cleanName, 
                email: cleanEmail, 
                phone: cleanPhone, 
                password: form.password 
            });
            if (result.success) {
                navigate('/login');
            } else {
                const msg = result.error || 'Registration failed. Try a different email.';
                setError(msg);
                showToast(msg, 'error');
                setLoading(false);
            }
        } catch (err) {
            const msg = 'An unexpected error occurred. Please check your connection.';
            setError(msg);
            showToast(msg, 'error');
            setLoading(false);
        }
    };

    const inputClasses = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all";
    const labelClasses = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 backdrop-blur-xl mb-4 border border-white/10 shadow-2xl">
                        <Package className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">LogisticsERP</h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Create your high-performance account</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Register</h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium">Please enter your details to continue</p>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className={labelClasses}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={inputClasses}
                            />
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className={labelClasses}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className={inputClasses}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={labelClasses}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="10-digit number"
                                className={inputClasses}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClasses}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    className={inputClasses}
                                />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-indigo-600 transition-colors">
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className={labelClasses}>Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat password"
                                    className={inputClasses}
                                />
                                <button type="button" onClick={() => setShowConfirmPass(p => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-indigo-600 transition-colors">
                                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] mt-4"
                        >
                            {loading ? (
                                <span className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full" />
                            ) : (
                                <><UserPlus className="h-5 w-5" />Create Account</>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
