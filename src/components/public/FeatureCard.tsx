import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-[#1a56db]/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#1a56db]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
