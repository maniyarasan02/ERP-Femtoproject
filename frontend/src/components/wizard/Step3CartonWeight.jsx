import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useWizard } from '../../context/WizardContext';
import { Trash2, Plus } from 'lucide-react';

const Step3CartonWeight = () => {
    const { formData, updateCartons, updateFormData, nextStep, prevStep } = useWizard();
    const { cartons, calculations } = formData;

    const handleCartonChange = (id, field, value) => {
        const newCartons = cartons.map(carton => {
            if (carton.id === id) {
                const newCarton = { ...carton, [field]: parseFloat(value) || 0 };
                // Recalculate vol weight for this row
                // Formula: (L * W * H) / 5000 (standard divisor) * Quantity
                const vol = (newCarton.length * newCarton.width * newCarton.height) / 5000 * newCarton.quantity;
                newCarton.volWeight = parseFloat(vol.toFixed(2));
                return newCarton;
            }
            return carton;
        });
        updateCartons(newCartons);
    };

    const addRow = () => {
        const newId = cartons.length > 0 ? Math.max(...cartons.map(c => c.id)) + 1 : 1;
        updateCartons([...cartons, { id: newId, length: 0, width: 0, height: 0, quantity: 1, volWeight: 0, actWeight: 0 }]);
    };

    const removeRow = (id) => {
        if (cartons.length === 1) return; // Prevent removing last row
        updateCartons(cartons.filter(c => c.id !== id));
    };

    // Effect to calculate totals whenever cartons change
    useEffect(() => {
        const totalVol = cartons.reduce((sum, item) => sum + item.volWeight, 0);
        // Assuming 'actWeight' might be manually entered per row or a total field. 
        // The prompt says "Total Actual Weight" in summary, implying likely total input or sum.
        // Let's assume Act Weight is per row for accurate manifest.
        const totalAct = cartons.reduce((sum, item) => sum + item.actWeight, 0);

        const charged = Math.max(totalVol, totalAct);

        updateFormData('calculations', {
            totalVolumetricWeight: parseFloat(totalVol.toFixed(2)),
            totalActualWeight: parseFloat(totalAct.toFixed(2)),
            chargeableWeight: parseFloat(charged.toFixed(2))
        });
    }, [cartons]);

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-row justify-between items-center">
                    <CardTitle className="text-indigo-700">Carton & Weight Details</CardTitle>
                    <Button type="button" size="sm" onClick={addRow} variant="outline" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Row
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 py-6 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Length (cm)</th>
                                <th className="px-4 py-3">Width (cm)</th>
                                <th className="px-4 py-3">Height (cm)</th>
                                <th className="px-4 py-3">Qty</th>
                                <th className="px-4 py-3">Act. Weight (kg)</th>
                                <th className="px-4 py-3">Vol. Weight (kg)</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartons.map((carton) => (
                                <tr key={carton.id} className="border-b">
                                    <td className="px-2 py-2">
                                        <Input
                                            type="number"
                                            value={carton.length}
                                            onChange={(e) => handleCartonChange(carton.id, 'length', e.target.value)}
                                            className="w-24"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <Input
                                            type="number"
                                            value={carton.width}
                                            onChange={(e) => handleCartonChange(carton.id, 'width', e.target.value)}
                                            className="w-24"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <Input
                                            type="number"
                                            value={carton.height}
                                            onChange={(e) => handleCartonChange(carton.id, 'height', e.target.value)}
                                            className="w-24"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <Input
                                            type="number"
                                            value={carton.quantity}
                                            onChange={(e) => handleCartonChange(carton.id, 'quantity', e.target.value)}
                                            className="w-20"
                                            min="1"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <Input
                                            type="number"
                                            value={carton.actWeight}
                                            onChange={(e) => handleCartonChange(carton.id, 'actWeight', e.target.value)}
                                            className="w-24"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-700">
                                        {carton.volWeight}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeRow(carton.id)}
                                            disabled={cartons.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-gray-50 p-4 rounded-md">
                        <div>
                            <p className="text-sm text-gray-500">Total Actual Weight</p>
                            <p className="text-xl font-bold text-gray-900">{calculations?.totalActualWeight || 0} Kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Volumetric Weight</p>
                            <p className="text-xl font-bold text-gray-900">{calculations?.totalVolumetricWeight || 0} Kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Charged Weight</p>
                            <p className="text-xl font-bold text-indigo-600">{calculations?.chargeableWeight || 0} Kg</p>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={prevStep}>
                    Previous
                </Button>
                <Button type="submit" size="lg">
                    Next: E-Way Bill & Carrier
                </Button>
            </div>
        </form>
    );
};

export default Step3CartonWeight;
