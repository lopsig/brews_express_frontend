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
// import { AllBrewsAdmin } from "../pages/AllBrewsAdmin";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<HomePage />} />
      <Route path="home-provider" element={<HomeProviderPage />} />
      <Route path="home-admin" element={<HomeAdminPage />} />
      <Route path="create-brew" element={<CreateBrewPage />} />
      <Route path="brews-provider" element={<BrewsProviderPage />} />
      <Route path="profile-provider" element={<ProfileProviderPage />} />
      <Route path="update-profile-provider" element={<UpdateProfileProviderPage />} />
      <Route path="update-brew/:brewId" element={<UpdateBrewPage />} />
      <Route path="profile-user" element={<ProfileUserPage />} />
      <Route path="update-profile-user" element={<UpdateProfileUserPage />} />
      <Route path="favourites-user" element={<FavouritesUserPage />} />
      <Route path="all-users-admin" element={<AllUsersAdmin />} />
      <Route path="all-provider-admin" element={<AllProviderAdmin />} />
      <Route path="update-profile-provider-admin/:breweryId" element={<UpdateProfileProviderAdmin />} />
      <Route path="update-profile-user-admin/:userId" element={<UpdateProfileUserAdmin />} />
      <Route path="orders-provider" element={<OrdersProviderPage />} />

      {/* <Route path="all-brews-admin/:breweryId" element={<AllBrewsAdmin />} /> */}
      <Route path="/*" element={<Navigate to={"/be/home"} />} />
    </Routes>
  );
};


