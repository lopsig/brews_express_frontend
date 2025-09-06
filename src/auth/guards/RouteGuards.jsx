import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";


const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <p>Cargando...</p>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/brews_express" replace/>;
  }

  return children;
};

export const PublicRoute = ({ children }) => {

  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) { 
    const userRole = user.role;
    if (userRole === 'admin') {
      return <Navigate to="/be/home-admin" replace />;
    } else if (userRole === 'provider') {
      return <Navigate to="/be/home-provider" replace />;
    } else if (userRole === 'user') {
      return <Navigate to="/be/home" replace />;
    }
    return <Navigate to="/auth/brews_express" replace />;
  } 
  return children;
};


// 3. RoleBasedRoute - Solo para usuarios con roles específicos
export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();

  // Mostrar loading mientras se inicializa la autenticación
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/brews_express" replace />;
  }

  // Verificar rol manualmente si hasAnyRole no está disponible
  const userHasValidRole = () => {
    if (!user || !user.role) return false;

    // Si hasAnyRole está disponible, usarla
    if (hasAnyRole && typeof hasAnyRole === 'function') {
      return hasAnyRole(allowedRoles);
    }

    // Si no, verificar manualmente
    return allowedRoles.includes(user.role);
  };

  // Si está autenticado pero no tiene el rol correcto
  if (!userHasValidRole()) {
    // En lugar de ir a /unauthorized, redirigir a su home correspondiente
    const userRole = user?.role;
    if (userRole === 'admin') {
      return <Navigate to="/be/home-admin" replace />;
    } else if (userRole === 'provider') {
      return <Navigate to="/be/home-provider" replace />;
    } else if (userRole === 'user') {
      return <Navigate to="/be/home" replace />;
    }

    // Fallback al login si no tiene rol reconocido
    return <Navigate to="/auth/login" replace />;
  }

  // Si tiene el rol correcto, mostrar el contenido
  return children;
};