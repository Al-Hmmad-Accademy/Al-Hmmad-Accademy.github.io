'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const C = createContext();

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://steps-accademy-backend-production.up.railway.app/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch(`${API}/auth/me`, {
      credentials: 'include',
    })
      .then(async (r) => {
        const x = await r.json().catch(() => ({}));

        if (!mounted) return;

        if (r.ok && x.user) {
          setUser(x.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (body) => {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const x = await r.json().catch(() => ({}));

    if (!r.ok) {
      throw new Error(x.message || 'Login failed');
    }

    if (x.requiresOtp) {
      return x;
    }

    setUser(x.user || null);
    return x;
  };

  const verify = async (body) => {
    const r = await fetch(`${API}/auth/verify-device`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const x = await r.json().catch(() => ({}));

    if (!r.ok) {
      throw new Error(x.message || 'Verification failed');
    }

    setUser(x.user || null);
    return x;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const r = await fetch(`${API}/auth/me`, {
        credentials: 'include',
      });

      const x = await r.json().catch(() => ({}));

      if (r.ok && x.user) {
        setUser(x.user);
        return x.user;
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  };

  return (
    <C.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        verify,
        logout,
        refreshUser,
        API,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);