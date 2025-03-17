// /home/martin/MyProjects/nedschroef/nedconvert/src/stores/auth.ts

import { defineStore } from 'pinia';
import {createClient } from '@supabase/supabase-js';
import {type Ref, ref, watch} from "vue";

const supabaseUrl: string = 'https://autsdpmpcxbqltteppib.supabase.co';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

type UseAuthStoreReturn = ErrorLoading & {
  user: Ref<User | null>;
  isLoggedIn: Ref<boolean | false>;
  isAuthenticated: () => boolean;
  currentUser: () => User | null;
  login: (credentials: { user: string; pass: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: User) => void;
  removeUser: () => void;
};

interface ErrorLoading {
  loading: Ref<boolean>;
  error: Ref<string | null>;
}

export interface User {
  username: string;
  password?: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore('auth', (): UseAuthStoreReturn =>  {

    /* states */

    const user: Ref<User | null> = ref(null);
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);
    const isLoggedIn: Ref<boolean> = ref(false);

    /* actions */

    const isAuthenticated = (): boolean => isLoggedIn.value;
    const currentUser = (): User | null => user.value;

    const login = async (credentials: { user: string; pass: string }): Promise<void> => {
      loading.value = true;
      error.value = null;
      try {
        const {data, error: supabaseError } = await supabase
          .from('users')
          .select('username, password, email, role')
          .eq('username', credentials.user.toString())
          .single();
        if (supabaseError) {
          console.log('There was an error while accessing the API. ',error);
          throw supabaseError;  // Re-throw the error to be caught by the catch block
        }

        if (data ) {
          if (data.password === credentials.pass) {
            user.value = data as User;
            isLoggedIn.value = true;
            setUser(data as User);
          } else {
            error.value = 'Invalid username or password';
            isLoggedIn.value = false;
          }
        }
      } catch (error: any) {
        error.value = error.message || 'An unexpected error occurred during login.';
        isLoggedIn.value = false;
      } finally {
        loading.value = false;
      }
    }

    const logout = async (): Promise<void> => {
      loading.value = true;
      error.value = null;
      try {
        // In a real app, you might want to invalidate a session token here
        user.value = null;
        isLoggedIn.value = false;
        removeUser();
      } catch (error: any) {
        error.value = error.message || 'An unexpected error occurred during logout.';
      } finally {
        loading.value = false;
      }
    }

    const checkSession = async (): Promise<void> => {
      loading.value = true;
      error.value = null;
      try {
        // Check if there is a user in local storage or session storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          user.value = JSON.parse(storedUser);
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      } catch (error: any) {
        error.value = error.message || 'An unexpected error occurred during session check.';
        isLoggedIn.value = false;
      } finally {
        loading.value = false;
      }
    }
    const setUser = (newUser: User): void => {
      user.value = newUser;
      newUser.password = "************";
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    const removeUser = (): void => {
      user.value = null;
      localStorage.removeItem('user');
    }

    return {
      user,
      loading,
      error,
      isLoggedIn,
      isAuthenticated,
      currentUser,
      login,
      logout,
      checkSession,
      setUser,
      removeUser
    }
});