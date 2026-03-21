import React from 'react';
import { Check } from 'lucide-react';

const steps = [
    { id: 1, title: 'Shipper & Receiver Detail' },
    { id: 2, title: 'Shipment Information' },
    { id: 3, title: 'Carton & Weight Details' },
    { id: 4, title: 'E-Way Bill & Carrier' },
    { id: 5, title: 'Insurance & Special Goods' },
    { id: 6, title: 'Review & Submit' },
];

const Stepper = ({ currentStep }) => {
    return (
        <div className="w-full py-4 mb-8">
            {/* Mobile Text Steps */}
            <div className="lg:hidden flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                    Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm font-semibold text-indigo-600">
                    {steps[currentStep - 1]?.title}
                </span>
            </div>

            {/* Desktop Stepper */}
            <div className="hidden lg:flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />

                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2">
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200
                  ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : ''}
                  ${isCurrent ? 'bg-indigo-600 border-indigo-600 text-white' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}
                            >
                                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                            </div>
                            <span className={`
                mt-2 text-xs font-medium max-w-[120px] text-center
                ${isCurrent ? 'text-indigo-700' : 'text-gray-500'}
              `}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
