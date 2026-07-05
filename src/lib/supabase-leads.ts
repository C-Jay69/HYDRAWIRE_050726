import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Temporary Admin User ID for single-user mode
const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function getLiveLeads(filters = {}) {
  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.minScore) {
    // Score logic not yet implemented in DB
  }

  if (filters.market) {
    query = query.eq('city', filters.market);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getSavedSearches() {
  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', ADMIN_USER_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveSearch(search: { name: string; filters: any; location: any; alert_frequency: string }) {
  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      ...search,
      user_id: ADMIN_USER_ID,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSavedSearch(id: string) {
  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateSavedSearch(id: string, updates: any) {
  const { data, error } = await supabase
    .from('saved_searches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- LEAD LISTS LOGIC ---

export async function getLeadLists() {
  const { data, error } = await supabase
    .from('lead_lists')
    .select('*')
    .eq('user_id', ADMIN_USER_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createLeadList(name: string, description: string) {
  const { data, error } = await supabase
    .from('lead_lists')
    .insert({
      name,
      description,
      user_id: ADMIN_USER_ID,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLeadList(id: string) {
  const { error } = await supabase
    .from('lead_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getPropertiesForList(listId: string) {
  const { data, error } = await supabase
    .from('list_properties')
    .select(`
      list_properties(status, tags, notes, added_at),
      properties(*)
    `)
    .eq('list_id', listId);

  if (error) throw error;

  // Flatten the structure to match the Property type expected by the UI
  return data.map(item => ({
    ...item.properties,
    status: item.list_properties.status,
    tags: item.list_properties.tags,
    notes: item.list_properties.notes,
  }));
}

export async function addPropertiesToList(listId: string, propertyIds: string[]) {
  const inserts = propertyIds.map(propertyId => ({
    list_id: listId,
    property_id: propertyId,
  }));

  const { error } = await supabase
    .from('list_properties')
    .insert(inserts);

  if (error) throw error;
}

export async function removePropertyFromList(listId: string, propertyId: string) {
  const { error } = await supabase
    .from('list_properties')
    .delete()
    .eq('list_id', listId)
    .eq('property_id', propertyId);

  if (error) throw error;
}

export async function updatePropertyStatusInList(listId: string, propertyId: string, status: string) {
  const { error } = await supabase
    .from('list_properties')
    .update({ status })
    .eq('list_id', listId)
    .eq('property_id', propertyId);

  if (error) throw error;
}

export async function bulkUpdatePropertyStatus(listId: string, propertyIds: string[], status: string) {
  // Supabase doesn't have a direct "update where in" for specific columns easily
  // We'll loop through the IDs for simplicity in this version
  for (const id of propertyIds) {
    await updatePropertyStatusInList(listId, id, status);
  }
}

export async function launchOutreach(leadIds: string[]) {
  // This will eventually trigger the Python engine on the G3
  // For now, we mark them as 'outreach_started' in the DB
  // Note: Using 'list_properties' because that's where the status lives
  const { data, error } = await supabase
    .from('list_properties')
    .update({ status: 'contacted' })
    .in('property_id', leadIds);

  if (error) throw error;
  return data;
}
