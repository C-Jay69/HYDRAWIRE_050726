'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Rocket, Check } from 'lucide-react';

export interface CampaignBuilderProps {
  steps: {
    title: string;
    description?: string;
    content: React.ReactNode;
  }[];
  initialData?: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export function CampaignBuilder({ steps, initialData, onComplete, onCancel }: CampaignBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
    }
  };

  const updateFormData = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                'flex items-center',
                index !== steps.length - 1 && 'flex-1'
              )}
            >
              <button
                onClick={() => handleStepClick(index)}
                disabled={index > currentStep}
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  index <= currentStep
                    ? 'text-primary cursor-pointer'
                    : 'text-muted-foreground cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                    index < currentStep
                      ? 'bg-primary text-primary-foreground border-primary'
                      : index === currentStep
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground text-muted-foreground'
                  )}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="font-medium hidden lg:inline">{step.title}</span>
              </button>
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
            {steps[currentStep].description && (
              <p className="text-muted-foreground mt-1">{steps[currentStep].description}</p>
            )}
          </div>
          <div className="min-h-[300px]">
            {steps[currentStep].content}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {isLastStep ? (
            <Button onClick={() => onComplete(formData)}>
              <Rocket className="mr-2 h-4 w-4" />
              Launch Campaign
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
