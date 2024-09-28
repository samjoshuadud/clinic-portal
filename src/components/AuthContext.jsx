// File: src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Implement login logic
    setUser(userData);
  };

  const logout = () => {
    // Implement logout logic
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



// Usage in App.js
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ... */}
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <ProtectedRoute
            path="/patients"
            component={PatientList}
            allowedRoles={['doctor', 'staff', 'admin']}
          />
          <ProtectedRoute
            path="/patient/:id"
            component={PatientProfile}
            allowedRoles={['doctor', 'staff', 'admin']}
          />
          {/* ... */}
        </Switch>
      </Router>
    </AuthProvider>
  );
}