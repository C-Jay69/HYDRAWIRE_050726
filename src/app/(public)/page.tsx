import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FeatureCard } from '@/components/public/FeatureCard';
import { TestimonialCard } from '@/components/public/TestimonialCard';
import {
  Search,
  User,
  Calculator,
  Mail,
  BarChart3,
  Phone,
  Check,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Property Search',
    description:
      'Search over 160 million properties with our intuitive map-based interface. Filter by location, price, property type, and more.',
  },
  {
    icon: User,
    title: 'Owner Information',
    description:
      'Get detailed owner information including names, mailing addresses, and property ownership history instantly.',
  },
  {
    icon: Calculator,
    title: 'Deal Analysis',
    description:
      'Analyze deals with our powerful ARV calculator, 70% rule calculator, and automated comparable sales analysis.',
  },
  {
    icon: Mail,
    title: 'Marketing Tools',
    description:
      'Build targeted marketing lists and send direct mail campaigns with our integrated marketing tools.',
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description:
      'Access real-time market trends, hot markets, and detailed neighborhood analytics to find the best opportunities.',
  },
  {
    icon: Phone,
    title: 'Skip Tracing',
    description:
      'Find phone numbers and email addresses for property owners to reach them directly.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Search',
    description: 'Find properties using our advanced filters and interactive map',
  },
  {
    number: '2',
    title: 'Analyze',
    description: 'Evaluate equity, ARV, and deal potential with our analysis tools',
  },
  {
    number: '3',
    title: 'Contact',
    description: 'Build lists and run marketing campaigns to reach owners',
  },
];

const testimonials = [
  {
    quote:
      'PropStream has completely transformed how I find deals. I used to spend hours on county websites, now I find properties in minutes.',
    authorName: 'Michael Rodriguez',
    authorTitle: 'Real Estate Investor, 50+ deals',
  },
  {
    quote:
      'The skip tracing feature alone has saved me thousands of dollars per month. My conversion rate has doubled since switching.',
    authorName: 'Sarah Chen',
    authorTitle: 'Wholesale Real Estate, Houston TX',
  },
  {
    quote:
      'Best investment I have made for my real estate business. The data accuracy is incredible and the interface is so intuitive.',
    authorName: 'James Thompson',
    authorTitle: 'House Flipping, Dallas TX',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a56db]/5 via-transparent to-[#f97316]/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIHN0cm9rZT0iIzFhNTZkYiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40" />

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Investment-Ready Properties in{' '}
            <span className="text-[#1a56db]">Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Access 160+ million property records, analyze deals, and build
            marketing lists without the spreadsheets.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter address, city, or zip code..."
                className="h-12 text-base flex-1"
              />
              <Button
                size="lg"
                className="h-12 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1a56db]">160M+</p>
              <p className="text-sm text-gray-600">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1a56db]">98%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1a56db]">10K+</p>
              <p className="text-sm text-gray-600">Investors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Find Deals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform gives you all the tools you need to
              find, analyze, and market investment properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#1a56db]/20" />
                )}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a56db] text-white text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by 10,000+ Real Estate Investors
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers are saying about PropStream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.authorName}
                quote={testimonial.quote}
                authorName={testimonial.authorName}
                authorTitle={testimonial.authorTitle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a56db] to-[#1e40af]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Finding Deals Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Free to start. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-8"
              asChild
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#1a56db] px-8"
              asChild
            >
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
