import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes.jsx";
import { AppRoutes } from "../App/routes/AppRoutes.jsx";
import { ProtectedRoute, PublicRoute } from "../auth/guards/RouteGuards.jsx";
import useAuth from "../auth/hooks/useAuth.jsx";




export const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();


  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/brews_express" replace />

  }

  // Redirigir según el rol del usuario
  const userRole = user?.role;
  if (userRole === 'admin') {
    return <Navigate to="/be/home-admin" replace />;
  } else if (userRole === 'provider') {
    return <Navigate to="/be/home-provider" replace />;
  } else if (userRole === 'user') {
    return <Navigate to="/be/home" replace />;
  }

  // Fallback por si el rol no es reconocido
  return <Navigate to="/auth/login" replace />;
};

export const AppRouter  = () => {
  return (
    <Routes>
      <Route path="/auth/*"
        element={
        <PublicRoute>
          <AuthRoutes />
        </PublicRoute>
      }
      />

      <Route path="/be/*" element={
        <ProtectedRoute>
          <AppRoutes />
        </ProtectedRoute>
      } />

      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<RoleBasedRedirect />} />





    </Routes>
  );
};

