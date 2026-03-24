import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Package, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Field = ({ label, name, type = 'text', value, onChange, placeholder, rightEl }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-10 px-3 pr-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {rightEl}
        </div>
    </div>
);

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

    // Reactive validation
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();
    
    const isNameValid = cleanName.length >= 2;
    const isEmailValid = /^\S+@\S+\.\S+$/.test(cleanEmail);
    const isPhoneValid = /^\d{10}$/.test(cleanPhone);
    const isPasswordValid = form.password.length >= 6;
    const isConfirmValid = form.password === form.confirmPassword && form.confirmPassword.length > 0;
    
    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmValid;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

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
                        <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                        <Field label="Email Address" name="email" value={form.email} onChange={handleChange} type="email" placeholder="john@example.com" />
                        <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />

                        <Field 
                            label="Password" 
                            name="password" 
                            type={showPass ? 'text' : 'password'} 
                            value={form.password} 
                            onChange={handleChange} 
                            placeholder="Min. 6 characters" 
                            rightEl={
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />

                        <Field 
                            label="Confirm Password" 
                            name="confirmPassword" 
                            type={showConfirmPass ? 'text' : 'password'} 
                            value={form.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Repeat password" 
                            rightEl={
                                <button type="button" onClick={() => setShowConfirmPass(p => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600">
                                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-200 mt-2"
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
