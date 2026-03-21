import React from 'react';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import { WizardProvider, useWizard } from '../context/WizardContext';
import { Button } from '../components/ui/Button';
import Step1ShipperReceiver from '../components/wizard/Step1ShipperReceiver';
import Step2ShipmentInfo from '../components/wizard/Step2ShipmentInfo';
import Step3CartonWeight from '../components/wizard/Step3CartonWeight';
import Step4EWayCarrier from '../components/wizard/Step4EWayCarrier';
import Step5Insurance from '../components/wizard/Step5Insurance';
import Step6Review from '../components/wizard/Step6Review';
// Import other steps as we create them
// import Step4...

const WizardContent = () => {
    const { currentStep } = useWizard();

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1ShipperReceiver />;
            case 2:
                return <Step2ShipmentInfo />;
            case 3:
                return <Step3CartonWeight />;
            case 4:
                return <Step4EWayCarrier />;
            case 5:
                return <Step5Insurance />;
            case 6:
                return <Step6Review />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Shipment</h1>
                <p className="text-gray-500 text-sm mt-1">Fill in the details below to generate a new HAWB.</p>
            </div>

            <Stepper currentStep={currentStep} />

            <div className="mt-6">
                {renderStep()}
            </div>
        </div>
    );
};

const CreateShipment = () => {
    return (
        <Layout>
            <WizardProvider>
                <WizardContent />
            </WizardProvider>
        </Layout>
    );
};

export default CreateShipment;
