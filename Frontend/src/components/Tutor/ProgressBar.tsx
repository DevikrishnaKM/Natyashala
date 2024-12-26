import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex justify-between items-center w-1/2 px-16 mt-4 mb-10 pt-10 ml-96">
            {Array.from({ length: totalSteps }, (_, index) => (
                <div key={index} className="relative flex-1 mx-2">
                    <div
                        className={`h-1 ${currentStep > index ? 'bg-green-500' : 'bg-gray-300'}`}
                        style={{ width: '100%' }}
                    ></div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;