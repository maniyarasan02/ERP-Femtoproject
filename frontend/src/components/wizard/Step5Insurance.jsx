import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { useWizard } from '../../context/WizardContext';

const Step5Insurance = () => {
    const { formData, updateFormData, nextStep, prevStep } = useWizard();
    const { insurance, specialGoods } = formData;

    const handleChange = (section, field, value) => {
        updateFormData(section, { [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-indigo-700">Insurance Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 py-6">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isInsured"
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={insurance.isInsured}
                            onChange={(e) => handleChange('insurance', 'isInsured', e.target.checked)}
                        />
                        <label htmlFor="isInsured" className="text-base font-medium text-gray-900 cursor-pointer">
                            Yes, I want to insure this shipment
                        </label>
                    </div>

                    {insurance.isInsured && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7 border-l-2 border-indigo-100 ml-2">
                            <div>
                                <Label required>Declared Value</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={insurance.declaredValue}
                                    onChange={(e) => handleChange('insurance', 'declaredValue', e.target.value)}
                                    required={insurance.isInsured}
                                />
                            </div>
                            <div>
                                <Label>Currency</Label>
                                <Input
                                    value="INR"
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-indigo-700">Special Goods Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isDangerous"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={specialGoods.isDangerous}
                                onChange={(e) => handleChange('specialGoods', 'isDangerous', e.target.checked)}
                            />
                            <label htmlFor="isDangerous" className="text-sm text-gray-700 cursor-pointer">
                                Dangerous Goods (DG)
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isFragile"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={specialGoods.isFragile}
                                onChange={(e) => handleChange('specialGoods', 'isFragile', e.target.checked)}
                            />
                            <label htmlFor="isFragile" className="text-sm text-gray-700 cursor-pointer">
                                Fragile / Handle with Care
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={prevStep}>
                    Previous
                </Button>
                <Button type="submit" size="lg">
                    Next: Review & Submit
                </Button>
            </div>
        </form>
    );
};

export default Step5Insurance;
