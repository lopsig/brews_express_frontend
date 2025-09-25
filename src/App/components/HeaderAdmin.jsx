import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";
import useAuth from '../../auth/hooks/useAuth.jsx';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL

export const HeaderAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const authenticatedAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });



  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await authenticatedAxios.get("/be/admin/all_users");
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    try {
      logout();
      navigate('/auth/brews_express');
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  const adminUser =
    users.find(u => u._id === user?.id_user)?.first_name
    + ' ' +
    users.find(u => u._id === user?.id_user)?.last_name || 'Admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-16 bg-white shadow-md">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }


  // Define el contenido del lado izquierdo de la barra de herramientas (Toolbar)
  const startContent = (
    <React.Fragment>

      <div className="flex items-center ml-3">
        <img
          height={100}
          src="/logo.png"
          alt="Logo de Brews Express"
          className='mr-2'
        />
      </div>
    </React.Fragment>
  );

  const centerContent = (
    <React.Fragment>
      <div className="hidden md:flex flex-grow justify-center mx-4">
        <p className="text-sm mt-2" style={{ color: '#000000ff' }}>
          User Admin: <span style={{ fontWeight: 'bold' }}>{adminUser}</span>
        </p>
      </div>
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
          style={{
            background: '#1F2937', // Negro grisáceo para el fondo del botón
            border: 'none',
            color: 'white',
            fontWeight: '600',
            padding: '10px 24px',
            boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
          }}

        />
      </div>
    </React.Fragment>
  );


  return (
    <>
      {/* Componente Sidebar de PrimeReact */}

      {/* Encabezado principal usando el componente Toolbar */}
      <Toolbar
        start={startContent}
        center={centerContent}
        end={endContent}
        className="p-4 shadow-md bg-white rounded-lg" />
    </>
  );
};




