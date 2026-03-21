import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useWizard } from '../../context/WizardContext';
import { Check, Edit2, Printer, AlertCircle } from 'lucide-react';
import { shipmentsAPI } from '../../lib/api';

const handlePrint = () => window.print();

const Step6Review = () => {
    const { formData, prevStep, goToStep, resetWizard } = useWizard();
    const { shipper, receiver, shipmentInfo, cartons, calculations, ewayBill, carrier, insurance } = formData;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createdHawb, setCreatedHawb] = useState('');
    const [error, setError] = useState('');

    // Map wizard formData → Django API payload
    const buildPayload = () => ({
        // Django will auto-generate hawb_number, but we send booking_date etc.
        booking_date: shipmentInfo.bookingDate,
        service_type: shipmentInfo.serviceType,
        transport_mode: shipmentInfo.transportMode,
        origin: shipmentInfo.origin,
        destination: shipmentInfo.destination,
        reference_number: shipmentInfo.referenceNumber || '',
        status: 'booked',

        // Shipper
        shipper_name: shipper.name,
        shipper_address: shipper.address,
        shipper_city: shipper.city,
        shipper_state: shipper.state,
        shipper_pincode: shipper.pincode,
        shipper_phone: shipper.phone,
        shipper_email: shipper.email || '',
        shipper_gstin: shipper.gstin || '',

        // Receiver
        receiver_name: receiver.name,
        receiver_address: receiver.address,
        receiver_city: receiver.city,
        receiver_state: receiver.state,
        receiver_pincode: receiver.pincode,
        receiver_phone: receiver.phone,
        receiver_email: receiver.email || '',
        receiver_gstin: receiver.gstin || '',

        // Weights
        total_actual_weight: calculations.totalActualWeight || 0,
        total_volumetric_weight: calculations.totalVolumetricWeight || 0,
        chargeable_weight: calculations.chargeableWeight || 0,

        // E-Way & Carrier
        eway_bill_number: ewayBill.number || '',
        carrier_name: carrier.name || '',
        vehicle_number: carrier.vehicleNumber || '',
        tracking_id: carrier.trackingId || '',

        // Insurance
        is_insured: insurance.isInsured || false,
        declared_value: insurance.declaredValue || 0,

        // Cartons (nested)
        cartons: cartons.map(c => ({
            length: parseFloat(c.length) || 0,
            width: parseFloat(c.width) || 0,
            height: parseFloat(c.height) || 0,
            quantity: parseInt(c.quantity) || 1,
            actual_weight: parseFloat(c.actWeight) || 0,
        })),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const payload = buildPayload();
            const data = await shipmentsAPI.create(payload);

            if (data.id) {
                // Success — Django returns the created shipment with its hawb_number
                setCreatedHawb(data.hawb_number);
                setSuccess(true);
            } else {
                // DRF returned a validation error object
                const msgs = Object.entries(data)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                    .join(' | ');
                setError(msgs || 'Submission failed. Please check all fields.');
            }
        } catch (err) {
            setError('Could not connect to server. Make sure the Django backend is running.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ReviewSection = ({ title, step, children }) => (
        <Card className="mb-4">
            <CardHeader className="bg-gray-50 border-b border-gray-100 py-4 flex flex-row justify-between items-center">
                <h4 className="text-sm font-semibold text-indigo-700 uppercase">{title}</h4>
                <Button variant="ghost" size="sm" onClick={() => goToStep(step)}
                    className="text-gray-400 hover:text-indigo-600 h-8 px-2">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="py-4 text-sm">{children}</CardContent>
        </Card>
    );

    // ── Success screen ──────────────────────────────────────
    if (success) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200" id="invoice-print-area">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Created Successfully!</h2>
                <p className="text-gray-500 mb-1">HAWB Number: <strong className="text-indigo-700">{createdHawb}</strong></p>
                <p className="text-gray-400 text-sm mb-8">Booking Date: {shipmentInfo.bookingDate}</p>
                <div className="flex justify-center gap-4 no-print">
                    <Button onClick={resetWizard}>Create Another Shipment</Button>
                    <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print Invoice
                    </Button>
                </div>
            </div>
        );
    }

    // ── Review form ─────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit} id="invoice-print-area">

            {/* API Error Banner */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-red-800 text-sm">Submission Error</p>
                        <p className="text-red-700 text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReviewSection title="Shipper Details" step={1}>
                    <p className="font-medium text-gray-900">{shipper.name}</p>
                    <p className="text-gray-500">{shipper.address}</p>
                    <p className="text-gray-500">{shipper.city}, {shipper.state} - {shipper.pincode}</p>
                    <p className="text-gray-500 mt-1">Ph: {shipper.phone}</p>
                    {shipper.gstin && <p className="text-gray-400 text-xs mt-1">GSTIN: {shipper.gstin}</p>}
                </ReviewSection>

                <ReviewSection title="Receiver Details" step={1}>
                    <p className="font-medium text-gray-900">{receiver.name}</p>
                    <p className="text-gray-500">{receiver.address}</p>
                    <p className="text-gray-500">{receiver.city}, {receiver.state} - {receiver.pincode}</p>
                    <p className="text-gray-500 mt-1">Ph: {receiver.phone}</p>
                    {receiver.gstin && <p className="text-gray-400 text-xs mt-1">GSTIN: {receiver.gstin}</p>}
                </ReviewSection>

                <ReviewSection title="Shipment Info" step={2}>
                    <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-gray-500">Service:</span> <span className="font-medium capitalize">{shipmentInfo.serviceType}</span></div>
                        <div><span className="text-gray-500">Mode:</span> <span className="font-medium capitalize">{shipmentInfo.transportMode}</span></div>
                        <div><span className="text-gray-500">Origin:</span> <span className="font-medium uppercase">{shipmentInfo.origin}</span></div>
                        <div><span className="text-gray-500">Dest:</span> <span className="font-medium uppercase">{shipmentInfo.destination}</span></div>
                        <div><span className="text-gray-500">Date:</span> <span className="font-medium">{shipmentInfo.bookingDate}</span></div>
                        {shipmentInfo.referenceNumber && (
                            <div><span className="text-gray-500">Ref#:</span> <span className="font-medium">{shipmentInfo.referenceNumber}</span></div>
                        )}
                    </div>
                </ReviewSection>

                <ReviewSection title="Weight & Cartons" step={3}>
                    <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-gray-500">Total Pcs:</span> <span className="font-medium">{cartons.reduce((a, c) => a + (parseInt(c.quantity) || 0), 0)}</span></div>
                        <div><span className="text-gray-500">Actual Wt:</span> <span className="font-medium">{calculations.totalActualWeight} Kg</span></div>
                        <div><span className="text-gray-500">Vol. Wt:</span> <span className="font-medium">{calculations.totalVolumetricWeight} Kg</span></div>
                        <div className="col-span-2 mt-1 pt-1 border-t">
                            <span className="text-gray-500">Charged Weight:</span> <span className="font-bold text-indigo-600">{calculations.chargeableWeight} Kg</span>
                        </div>
                    </div>
                </ReviewSection>

                <ReviewSection title="E-Way & Carrier" step={4}>
                    <p><span className="text-gray-500">E-Way Bill:</span> {ewayBill.number || 'N/A'}</p>
                    <p><span className="text-gray-500">Carrier:</span> {carrier.name || 'N/A'}</p>
                    <p><span className="text-gray-500">Vehicle:</span> {carrier.vehicleNumber || 'N/A'}</p>
                </ReviewSection>

                <ReviewSection title="Insurance" step={5}>
                    <p><span className="text-gray-500">Insured:</span> {insurance.isInsured ? 'Yes' : 'No'}</p>
                    {insurance.isInsured && (
                        <p><span className="text-gray-500">Declared Value:</span> ₹{insurance.declaredValue}</p>
                    )}
                </ReviewSection>
            </div>

            <div className="flex justify-between pt-6 border-t mt-6 no-print">
                <Button type="button" variant="secondary" onClick={prevStep} disabled={isSubmitting}>
                    Previous
                </Button>
                <div className="gap-3 flex">
                    <Button type="button" variant="outline" onClick={handlePrint}
                        className="flex items-center gap-2" disabled={isSubmitting}>
                        <Printer className="h-4 w-4" /> Print
                    </Button>
                    <Button type="submit" size="lg" disabled={isSubmitting}
                        className="min-w-[180px] flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Submitting...</>
                        ) : 'Confirm & Create Shipment'}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default Step6Review;
