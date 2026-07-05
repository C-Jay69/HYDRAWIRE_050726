'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FAQAccordion } from '@/components/public/FAQAccordion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      { label: '50 property lookups/mo', included: true },
      { label: 'Basic search filters', included: true },
      { label: 'Owner information', included: true },
      { label: 'Skip tracing', included: false },
      { label: 'Marketing tools', included: false },
      { label: 'Market analytics', included: false },
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: 49,
    description: 'For serious investors',
    features: [
      { label: '500 property lookups/mo', included: true },
      { label: 'Advanced search filters', included: true },
      { label: 'Owner information', included: true },
      { label: '25 skip traces/mo', included: true },
      { label: '100 mail pieces/mo', included: true },
      { label: 'Market analytics', included: false },
    ],
    cta: 'Get Started',
    href: '/signup?plan=basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 99,
    description: 'For active investors',
    features: [
      { label: '2,000 property lookups/mo', included: true },
      { label: 'Advanced search filters', included: true },
      { label: 'Owner information', included: true },
      { label: '100 skip traces/mo', included: true },
      { label: '500 mail pieces/mo', included: true },
      { label: 'Market analytics', included: true },
    ],
    cta: 'Get Started',
    href: '/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Team',
    price: 249,
    description: 'For teams and power users',
    features: [
      { label: 'Unlimited property lookups', included: true },
      { label: 'Advanced search filters', included: true },
      { label: 'Owner information', included: true },
      { label: '500 skip traces/mo', included: true },
      { label: '2,000 mail pieces/mo', included: true },
      { label: 'Market analytics', included: true },
    ],
    cta: 'Get Started',
    href: '/signup?plan=team',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
  },
  {
    question: 'What counts as a property lookup?',
    answer:
      'A property lookup is counted each time you view detailed information about a specific property, including owner details, property characteristics, and sales history.',
  },
  {
    question: 'How does skip tracing work?',
    answer:
      'Skip tracing uses multiple data sources to find current contact information for property owners, including phone numbers and email addresses.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take security seriously. All data is encrypted in transit and at rest. We are SOC 2 compliant and follow industry best practices.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 7-day money-back guarantee for new subscriptions. Contact our support team within 7 days of your purchase for a full refund.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing period.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Our Free plan gives you access to basic features indefinitely. You can upgrade to a paid plan at any time when you are ready for more features.',
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Choose the plan that fits your investment strategy. Start free and scale
          as you grow.
        </p>

        {/* Annual/Monthly Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium ${
              !isAnnual ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? 'bg-[#1a56db]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                isAnnual ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              isAnnual ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Annual
          </span>
          <span className="text-xs font-semibold text-[#f97316] bg-[#f97316]/10 px-2 py-1 rounded-full">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 ${
              plan.highlighted
                ? 'border-[#1a56db] shadow-lg ring-2 ring-[#1a56db]/20'
                : 'border-gray-200'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#1a56db] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${isAnnual ? Math.round(plan.price * 0.8) : plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500">/month</span>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-[#1a56db] flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 flex-shrink-0 text-gray-300">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <span
                    className={`text-sm ${
                      feature.included ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={`w-full ${
                plan.highlighted
                  ? 'bg-[#1a56db] hover:bg-[#1e40af] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <FAQAccordion items={faqs} />
      </div>
    </div>
  );
}
