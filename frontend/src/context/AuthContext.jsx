import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, verifySupabaseConnection } from '../services/supabase';

const AuthContext = createContext();

const LOCAL_DEMO_USER = {
  id: 'demo-user-balcony-01',
  email: 'gardener@urbanfarming.org',
  user_metadata: {
    full_name: 'Aarav Patel',
    location_name: 'Bandra West, Mumbai',
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Initialize session and listeners
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          // Check live connectivity
          const conn = await verifySupabaseConnection();
          if (mounted) setConnectionStatus(conn);

          // Get active cloud session
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (mounted) {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setLoading(false);
          }

          // Listen for auth state transitions (login, logout, token refresh, password recovery)
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (mounted) {
              setSession(newSession);
              setUser(newSession?.user ?? null);
              setLoading(false);
            }
          });

          return () => {
            subscription?.unsubscribe();
          };
        } catch (err) {
          console.warn('Supabase auth initialization error:', err.message);
          if (mounted) {
            setUser(null);
            setSession(null);
            setLoading(false);
            setConnectionStatus({
              connected: false,
              mode: 'connection_error',
              message: err.message
            });
          }
        }
      } else {
        // Explicit Local Development Mode
        if (mounted) {
          setConnectionStatus({
            connected: false,
            mode: 'local_development',
            message: 'Running in explicit local development mode. Cloud Supabase credentials are not populated in .env.'
          });
        }

        try {
          const savedSession = localStorage.getItem('flora_auth_session');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.user) {
              if (mounted) {
                setUser(parsed.user);
                setSession(parsed);
              }
            }
          } else {
            // New visitor: clean unauthenticated state
            if (mounted) {
              setUser(null);
              setSession(null);
            }
          }
        } catch (e) {
          localStorage.removeItem('flora_auth_session');
          if (mounted) {
            setUser(null);
            setSession(null);
          }
        } finally {
          if (mounted) setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Cloud Supabase or Local Sign In
   */
  const signIn = async (email, password) => {
    setAuthError(null);

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = new Error('Please enter a valid email address.');
      setAuthError(err.message);
      throw err;
    }
    if (!password || password.length < 6) {
      const err = new Error('Password must be at least 6 characters long.');
      setAuthError(err.message);
      throw err;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setAuthError(error.message);
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      return data;
    } else {
      // Local development authentication
      const userRecord = {
        id: cleanEmail === LOCAL_DEMO_USER.email ? LOCAL_DEMO_USER.id : 'user-' + Date.now(),
        email: cleanEmail,
        user_metadata: {
          full_name: cleanEmail === LOCAL_DEMO_USER.email
            ? LOCAL_DEMO_USER.user_metadata.full_name
            : cleanEmail.split('@')[0],
          location_name: 'Bandra West, Mumbai',
        }
      };

      const sessionRecord = {
        user: userRecord,
        access_token: 'demo-local-token',
        created_at: new Date().toISOString()
      };

      setUser(userRecord);
      setSession(sessionRecord);
      localStorage.setItem('flora_auth_session', JSON.stringify(sessionRecord));
      return { user: userRecord, session: sessionRecord };
    }
  };

  /**
   * Cloud Supabase or Local Sign Up
   */
  const signUp = async (email, password, fullName = '') => {
    setAuthError(null);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();

    if (!cleanName || cleanName.length < 2) {
      const err = new Error('Please enter your full name (at least 2 characters).');
      setAuthError(err.message);
      throw err;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = new Error('Please enter a valid email address.');
      setAuthError(err.message);
      throw err;
    }
    if (!password || password.length < 6) {
      const err = new Error('Password must be at least 6 characters long.');
      setAuthError(err.message);
      throw err;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            location_name: 'Bandra West, Mumbai',
          }
        }
      });

      if (error) {
        setAuthError(error.message);
        throw error;
      }

      // Check if project requires email confirmation
      if (data.user && !data.session) {
        return {
          user: data.user,
          session: null,
          requiresConfirmation: true,
          message: 'Account created! Please check your email to confirm your account before signing in.'
        };
      }

      setSession(data.session);
      setUser(data.user);
      return data;
    } else {
      // Local development sign up
      const userRecord = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        user_metadata: {
          full_name: cleanName,
          location_name: 'Bandra West, Mumbai',
        }
      };

      const sessionRecord = {
        user: userRecord,
        access_token: 'demo-local-token',
        created_at: new Date().toISOString()
      };

      setUser(userRecord);
      setSession(sessionRecord);
      localStorage.setItem('flora_auth_session', JSON.stringify(sessionRecord));
      return { user: userRecord, session: sessionRecord, requiresConfirmation: false };
    }
  };

  /**
   * One-Click Local Development / Demo Login
   */
  const signInDemo = async () => {
    setAuthError(null);
    const sessionRecord = {
      user: LOCAL_DEMO_USER,
      access_token: 'demo-local-token',
      created_at: new Date().toISOString()
    };
    setUser(LOCAL_DEMO_USER);
    setSession(sessionRecord);
    localStorage.setItem('flora_auth_session', JSON.stringify(sessionRecord));
    return { user: LOCAL_DEMO_USER, session: sessionRecord };
  };

  /**
   * Sign Out & Destroy Session
   */
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e.message);
      }
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem('flora_auth_session');
    localStorage.removeItem('flora_demo_user');
  };

  /**
   * Password Recovery Request
   */
  const resetPassword = async (email) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = new Error('Please enter a valid email address.');
      setAuthError(err.message);
      throw err;
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      return {
        success: true,
        message: 'Password reset link sent! Check your email inbox.'
      };
    } else {
      // Local development simulation
      return {
        success: true,
        message: 'Local development mode: In cloud mode, a password reset link would be emailed to ' + cleanEmail
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        isConfigured: isSupabaseConfigured,
        authMode: isSupabaseConfigured ? 'cloud_supabase' : 'local_development',
        connectionStatus,
        demoGardener: LOCAL_DEMO_USER,
        signIn,
        signUp,
        signInDemo,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
