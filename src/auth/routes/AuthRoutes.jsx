import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { LandingPage } from "../pages/LandingPage.jsx";
import { RegisterBreweryPage } from "../pages/RegisterBreweryPage.jsx";
import { RegisterDeliveryPage } from "../pages/RegisterDeliveryPage.jsx"
import { RegisterProvPage } from "../pages/RegisterProvPage.jsx";


export const AuthRoutes = () => {

 return (
    <>

     <Routes>
      <Route path="brews_express" element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
       <Route path="register" element={<RegisterPage />} />
       <Route path="register_brewery" element={<RegisterBreweryPage />} />
       <Route path="register_delivery" element={<RegisterDeliveryPage />} />
        <Route path="register_prov" element={<RegisterProvPage />} />

    
       
      <Route path="/*" element={<Navigate to={"/auth/brews_express"} />} />
      </Routes>
    </>
  );
};

