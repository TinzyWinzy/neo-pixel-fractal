import { h, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'admin' or 'user'

  function login(role = 'user') {
    setIsLoggedIn(true);
    setUserRole(role);
  }
  function logout() {
    setIsLoggedIn(false);
    setUserRole('user');
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 