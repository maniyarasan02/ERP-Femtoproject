import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { useWizard } from '../../context/WizardContext';

const Step1ShipperReceiver = () => {
    const { formData, updateFormData, nextStep } = useWizard();
    const { shipper, receiver } = formData;

    const handleChange = (section, field, value) => {
        updateFormData(section, { [field]: value });
    };

    const handleSameAsShipper = (e) => {
        const isChecked = e.target.checked;
        handleChange('receiver', 'sameAsShipper', isChecked);
        if (isChecked) {
            updateFormData('receiver', {
                name: shipper.name,
                address: shipper.address,
                city: shipper.city,
                state: shipper.state,
                pincode: shipper.pincode,
                phone: shipper.phone,
                email: shipper.email,
                gstin: shipper.gstin
            });
        } else {
            // Optional: clear receiver fields or leave them as is
        }
    };

    // Effect to keep receiver in sync if "Same as Shipper" is checked and shipper changes
    useEffect(() => {
        if (receiver.sameAsShipper) {
            updateFormData('receiver', {
                name: shipper.name,
                address: shipper.address,
                city: shipper.city,
                state: shipper.state,
                pincode: shipper.pincode,
                phone: shipper.phone,
                email: shipper.email,
                gstin: shipper.gstin
            });
        }
    }, [shipper, receiver.sameAsShipper]);

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipper Card */}
                <Card>
                    <CardHeader className="bg-gray-50 border-b border-gray-100">
                        <CardTitle className="text-indigo-700">Shipper Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 py-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label required>Company / Name</Label>
                                <Input
                                    placeholder="Enter shipper name"
                                    value={shipper.name}
                                    onChange={(e) => handleChange('shipper', 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label required>Address</Label>
                                <Input
                                    placeholder="Street address, Area"
                                    value={shipper.address}
                                    onChange={(e) => handleChange('shipper', 'address', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>Pincode</Label>
                                    <Input
                                        placeholder="110001"
                                        value={shipper.pincode}
                                        onChange={(e) => handleChange('shipper', 'pincode', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label required>City</Label>
                                    <Input
                                        placeholder="New Delhi"
                                        value={shipper.city}
                                        onChange={(e) => handleChange('shipper', 'city', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>State</Label>
                                    <Input
                                        placeholder="Delhi"
                                        value={shipper.state}
                                        onChange={(e) => handleChange('shipper', 'state', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>GSTIN</Label>
                                    <Input
                                        placeholder="07AAAAA0000A1Z5"
                                        value={shipper.gstin}
                                        onChange={(e) => handleChange('shipper', 'gstin', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>Phone</Label>
                                    <Input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={shipper.phone}
                                        onChange={(e) => handleChange('shipper', 'phone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="shipper@example.com"
                                        value={shipper.email}
                                        onChange={(e) => handleChange('shipper', 'email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Receiver Card */}
                <Card>
                    <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-indigo-700">Receiver Details</CardTitle>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="sameAsShipper"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={receiver.sameAsShipper}
                                onChange={handleSameAsShipper}
                            />
                            <label htmlFor="sameAsShipper" className="text-sm text-gray-600 cursor-pointer select-none">
                                Same as Shipper
                            </label>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 py-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label required>Company / Name</Label>
                                <Input
                                    placeholder="Enter receiver name"
                                    value={receiver.name}
                                    onChange={(e) => handleChange('receiver', 'name', e.target.value)}
                                    required
                                    disabled={receiver.sameAsShipper}
                                />
                            </div>
                            <div>
                                <Label required>Address</Label>
                                <Input
                                    placeholder="Street address, Area"
                                    value={receiver.address}
                                    onChange={(e) => handleChange('receiver', 'address', e.target.value)}
                                    required
                                    disabled={receiver.sameAsShipper}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>Pincode</Label>
                                    <Input
                                        placeholder="400001"
                                        value={receiver.pincode}
                                        onChange={(e) => handleChange('receiver', 'pincode', e.target.value)}
                                        required
                                        disabled={receiver.sameAsShipper}
                                    />
                                </div>
                                <div>
                                    <Label required>City</Label>
                                    <Input
                                        placeholder="Mumbai"
                                        value={receiver.city}
                                        onChange={(e) => handleChange('receiver', 'city', e.target.value)}
                                        required
                                        disabled={receiver.sameAsShipper}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>State</Label>
                                    <Input
                                        placeholder="Maharashtra"
                                        value={receiver.state}
                                        onChange={(e) => handleChange('receiver', 'state', e.target.value)}
                                        required
                                        disabled={receiver.sameAsShipper}
                                    />
                                </div>
                                <div>
                                    <Label>GSTIN</Label>
                                    <Input
                                        placeholder="27AAAAA0000A1Z5"
                                        value={receiver.gstin}
                                        onChange={(e) => handleChange('receiver', 'gstin', e.target.value)}
                                        disabled={receiver.sameAsShipper}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>Phone</Label>
                                    <Input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={receiver.phone}
                                        onChange={(e) => handleChange('receiver', 'phone', e.target.value)}
                                        required
                                        disabled={receiver.sameAsShipper}
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="receiver@example.com"
                                        value={receiver.email}
                                        onChange={(e) => handleChange('receiver', 'email', e.target.value)}
                                        disabled={receiver.sameAsShipper}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto">
                    Next: Shipment Info
                </Button>
            </div>
        </form>
    );
};

export default Step1ShipperReceiver;
