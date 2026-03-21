import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { useWizard } from '../../context/WizardContext';
import { Search, CheckCircle, Truck, AlertCircle } from 'lucide-react';

const Step4EWayCarrier = () => {
    const { formData, updateFormData, nextStep, prevStep } = useWizard();
    const { ewayBill, carrier } = formData;

    const [ewayStatus, setEwayStatus] = useState(null); // null, 'loading', 'success', 'error'

    const handleChange = (section, field, value) => {
        updateFormData(section, { [field]: value });
    };

    const handleFetchEWay = () => {
        if (!ewayBill.number) return;
        setEwayStatus('loading');
        setTimeout(() => {
            setEwayStatus('success');
            // Mock data fill
            updateFormData('ewayBill', { status: 'Active', date: new Date().toISOString().split('T')[0] });
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-indigo-700">E-Way Bill Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div>
                            <Label>E-Way Bill Number</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter E-Way Bill No."
                                    value={ewayBill.number}
                                    onChange={(e) => handleChange('ewayBill', 'number', e.target.value)}
                                />
                                <Button type="button" onClick={handleFetchEWay} disabled={!ewayBill.number || ewayStatus === 'loading'}>
                                    {ewayStatus === 'loading' ? 'Fetching...' : 'Fetch'}
                                </Button>
                            </div>
                        </div>
                        {ewayStatus === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Valid - Active</span>
                            </div>
                        )}
                        {ewayStatus === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Invalid Number</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-indigo-700">Carrier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Carrier Name</Label>
                            <Input
                                placeholder="Blue Dart, FedEx, etc."
                                value={carrier.name}
                                onChange={(e) => handleChange('carrier', 'name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Vehicle Number</Label>
                            <Input
                                placeholder="MH 01 AB 1234"
                                value={carrier.vehicleNumber}
                                onChange={(e) => handleChange('carrier', 'vehicleNumber', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Docket / Tracking ID</Label>
                            <Input
                                placeholder="Optional Tracking ID"
                                value={carrier.trackingId}
                                onChange={(e) => handleChange('carrier', 'trackingId', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={prevStep}>
                    Previous
                </Button>
                <Button type="submit" size="lg">
                    Next: Insurance
                </Button>
            </div>
        </form>
    );
};

export default Step4EWayCarrier;
