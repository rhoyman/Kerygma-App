import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, githubProvider, isFirebaseEnabled } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider?: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (provider: 'google' | 'github' = 'google') => {
    if (!auth) throw new Error('Firebase no está configurado');
    const authProvider = provider === 'github' ? githubProvider : googleProvider;
    try {
      await signInWithPopup(auth, authProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        alert('El inicio de sesión ha sido bloqueado por el navegador. Por favor, permite las ventanas emergentes en este sitio para poder acceder.');
      } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        // Silently handle if user just closed the popup
        console.log('Login cancelled by user');
      } else {
        console.error('Error in login:', error);
        alert('Error al iniciar sesión: ' + error.message);
      }
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isFirebaseEnabled }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
