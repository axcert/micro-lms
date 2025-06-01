import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    text = 'Loading...' 
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizeClasses[size]} mx-auto`}
                ></div>
                {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;