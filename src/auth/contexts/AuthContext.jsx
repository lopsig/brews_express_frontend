import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => { 
    const initializeAuth = async () => {
      try {
        // Verificar datos en sessionStorage
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");
        const id_user = sessionStorage.getItem("id_user");
        if (token && role && id_user) {
          // Si existen, actualizar el estado
          const userData = {
            token: token,
            role: role,
            id_user: id_user
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // En caso de error, limpiar datos corruptos
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("id_user");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    try {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", userData.role);
      sessionStorage.setItem("id_user", userData.id_user);
      setUser(userData);
      setIsAuthenticated(true);
      console.log("User logged in:", userData);
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Login failed");
    }

  };

  const logout = () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("id_user");
      setUser(null);
      setIsAuthenticated(false);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getToken = () => {
    return sessionStorage.getItem("token");
  }

  const getRole = () => {
    return sessionStorage.getItem("role");
  }

  const getIdUser = () => {
    return sessionStorage.getItem("id_user");
  }

  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
    getRole,
    hasAnyRole,
    getIdUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;