import React from "react";

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  textPrimary?: string;
  textSecondary?: string;
  stepColor?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  textPrimary = "text-gray-900",
  textSecondary = "text-gray-600",
  stepColor = "bg-red-600",
}) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
      {steps.map((step, idx) => (
        <div key={idx}>
          <div
            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${stepColor}`}
          >
            <span className="font-bold text-white">{idx + 1}</span>
          </div>
          <h4 className={`${textPrimary} mb-2 font-medium`}>{step.title}</h4>
          <p className={`${textSecondary} text-sm`}>{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
