import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as strapiLogin, register as strapiRegister, forgotPassword as strapiForgotPassword, resetPassword as strapiResetPassword, verifyEmail as strapiVerifyEmail, sendEmailConfirmation as strapiSendEmailConfirmation, changePassword as strapiChangePassword, refreshToken as strapiRefreshToken, createAuthenticatedApi } from '../services/strapi';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
  profileImage?: {
    data?: {
      attributes?: {
        url?: string;
      };
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (code: string, password: string, passwordConfirmation: string) => Promise<void>;
  verifyEmail: (confirmation: string) => Promise<void>;
  sendEmailConfirmation: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  verifyEmail: async () => {},
  sendEmailConfirmation: async () => {},
  changePassword: async () => {},
  isLoading: true,
  error: null,
});

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTokenRefresh = useCallback(async (token: string, refreshToken: string) => {
    try {
      const response = await strapiRefreshToken(token, refreshToken);
      const newExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

      await Promise.all([
        AsyncStorage.setItem('token', response.jwt),
        AsyncStorage.setItem('refreshToken', response.refreshToken),
        AsyncStorage.setItem('tokenExpiry', newExpiry.toString()),
      ]);

      setAuthState(prev => ({
        ...prev,
        token: response.jwt,
        refreshToken: response.refreshToken,
        tokenExpiry: newExpiry,
      }));

      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  }, []);

  // Setup authenticated API instance
  useEffect(() => {
    if (authState.token && authState.refreshToken) {
      createAuthenticatedApi(authState.token, authState.refreshToken, handleTokenRefresh);
    }
  }, [authState.token, authState.refreshToken, handleTokenRefresh]);

  // Auto refresh token
  useEffect(() => {
    if (!authState.token || !authState.refreshToken || !authState.tokenExpiry) return;

    const timeUntilRefresh = authState.tokenExpiry - Date.now() - TOKEN_REFRESH_THRESHOLD;
    
    if (timeUntilRefresh <= 0) {
      handleTokenRefresh(authState.token, authState.refreshToken);
      return;
    }

    const refreshTimer = setTimeout(() => {
      handleTokenRefresh(authState.token!, authState.refreshToken!);
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [authState.token, authState.refreshToken, authState.tokenExpiry, handleTokenRefresh]);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedUser, storedToken, storedRefreshToken, storedExpiry] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('refreshToken'),
          AsyncStorage.getItem('tokenExpiry'),
        ]);
        
        if (storedUser && storedToken && storedRefreshToken && storedExpiry) {
          const parsedUser = JSON.parse(storedUser);
          const expiryTime = parseInt(storedExpiry, 10);

          if (Date.now() >= expiryTime - TOKEN_REFRESH_THRESHOLD) {
            const response = await handleTokenRefresh(storedToken, storedRefreshToken);
            setAuthState({
              user: parsedUser,
              token: response.jwt,
              refreshToken: response.refreshToken,
              tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
            });
          } else {
            setAuthState({
              user: parsedUser,
              token: storedToken,
              refreshToken: storedRefreshToken,
              tokenExpiry: expiryTime,
            });
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        setError('Failed to load authentication state');
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await strapiLogin({ identifier: email, password });
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
        AsyncStorage.setItem('token', response.jwt),
        AsyncStorage.setItem('refreshToken', response.refreshToken),
        AsyncStorage.setItem('tokenExpiry', expiryTime.toString()),
      ]);

      setAuthState({
        user: response.user,
        token: response.jwt,
        refreshToken: response.refreshToken,
        tokenExpiry: expiryTime,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('Invalid email or password');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await strapiRegister({ username, email, password, name });
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
        AsyncStorage.setItem('token', response.jwt),
        AsyncStorage.setItem('refreshToken', response.refreshToken),
        AsyncStorage.setItem('tokenExpiry', expiryTime.toString()),
      ]);

      setAuthState({
        user: response.user,
        token: response.jwt,
        refreshToken: response.refreshToken,
        tokenExpiry: expiryTime,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setError('Too many registration attempts. Please try again later.');
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('refreshToken'),
        AsyncStorage.removeItem('tokenExpiry'),
      ]);

      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiry: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await strapiForgotPassword({ email });
    } catch (error) {
      console.error('Forgot password failed:', error);
      setError('Failed to send password reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (code: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await strapiResetPassword({ code, password, passwordConfirmation });
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
        AsyncStorage.setItem('token', response.jwt),
        AsyncStorage.setItem('refreshToken', response.refreshToken),
        AsyncStorage.setItem('tokenExpiry', expiryTime.toString()),
      ]);

      setAuthState({
        user: response.user,
        token: response.jwt,
        refreshToken: response.refreshToken,
        tokenExpiry: expiryTime,
      });
    } catch (error) {
      console.error('Reset password failed:', error);
      setError('Failed to reset password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (confirmation: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await strapiVerifyEmail(confirmation);
    } catch (error) {
      console.error('Email verification failed:', error);
      setError('Failed to verify email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailConfirmation = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await strapiSendEmailConfirmation(email);
    } catch (error) {
      console.error('Send email confirmation failed:', error);
      setError('Failed to send email confirmation');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!authState.user?.id || !authState.token) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);
    try {
      await strapiChangePassword(currentPassword, newPassword, authState.user.id, authState.token);
    } catch (error) {
      console.error('Change password failed:', error);
      setError('Failed to change password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!authState.token,
        user: authState.user,
        token: authState.token,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        sendEmailConfirmation,
        changePassword,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
