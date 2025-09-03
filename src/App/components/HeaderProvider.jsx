
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";
import useAuth from '../../auth/hooks/useAuth';

export const HeaderProvider = ({ onSearch }) => {  // ✅ Agregamos prop onSearch
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // ✅ Estado para búsqueda
  const navigate = useNavigate();

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/auth/brews_express');
  };

  // ✅ Función para manejar la búsqueda
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      onSearch(searchTerm);
    }
  };

  // ✅ Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const startContent = (
    <React.Fragment>
      <span className="text-xl font-bold text-gray-800 ml-2">
        Brews Express
      </span>
    </React.Fragment>
  );

  // ✅ Búsqueda funcional en el centro
  const centerContent = (
    <React.Fragment>
      <div className="hidden md:flex flex-grow justify-center mx-4">
        <div className="p-inputgroup w-full max-w-sm">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
          </span>
          <InputText
            placeholder="Buscar mis cervezas..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
          {searchTerm && (
            <Button
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleClearSearch}
              tooltip="Limpiar búsqueda"
            />
          )}
          <Button
            icon="pi pi-search"
            className="p-button-primary"
            onClick={handleSearch}
            tooltip="Buscar"
          />
        </div>
      </div>
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <div className="hidden md:flex">
        <Button
          label="Mi Cuenta"
          className="p-button-outlined p-button-lg mr-2"
          onClick={() => navigate('/be/profile-provider')}
        />
        <Button
          label="Cerrar Sesión"
          className="p-button-outlined p-button-lg mr-2"
          onClick={handleLogout}
        />
      </div>
    </React.Fragment>
  );

  return (
    <>
      <Toolbar start={startContent} center={centerContent} end={endContent} className="p-4 shadow-md bg-white rounded-lg" />
    </>
  );
};