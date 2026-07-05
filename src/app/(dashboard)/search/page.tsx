import { getLiveLeads } from '@/lib/supabase-leads';
import PropertySearch from '@/components/PropertySearch';

export default async function SearchPage() {
  const leads = await getLiveLeads({ minScore: 0 });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Live Lead Search</h1>
      <PropertySearch initialProperties={leads} />
    </div>
  );
}
