import { createClient } from '@supabase/supabase-js';
import { demoProperties } from '../src/lib/demo-data';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the project root (one level up from /scripts)
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`🔍 Checking env file at: ${envPath}`);
console.log(`URL: ${url ? '✅ Found' : '❌ Missing'}`);
console.log(`Key: ${key ? '✅ Found' : '❌ Missing'}`);

if (!url || !key) {
  console.error('❌ Error: Missing required Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seedDatabase() {
  console.log('🚀 Starting database seeding...');

  const { data, error } = await supabase
    .from('properties')
    .insert(
      demoProperties.map(prop => ({
        address: prop.address,
        city: prop.city,
        state: prop.state,
        zip: prop.zip,
        property_type: prop.property_type,
        owner_name: prop.owner_name,
        owner_type: prop.owner_type,
        estimated_value: prop.estimated_value,
        equity: prop.equity,
        equity_percent: prop.equity_percent,
        loan_balance: prop.loan_balance,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sqft: prop.sqft,
        latitude: prop.latitude,
        longitude: prop.longitude,
        listing_status: prop.listing_status,
        days_on_market: prop.days_on_market,
        lot_size: prop.lot_size,
        year_built: prop.year_built,
      }))
    );

  if (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${demoProperties.length} properties!`);
}

seedDatabase();
