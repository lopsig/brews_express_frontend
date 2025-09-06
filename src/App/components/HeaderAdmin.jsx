import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";
import useAuth from '../../auth/hooks/useAuth.jsx';

export const HeaderAdmin = () => {

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      navigate('/auth/brews_express');
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  // Define el contenido del lado izquierdo de la barra de herramientas (Toolbar)
  const startContent = (
    <React.Fragment>

      <span className="text-xl font-bold text-gray-800 ml-2">
        Brews Express
      </span>
    </React.Fragment>
  );



  // Define el contenido del lado derecho de la barra de herramientas (Toolbar)
  const endContent = (
    <React.Fragment>
      <div className="hidden md:flex">

        <Button
          label="Cerrar Sesión"
          className="p-button-primary p-button-lg"
          onClick={handleLogout}
        />
      </div>
    </React.Fragment>
  );


  return (
    <>
      {/* Componente Sidebar de PrimeReact */}

      {/* Encabezado principal usando el componente Toolbar */}
      <Toolbar start={startContent} end={endContent} className="p-4 shadow-md bg-white rounded-lg" />
    </>
  );
};




