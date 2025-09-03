// import React, { useState } from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import { Button } from 'primereact/button';
// import { Divider } from 'primereact/divider';
// import { InputText } from 'primereact/inputtext';
// import { Toolbar } from 'primereact/toolbar';
// import { useNavigate } from "react-router-dom";
// import useAuth from '../../auth/hooks/useAuth';

// export const Header = () => {
//     // Estado para controlar la visibilidad del sidebar (menú lateral)
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const navigate = useNavigate();

//   const { logout } = useAuth();
//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };



//     // Array de objetos para los botones del menú, incluyendo iconos de PrimeIcons
//     const menuItems = [
//       { label: 'Mis Favoritos', icon: 'pi pi-heart', page: '/be/favourites-user' },
//       { label: 'Mi Cuenta', icon: 'pi pi-wallet', page: '/be/profile-user' },
//       // { label: 'Ayuda', icon: 'pi pi-wallet', page: '/be/help' },
//     ];

//     // Array de objetos para los botones de descarga de la app
//   const downloadButtons = [
//     { label: 'Cerrar  Sesión', icon: 'pi pi-android', platform: 'Android' },
//     ];

//     // Estilo para el logo de BrewsExpress en el sidebar
//     const logoStyle = {
//         color: '#4A5568', // Color de texto gris oscuro
//         fontWeight: 'bold',
//         fontSize: '1.5rem',
//         textTransform: 'uppercase',
//     };

//     // Define el contenido del lado izquierdo de la barra de herramientas (Toolbar)
//     const startContent = (
//         <React.Fragment>
//             <Button
//                 icon="pi pi-bars"
//                 rounded
//                 text
//                 aria-label="Abrir menú"
//                 onClick={() => setSidebarVisible(true)}
//                 className="p-button-lg"
//             />
//             <span className="text-xl font-bold text-gray-800 ml-2">
//                 Brews Express
//             </span>
//         </React.Fragment>
//     );

//     // Define el contenido del centro de la barra de herramientas (Toolbar)
//     const centerContent = (
//         <React.Fragment>
//             <div className="hidden md:flex flex-grow justify-center mx-4">
//                 <span className="p-input-icon-left w-full max-w-sm">
//                     <i className="pi pi-search" />
//                     <InputText placeholder="Buscar cerveza..." className="w-full" />
//                 </span>
//             </div>
//         </React.Fragment>
//     );

//     // Define el contenido del lado derecho de la barra de herramientas (Toolbar)
//     const endContent = (
//         <React.Fragment>
// <div className="hidden md:flex">
//           <Button
//             label="Mi Cuenta"
//             className="p-button-outlined p-button-lg mr-2"
//             onClick={() => navigate('/be/profile-user')}
//           />
//           <Button
//             label="Cerrar Sesión"
//             className="p-button-outlined p-button-lg mr-2"
//             onClick={handleLogout}
//           />

//             </div>
//         </React.Fragment>
//     );


//     return (
//         <>
//             {/* Componente Sidebar de PrimeReact */}
//             <Sidebar
//                 visible={sidebarVisible}
//                 onHide={() => setSidebarVisible(false)}
//                 className="bg-white p-4 shadow-lg flex flex-col h-full"
//         >



//                 {/* Contenedor principal del menú lateral*/}
//                 <div className="flex flex-col h-full overflow-y-auto">
//                     {/* Botones de navegación del menú lateral */}
//                     <nav className="flex-grow">
//                         <ul className="list-none p-0 m-0">
//                             {menuItems.map((item, index) => (
//                                 <li key={index}  >
//                                     <Button
//                                         label={item.label}
//                                         icon={item.icon}
//                                         className="w-full justify-start p-3 text-lg font-semibold surface-hover transition-colors duration-200"
//                                         link
//                                         onClick={() => {
//                                             if (item.page) {
//                                                 navigate(item.page);
//                                             }
//                                             setSidebarVisible(false);
//                                         }}
//                                     />
//                                 </li>
//                             ))}
//                 <li>
//                   <Divider className="my-4" />

//                 </li>

//               </ul>
//                         <div className="mt-auto pt-4 text-center">
//                         <div className="mb-4">
//                             <span style={logoStyle}>Brews Express</span>
//                             <p className="text-sm text-gray">Cerveza Artesanal a la puerta de tu hogar</p>
//                         </div>


//               </div>

//               <ul className="list-none p-0 m-0">
//                                <li>

//                             {downloadButtons.map((btn, index) => (
//                                 <Button
//                                     key={index}
//                                     label={btn.label}
//                                     icon={btn.icon}
//                                     className="p-3 w-full font-bold surface-hover transition-colors duration-200"
//                                 link
//                                 onClick={handleLogout}
//                                 />
//                             ))}



//                 </li>
//               </ul>
//             </nav>

//             {/* Sección del pie de página del menú, con logo y botones de descarga */}


//                 </div>
//             </Sidebar>

//             {/* Encabezado principal usando el componente Toolbar */}
//             <Toolbar start={startContent} center={centerContent} end={endContent} className="p-4 shadow-md bg-white rounded-lg" />
//         </>
//     );
// };






import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";
import useAuth from '../../auth/hooks/useAuth';

export const Header = ({ onSearch }) => {  // ✅ Agregamos prop onSearch
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // ✅ Estado para búsqueda
  const navigate = useNavigate();

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/auth/brews_express');
  };

  const menuItems = [
    { label: 'Mis Favoritos', icon: 'pi pi-heart', page: '/be/favourites-user' },
    { label: 'Mi Cuenta', icon: 'pi pi-user', page: '/be/profile-user' },
  ];

  const downloadButtons = [
    { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', platform: 'Android' },
  ];

  const logoStyle = {
    color: '#4A5568',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    textTransform: 'uppercase',
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
      <Button
        icon="pi pi-bars"
        rounded
        text
        aria-label="Abrir menú"
        onClick={() => setSidebarVisible(true)}
        className="p-button-lg"
      />
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
            placeholder="Buscar cerveza..."
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
          onClick={() => navigate('/be/profile-user')}
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
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="bg-white p-4 shadow-lg flex flex-col h-full"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <nav className="flex-grow">
            <ul className="list-none p-0 m-0">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Button
                    label={item.label}
                    icon={item.icon}
                    className="w-full justify-start p-3 text-lg font-semibold surface-hover transition-colors duration-200"
                    link
                    onClick={() => {
                      if (item.page) {
                        navigate(item.page);
                      }
                      setSidebarVisible(false);
                    }}
                  />
                </li>
              ))}
              <li>
                <Divider className="my-4" />
              </li>
            </ul>

            <div className="mt-auto pt-4 text-center">
              <div className="mb-4">
                <span style={logoStyle}>Brews Express</span>
                <p className="text-sm text-gray">Cerveza Artesanal a la puerta de tu hogar</p>
              </div>
            </div>

            <ul className="list-none p-0 m-0">
              <li>
                {downloadButtons.map((btn, index) => (
                  <Button
                    key={index}
                    label={btn.label}
                    icon={btn.icon}
                    className="p-3 w-full font-bold surface-hover transition-colors duration-200"
                    link
                    onClick={handleLogout}
                  />
                ))}
              </li>
            </ul>
          </nav>
        </div>
      </Sidebar>

      <Toolbar start={startContent} center={centerContent} end={endContent} className="p-4 shadow-md bg-white rounded-lg" />
    </>
  );
};