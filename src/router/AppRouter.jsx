import { Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes.jsx";
import { AppRoutes } from "../App/routes/AppRoutes.jsx";




export const AppRouter  = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/*" element={<AuthRoutes />} />

      <Route path="/be/*" element={<AppRoutes />} />
      
      


    </Routes>
  );
};

