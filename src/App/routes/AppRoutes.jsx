import { Navigate, Route, Routes } from "react-router-dom";
import {HomePage} from "../pages/HomePage"
import { CreateBrewPage } from "../pages/CreateBrewPage";
import { HomeProviderPage } from "../pages/HomeProviderPage";
import { HomeAdminPage } from "../pages/HomeAdminPage";
import { BrewsProviderPage } from "../pages/BrewsProviderPage";
import { ProfileProviderPage } from "../pages/ProfileProviderPage";
import { UpdateProfileProviderPage } from "../pages/UpdateProfileProviderPage";
import { UpdateBrewPage } from "../pages/UpdateBrewPage";
import { ProfileUserPage } from "../pages/ProfileUserPage";
import { UpdateProfileUserPage } from "../pages/UpdateProfileUserPage";
import { FavouritesUserPage } from "../pages/FavouritesUserPage";
import { AllUsersAdmin } from "../pages/AllUsersAdmin";
import { AllProviderAdmin } from "../pages/AllProviderAdmin";
import { UpdateProfileProviderAdmin } from "../pages/UpdateProfileProviderAdmin";
import { UpdateProfileUserAdmin } from "../pages/UpdateProfileUserAdmin";
import { OrdersProviderPage } from "../pages/OrdersProviderPage"
import { RoleBasedRoute } from "../../auth/guards/RouteGuards.jsx";
import { RoleBasedRedirect } from "../../router/AppRouter.jsx";


export const AppRoutes = () => {
  return (
    <Routes>

      <Route path="home" element={
        <RoleBasedRoute allowedRoles={['user']}>
          <HomePage />
        </RoleBasedRoute>
      } />
      <Route path="profile-user" element={
        <RoleBasedRoute allowedRoles={['user']}>
          <ProfileUserPage />
        </RoleBasedRoute>
      } />  
      <Route path="update-profile-user" element={
        <RoleBasedRoute allowedRoles={['user']}>
          <UpdateProfileUserPage />
        </RoleBasedRoute>
      } />
      <Route path="favourites-user" element={
        <RoleBasedRoute allowedRoles={['user']}>
          <FavouritesUserPage />
        </RoleBasedRoute>
      } />
      <Route path="home-provider" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <HomeProviderPage />
        </RoleBasedRoute>
      } />
      <Route path="create-brew" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <CreateBrewPage />
        </RoleBasedRoute>
      } />
      <Route path="brews-provider" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <BrewsProviderPage />
        </RoleBasedRoute>
      } />
      <Route path="profile-provider" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <ProfileProviderPage />
        </RoleBasedRoute>
      } />
      <Route path="update-profile-provider" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <UpdateProfileProviderPage />
        </RoleBasedRoute>
      } />
      <Route path="update-brew/:brewId" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <UpdateBrewPage />
        </RoleBasedRoute>
      } />
      <Route path="orders-provider" element={
        <RoleBasedRoute allowedRoles={['provider']}>
          <OrdersProviderPage />
        </RoleBasedRoute>
      } />
      <Route path="*" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <HomeAdminPage />
        </RoleBasedRoute>
      } />
      <Route path="home-admin" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <HomeAdminPage />
        </RoleBasedRoute>
      } />
      <Route path="all-users-admin" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <AllUsersAdmin />
        </RoleBasedRoute>
      } />
      <Route path="all-provider-admin" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <AllProviderAdmin />
        </RoleBasedRoute>
      } />
      <Route path="update-profile-provider-admin/:breweryId" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <UpdateProfileProviderAdmin />
        </RoleBasedRoute>
      } />
      <Route path="update-profile-user-admin/:userId" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <UpdateProfileUserAdmin />
        </RoleBasedRoute>
      } />


      <Route path="/*" element={<RoleBasedRedirect />} />



    </Routes>

  );
};


