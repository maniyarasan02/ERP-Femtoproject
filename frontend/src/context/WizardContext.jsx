import React, { createContext, useContext, useState } from 'react';

const WizardContext = createContext();

const initialShipmentState = {
    // Step 1
    shipper: { name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', gstin: '' },
    receiver: { name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', gstin: '', sameAsShipper: false },

    // Step 2
    shipmentInfo: {
        serviceType: 'express',
        transportMode: 'air',
        hawbNumber: '',
        bookingDate: new Date().toISOString().split('T')[0],
        origin: '',
        destination: '',
        referenceNumber: ''
    },

    // Step 3 (Cartons)
    cartons: [
        { id: 1, length: 0, width: 0, height: 0, quantity: 1, volWeight: 0, actWeight: 0 }
    ],

    // Calculated totals (set by Step3)
    calculations: {
        totalActualWeight: 0,
        totalVolumetricWeight: 0,
        chargeableWeight: 0,
    },

    // Step 4
    ewayBill: { number: '', status: '', date: '' },
    carrier: { name: '', vehicleNumber: '', trackingId: '' },

    // Step 5
    insurance: { isInsured: false, declaredValue: 0, currency: 'INR' },
    specialGoods: { isDangerous: false, isFragile: false }
};

export const WizardProvider = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialShipmentState);

    const updateFormData = (section, data) => {
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
    };

    const updateCartons = (newCartons) => {
        setFormData(prev => ({ ...prev, cartons: newCartons }));
    };

    const updateCalculations = (calcs) => {
        setFormData(prev => ({ ...prev, calculations: { ...prev.calculations, ...calcs } }));
    };

    const resetWizard = () => {
        setFormData(initialShipmentState);
        setCurrentStep(1);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const goToStep = (step) => setCurrentStep(step);

    return (
        <WizardContext.Provider value={{
            currentStep, formData,
            updateFormData, updateCartons, updateCalculations,
            resetWizard, nextStep, prevStep, goToStep
        }}>
            {children}
        </WizardContext.Provider>
    );
};

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (!context) throw new Error('useWizard must be used within a WizardProvider');
    return context;
};
