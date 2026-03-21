import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useWizard } from '../../context/WizardContext';

const Step2ShipmentInfo = () => {
    const { formData, updateFormData, nextStep, prevStep } = useWizard();
    const { shipmentInfo } = formData;

    const handleChange = (field, value) => {
        updateFormData('shipmentInfo', { [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-indigo-700">Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label required>HAWB Number</Label>
                            <Input
                                value={shipmentInfo.hawbNumber}
                                readOnly
                                className="bg-gray-100 text-gray-500 cursor-not-allowed"
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
                        </div>
                        <div>
                            <Label required>Booking Date</Label>
                            <Input
                                type="date"
                                value={shipmentInfo.bookingDate}
                                onChange={(e) => handleChange('bookingDate', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label required>Service Type</Label>
                            <Select
                                value={shipmentInfo.serviceType}
                                onChange={(e) => handleChange('serviceType', e.target.value)}
                                required
                            >
                                <option value="express">Express (Next Day)</option>
                                <option value="standard">Standard (3-5 Days)</option>
                                <option value="economy">Economy (5-7 Days)</option>
                            </Select>
                        </div>
                        <div>
                            <Label required>Transport Mode</Label>
                            <Select
                                value={shipmentInfo.transportMode}
                                onChange={(e) => handleChange('transportMode', e.target.value)}
                                required
                            >
                                <option value="air">Air</option>
                                <option value="surface">Surface</option>
                                <option value="train">Train</option>
                                <option value="sea">Sea</option>
                            </Select>
                        </div>

                        <div>
                            <Label required>Origin</Label>
                            <Input
                                placeholder="Origin Station Code"
                                value={shipmentInfo.origin}
                                onChange={(e) => handleChange('origin', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label required>Destination</Label>
                            <Input
                                placeholder="Destination Station Code"
                                value={shipmentInfo.destination}
                                onChange={(e) => handleChange('destination', e.target.value)}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label>Reference Number / PO Number</Label>
                            <Input
                                placeholder="Client Reference or PO Number"
                                value={shipmentInfo.referenceNumber}
                                onChange={(e) => handleChange('referenceNumber', e.target.value)}
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
                    Next: Carton Details
                </Button>
            </div>
        </form>
    );
};

export default Step2ShipmentInfo;
