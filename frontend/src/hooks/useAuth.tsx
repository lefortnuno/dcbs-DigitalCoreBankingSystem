import { useState, createContext, useContext, useEffect } from 'react';
import type { JSX, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SyncUser, User } from '../types';
import apiService from '../services/api.service';
import { keycloak, initOptions } from '../keycloak';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const authenticated = await keycloak.init(initOptions);

        if (authenticated) {
          setIsAuthenticated(true);
          setToken(keycloak.token || null);
          apiService.setToken(keycloak.token || '');

          const keycloakUser: User = {
            idUser: keycloak.subject || '',
            username: keycloak.tokenParsed?.preferred_username || '',
            email: keycloak.tokenParsed?.email || '',
            firstName: keycloak.tokenParsed?.given_name || '',
            lastName: keycloak.tokenParsed?.family_name || '',
          };
          
          const syncUser: SyncUser = {
            idUser: keycloak.subject || '',
            username: keycloak.tokenParsed?.preferred_username || '',
          };  
          
          await apiService.ensureUser(syncUser);
          setUser(keycloakUser);
          navigate('/profile');
        }
      } catch (err) {
        console.error('Erreur Keycloak:', err);
        setError('Erreur lors de l’authentification Keycloak');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigate]);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        error,
        isAuthenticated,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
