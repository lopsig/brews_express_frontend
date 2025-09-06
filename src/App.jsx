import { AppRouter } from './router/AppRouter.jsx';
import { AuthProvider } from './auth/contexts/AuthContext.jsx';

export const App = () => {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>

    </>
  );
}

