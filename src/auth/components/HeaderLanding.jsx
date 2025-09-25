import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";

export const HeaderLanding = ({ onSearch }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Registrarse', icon: 'pi pi-user-plus', page: '/auth/register' },
    { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', page: '/auth/login' },
    { label: 'Registra tu cervecería', icon: 'pi pi-wallet', page: '/auth/register_brewery' },
  ];

  const downloadButtons = [
    { label: 'Descargar la App', icon: 'pi pi-android', platform: 'Android' },
    { label: 'Descargar la App', icon: 'pi pi-apple', platform: 'Apple' },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      onSearch(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const startContent = (
    <React.Fragment>
      <Button
        icon="pi pi-bars"
        rounded
        text
        aria-label="Abrir menú"
        onClick={() => setSidebarVisible(true)}
        className="p-button-lg hover:bg-green-50"
        style={{
          color: '#374151', // Gris oscuro para el icono del menú
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
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <div className="hidden md:flex gap-2">
        <Button
          label="Iniciar Sesión"
          className="p-button-outlined p-button-lg mr-2"
          onClick={() => navigate('/auth/login')}
          style={{
            color: '#374151', // Gris oscuro para el texto del botón
            borderColor: '#374151', // Gris oscuro para el borde
            fontWeight: '600',
            padding: '10px 24px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#374151';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#374151';
          }}
        />
        <Button
          label="Registrarse"
          className="p-button-primary p-button-lg"
          onClick={() => navigate('/auth/register')}
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
                    className="w-full justify-start p-3 text-left font-semibold transition-all duration-200"
                    link
                    onClick={() => {
                      if (item.page) {
                        navigate(item.page);
                      }
                      setSidebarVisible(false);
                    }}
                    style={{
                      color: '#374151', // Gris oscuro para el texto
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#1F2937';
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
              <li>
                <Divider style={{
                  borderColor: '#D1D5DB', // Gris claro para el divisor
                  margin: '24px 0',
                  borderWidth: '2px'
                }} />
              </li>
            </ul>

            <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: '#D1D5DB' }}>
              <img
                src="/src/assets/img/logo.png"
                alt="Logo de Brews Express"
                style={{ height: '100px', marginBottom: '10px' }}
              />
              <p className="text-sm mt-2" style={{ color: '#000000ff' }}>
                Cerveza Artesanal a la puerta de tu hogar
              </p>
            </div>

            <ul className="list-none p-0 m-0">
              <li>
                {downloadButtons.map((btn, index) => (
                  <Button
                    key={index}
                    label={btn.label}
                    icon={btn.icon}
                    className="p-3 w-full font-bold surface-hover transition-colors duration-300"
                    link
                    onClick={() => console.log(`Descargando app para ${btn.platform}`)}
                    style={{
                      color: '#374151', // Gris oscuro para el texto
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.scale = '1.05';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.scale = '1';
                    }}

                  />
                ))}
              </li>
            </ul>
          </nav>
        </div>
      </Sidebar>

      <Toolbar
        start={startContent}
        center={centerContent}
        end={endContent}
        style={{
          background: '#FFFFFF', // Blanco para el fondo principal
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #E5E7EB', // Gris claro para el borde
          padding: '12px 16px',
          minHeight: window.innerWidth < 768 ? '70px' : '80px'
        }}
      />
    </>
  );
};

