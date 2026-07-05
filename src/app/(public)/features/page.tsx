import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/public/FeatureCard';
import { Check, Search, User, Calculator, Mail, BarChart3, Phone } from 'lucide-react';
import Link from 'next/link';

const featureSections = [
  {
    id: 'property-search',
    title: 'Property Search',
    description:
      'Search over 160 million properties with our intuitive map-based interface. Use advanced filters to find exactly what you are looking for.',
    bullets: [
      'Interactive map with satellite view',
      'Filter by price, size, property type',
      'Search by owner name or address',
      'Save searches and get alerts',
    ],
    icon: Search,
    imageAlt: 'Property search interface',
  },
  {
    id: 'owner-information',
    title: 'Owner Information',
    description:
      'Get detailed owner information for any property. Know who owns the property, their mailing address, and ownership history.',
    bullets: [
      'Owner names and addresses',
      'Ownership history',
      'Tax assessment details',
      'Loan information when available',
    ],
    icon: User,
    imageAlt: 'Owner information display',
  },
  {
    id: 'deal-analysis',
    title: 'Deal Analysis',
    description:
      'Analyze deals with our powerful tools. Calculate ARV, apply the 70% rule, and compare with comparable sales.',
    bullets: [
      'After Repair Value (ARV) calculator',
      '70% rule calculator',
      'Comparable sales analysis',
      'ROI projections',
    ],
    icon: Calculator,
    imageAlt: 'Deal analysis tools',
  },
  {
    id: 'marketing-campaigns',
    title: 'Marketing Campaigns',
    description:
      'Build targeted marketing lists and run campaigns directly from PropStream. Reach property owners through direct mail and email.',
    bullets: [
      'Direct mail campaigns',
      'Email marketing',
      'Pre-written templates',
      'Campaign tracking',
    ],
    icon: Mail,
    imageAlt: 'Marketing campaign tools',
  },
  {
    id: 'market-analytics',
    title: 'Market Analytics',
    description:
      'Access real-time market data and trends. Find hot markets, analyze neighborhoods, and make data-driven decisions.',
    bullets: [
      'Market trend analysis',
      'Neighborhood comparisons',
      'Rental rate estimates',
      'Appreciation data',
    ],
    icon: BarChart3,
    imageAlt: 'Market analytics dashboard',
  },
  {
    id: 'skip-tracing',
    title: 'Skip Tracing',
    description:
      'Find current contact information for property owners. Get phone numbers and email addresses to reach them directly.',
    bullets: [
      'Phone number lookup',
      'Email address finder',
      'Multiple data sources',
      'High accuracy rates',
    ],
    icon: Phone,
    imageAlt: 'Skip tracing tools',
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Everything You Need to Find Deals
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful tools designed for real estate investors. Find properties,
          analyze deals, and run marketing campaigns all in one place.
        </p>
      </div>

      {/* Feature Sections */}
      <div className="space-y-24">
        {featureSections.map((feature, index) => (
          <div
            key={feature.id}
            id={feature.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Content */}
            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#1a56db]/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-[#1a56db]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {feature.title}
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-3 mb-8">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#1a56db] flex-shrink-0" />
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="bg-[#1a56db] hover:bg-[#1e40af] text-white"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Image Placeholder */}
            <div
              className={`bg-gradient-to-br from-[#1a56db]/10 to-[#f97316]/10 rounded-2xl aspect-video flex items-center justify-center ${
                index % 2 === 1 ? 'lg:order-1' : ''
              }`}
            >
              <div className="text-center">
                <feature.icon className="w-16 h-16 text-[#1a56db]/30 mx-auto mb-4" />
                <p className="text-sm text-gray-500">{feature.imageAlt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Find Your Next Deal?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of investors using PropStream to find deals.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold"
        >
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </div>
    </div>
  );
}
