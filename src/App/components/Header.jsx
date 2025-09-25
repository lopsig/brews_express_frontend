import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";
import useAuth from '../../auth/hooks/useAuth.jsx';

export const Header = ({ onSearch }) => {  // ✅ Agregamos prop onSearch
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // ✅ Estado para búsqueda
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

  const menuItems = [
    { label: 'Mis Favoritos', icon: 'pi pi-heart', page: '/be/favourites-user' },
    { label: 'Mi Cuenta', icon: 'pi pi-user', page: '/be/profile-user' },
  ];


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
      {/* Hamburger menu para móvil */}
      <Button
        icon="pi pi-bars"
        rounded
        text
        aria-label="Abrir menú"
        onClick={() => setSidebarVisible(true)}
        className="p-button-lg hover:bg-green-50"
        style={{
          color: '#374151',
          border: 'none',
          transition: 'all 0.3s ease'
        }}
      />

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

  // ✅ Búsqueda funcional en el centro
  const centerContent = (
    <React.Fragment>
      <div className="hidden md:flex flex-grow justify-center mx-4">
        <div className="p-inputgroup w-full max-w-md shadow-lg">
          <InputText
            placeholder="Buscar cerveza artesanal..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
            style={{
              border: '2px solid #D1D5DB', // Gris claro para el borde
              borderRight: 'none',
              fontSize: '1rem',
              padding: '12px 16px',
              color: '#374151' // Gris oscuro para el texto del input
            }}
          />
          {searchTerm && (
            <Button
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleClearSearch}
              tooltip="Limpiar búsqueda"
              style={{
                color: '#6B7280', // Gris medio para el icono de limpiar
                border: '2px solid #D1D5DB', // Gris claro para el borde
                borderLeft: 'none'
              }}
            />
          )}
          <Button
            icon="pi pi-search"
            className="p-button-primary"
            onClick={handleSearch}
            tooltip="Buscar"
            style={{
              background: '#374151', // Gris oscuro para el fondo del botón de búsqueda
              border: '2px solid #374151', // Gris oscuro para el borde
              borderLeft: 'none',
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Búsqueda para Tablet */}
      <div className="hidden md:flex lg:hidden flex-grow justify-center mx-2">
        <div className="p-inputgroup w-full max-w-sm">

          {searchTerm && (
            <Button
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleClearSearch}
              style={{
                color: '#6B7280',
                border: '2px solid #D1D5DB',
                borderLeft: 'none',
                padding: '8px 10px'
              }}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      {/* Botones para Desktop */}
      <div className="hidden lg:flex gap-3">
        <Button
          label="Mi Cuenta"
          icon="pi pi-user"
          className="p-button-outlined p-button-lg"
          onClick={() => navigate('/be/profile-user')}
          style={{
            color: '#6B7280',
            borderColor: '#6B7280',
            fontWeight: '600',
            padding: '10px 24px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#6B7280';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#6B7280';
          }}
        />
        <Button
          label="Cerrar Sesión"
          icon="pi pi-sign-out"
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #1F2937, #374151)',
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

      {/* Botones para Tablet */}
      <div className="hidden md:flex lg:hidden gap-2">
        <Button
          icon="pi pi-user"
          className="p-button-outlined"
          onClick={() => navigate('/be/profile-user')}
          tooltip="Mi Cuenta"
          style={{
            color: '#6B7280',
            borderColor: '#6B7280',
            fontWeight: '600',
            padding: '8px 12px',
            transition: 'all 0.3s ease'
          }}
        />
        <Button
          icon="pi pi-sign-out"
          onClick={handleLogout}
          tooltip="Cerrar Sesión"
          style={{
            background: 'linear-gradient(135deg, #1F2937, #374151)',
            border: 'none',
            color: 'white',
            fontWeight: '600',
            padding: '8px 12px',
            boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {/* Botón de búsqueda para móvil */}
      <div className="md:hidden">
        <Button
          icon="pi pi-search"
          rounded
          onClick={() => {
            const searchInput = document.createElement('div');
            searchInput.innerHTML = `
              <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: white;
                z-index: 9999;
                padding: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              ">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input 
                    id="mobile-search"
                    placeholder="Buscar mis cervezas..."
                    style="
                      flex: 1;
                      padding: 12px 16px;
                      border: 2px solid #D1D5DB;
                      border-radius: 8px;
                      font-size: 16px;
                      outline: none;
                    "
                    value="${searchTerm}"
                  />
                  <button 
                    id="mobile-search-btn"
                    style="
                      background: linear-gradient(135deg, #1F2937, #374151);
                      border: none;
                      color: white;
                      padding: 12px 16px;
                      border-radius: 8px;
                      cursor: pointer;
                    "
                  >
                    <i class='pi pi-search'></i>
                  </button>
                  <button 
                    id="mobile-search-close"
                    style="
                      background: transparent;
                      border: 2px solid #6B7280;
                      color: #6B7280;
                      padding: 12px 16px;
                      border-radius: 8px;
                      cursor: pointer;
                    "
                  >
                    <i class='pi pi-times'></i>
                  </button>
                </div>
              </div>
            `;
            document.body.appendChild(searchInput);

            const input = document.getElementById('mobile-search');
            const searchBtn = document.getElementById('mobile-search-btn');
            const closeBtn = document.getElementById('mobile-search-close');

            input.focus();

            const performSearch = () => {
              setSearchTerm(input.value);
              onSearch(input.value);
              document.body.removeChild(searchInput);
            };

            searchBtn.onclick = performSearch;
            closeBtn.onclick = () => document.body.removeChild(searchInput);
            input.onkeypress = (e) => {
              if (e.key === 'Enter') performSearch();
            };
          }}
          style={{
            background: 'linear-gradient(135deg, #1F2937, #374151)',
            border: 'none',
            color: 'white',
            boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
          }}
        />
      </div>
    </React.Fragment>
  );

  return (
    <>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="shadow-2xl"
        style={{
          backgroundColor: '#F9FAFB' // Fondo secundario
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4">
          <nav className="flex-grow">
            <ul className="list-none p-0 m-0">
              {menuItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <Button
                    label={item.label}
                    icon={item.icon}
                    className="w-full justify-start p-3 text-left font-semibold transition-all duration-300"
                    link
                    onClick={() => {
                      if (item.page) {
                        navigate(item.page);
                      }
                      setSidebarVisible(false);
                    }}
                    style={{
                      color: '#374151',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #374151, #1F2937)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                      e.target.style.transform = 'translateX(0)';
                    }}

                  />
                </li>
              ))}
            </ul>

            <Divider style={{
              borderColor: '#D1D5DB',
              margin: '24px 0',
              borderWidth: '2px'
            }} />


            <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: '#D1D5DB' }}>
              <img
                src="/logo.png"
                alt="Logo de Brews Express"
                style={{ height: '100px', marginBottom: '10px' }}
              />
              <p className="text-sm mt-2" style={{ color: '#000000ff' }}>
                Cerveza Artesanal a la puerta de tu hogar
              </p>
            </div>

            {/* Botón de logout en sidebar */}
            <Button
              label="Cerrar Sesión"
              icon="pi pi-sign-out"
              className="w-full p-3 font-bold transition-all duration-300"
              onClick={() => {
                handleLogout();
                setSidebarVisible(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #374151, #1F2937)',
                border: 'none',
                color: 'white',
                borderRadius: '12px',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(31, 41, 55, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.2)';
              }}
            />
          </nav>
        </div>
      </Sidebar>

      <Toolbar
        start={startContent}
        center={centerContent}
        end={endContent}
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #E5E7EB',
          padding: '12px 16px',
          minHeight: window.innerWidth < 768 ? '70px' : '80px'
        }}
      />
    </>
  );
};