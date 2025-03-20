// /home/martin/MyProjects/nedschroef/nedconvert/src/stores/convertHistory.ts

import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type User } from './auth';

/** Supabase client credentials and configuration */
const supabaseUrl: string = 'https://autsdpmpcxbqltteppib.supabase.co';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Convert types */
export interface Convert {
  id: number;
  user_id: string;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
  created_at: string;
  user?: User; // Optional user data from the join
}

/** Convert history types */
interface ConvertHistoryState {
  converts: Ref<Convert[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
}

/** Convert history store return types */
type UseConvertHistoryStoreReturn = ConvertHistoryState & {
  fetchConvertHistory: () => Promise<void>;
  addConvert: (convert: Omit<Convert, 'id' | 'created_at'>) => Promise<void>;
};

/** Convert history store */
export const useConvertHistoryStore = defineStore('convertHistory', (): UseConvertHistoryStoreReturn => {
  const converts: Ref<Convert[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  /** Fetch convert history from Supabase */
  const fetchConvertHistory = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase
        .from('converts')
        .select('*, user:user_id(*)') // Join with the users table
        .order('created_at', { ascending: false }); // Order by most recent first

      if (supabaseError) {
        console.error('Error fetching convert history:', supabaseError);
        throw supabaseError;
      }

      if (data) {
        converts.value = data as Convert[];
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch convert history';
    } finally {
      loading.value = false;
    }
  };

  /** Add a new convert to Supabase */
  const addConvert = async (convert: Omit<Convert, 'id' | 'created_at'>): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const { error: supabaseError } = await supabase.from('converts').insert(convert);

      if (supabaseError) {
        console.error('Error adding convert:', supabaseError);
        throw supabaseError;
      }
      await fetchConvertHistory();
    } catch (err: any) {
      error.value = err.message || 'Failed to add convert';
    } finally {
      loading.value = false;
    }
  };

  return {
    converts,
    loading,
    error,
    fetchConvertHistory,
    addConvert,
  };
});