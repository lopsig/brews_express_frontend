// import React, { useState } from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import { Button } from 'primereact/button';
// import { Divider } from 'primereact/divider';
// import { InputText } from 'primereact/inputtext';
// import { Toolbar } from 'primereact/toolbar';
// import { useNavigate } from "react-router-dom";

// export const HeaderLanding = ({ onSearch }) => {  // ✅ Agregamos prop onSearch
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');  // ✅ Estado para el término de búsqueda
//   const navigate = useNavigate();

//   const menuItems = [
//     { label: 'Registrarse', icon: 'pi pi-user-plus', page: '/auth/register' },
//     { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', page: '/auth/login' },
//     { label: 'Registra tu cervecería', icon: 'pi pi-wallet', page: '/auth/register_brewery' },
//   ];

//   const downloadButtons = [
//     { label: 'Descargar la App', icon: 'pi pi-android', platform: 'Android' },
//     { label: 'Descargar la App', icon: 'pi pi-apple', platform: 'Apple' },
//   ];

//   const logoStyle = {
//     background: 'linear-gradient(135deg, #D4A574 0%, #C8860D 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text',
//     fontWeight: 'bold',
//     fontSize: '1.8rem',
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//   };

//   // ✅ Función para manejar la búsqueda
//   const handleSearch = (e) => {
//     if (e.key === 'Enter' || e.type === 'click') {
//       onSearch(searchTerm);
//     }
//   };

//   // ✅ Función para limpiar búsqueda
//   const handleClearSearch = () => {
//     setSearchTerm('');
//     onSearch('');
//   };

//   const startContent = (
//     <React.Fragment>
//       <Button
//         icon="pi pi-bars"
//         rounded
//         text
//         aria-label="Abrir menú"
//         onClick={() => setSidebarVisible(true)}
//         className="p-button-lg hover:bg-amber-50 text-amber-700"
//         style={{
//           color: '#C8860D',
//           border: 'none',
//           transition: 'all 0.3s ease'
//         }}

//       />
//       <div className="flex items-center ml-3">
//       <img
//         height={100}
//           src="/src/assets/img/logo.png"
//           alt="Logo de Brews Express"
//           className='mr-2'
//         />
//       </div>

//     </React.Fragment>
//   );

//   // ✅ Búsqueda funcional en el centro
//   const centerContent = (
//     <React.Fragment>
//       <div className="hidden md:flex flex-grow justify-center mx-4">
//         <div className="p-inputgroup w-full max-w-md shadow-lg">
//           <InputText
//             placeholder="Buscar cerveza artesanal..."
//             className="w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyPress={handleSearch}
//             style={{
//               border: '2px solid #D4A574',
//               borderLeft: '2px solid #D4A574',
//               borderRight: 'none',
//               fontSize: '1rem',
//               padding: '12px 16px'
//             }}
//           />
//           {searchTerm && (
//             <Button
//               icon="pi pi-times"
//               className="p-button-text"
//               onClick={handleClearSearch}
//               tooltip="Limpiar búsqueda"
//               style={{
//                 color: '#8B4513',
//                 border: '2px solid #D4A574',
//                 borderLeft: 'none'
//               }}
//             />
//           )}
//           <Button
//             icon="pi pi-search"
//             className="p-button-primary"
//             onClick={handleSearch}
//             tooltip="Buscar"
//             style={{
//               background: 'linear-gradient(135deg, #C8860D, #B87333)',
//               border: '2px solid #C8860D',
//               borderLeft: 'none',
//               color: 'white',
//               fontWeight: 'bold',
//               transition: 'all 0.3s ease'
//             }}
//           />
//         </div>
//       </div>
//     </React.Fragment>
//   );

//   const endContent = (
//     <React.Fragment>
//       <div className="hidden md:flex gap-2">
//         <Button
//           label="Iniciar Sesión"
//           className="p-button-outlined p-button-lg mr-2"
//           onClick={() => navigate('/auth/login')}
//           style={{
//             color: '#C8860D',
//             borderColor: '#C8860D',
//             fontWeight: '600',
//             padding: '10px 24px',
//             transition: 'all 0.3s ease'
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.background = '#C8860D';
//             e.target.style.color = 'white';
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.background = 'transparent';
//             e.target.style.color = '#C8860D';
//           }}

//         />
//         <Button
//           label="Registrar"
//           className="p-button-primary p-button-lg"
//           onClick={() => navigate('/auth/register')}
//           style={{
//             background: 'linear-gradient(135deg, #C8860D, #B87333)',
//             border: 'none',
//             color: 'white',
//             fontWeight: '600',
//             padding: '10px 24px',
//             boxShadow: '0 4px 15px rgba(196, 134, 13, 0.3)',
//             transition: 'all 0.3s ease'
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.transform = 'translateY(-2px)';
//             e.target.style.boxShadow = '0 6px 20px rgba(196, 134, 13, 0.4)';
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.transform = 'translateY(0)';
//             e.target.style.boxShadow = '0 4px 15px rgba(196, 134, 13, 0.3)';
//           }}
//         />
//       </div>
//     </React.Fragment>
//   );

//   return (
//     <>
//       <Sidebar
//         visible={sidebarVisible}
//         onHide={() => setSidebarVisible(false)}
//         className="shadow-2xl"

//       >
//         <div className="flex flex-col h-full overflow-y-auto p-4">
         



//           <nav className="flex-grow">
//             <ul className="list-none p-0 m-0">
//               {menuItems.map((item, index) => (
//                 <li key={index} className="mb-2">
//                   <Button
//                     label={item.label}
//                     icon={item.icon}
//                     className="w-full justify-start p-3 text-left font-semibold transition-all duration-300"
//                     link
//                     onClick={() => {
//                       if (item.page) {
//                         navigate(item.page);
//                       }
//                       setSidebarVisible(false);
//                     }}
//                     style={{
//                       color: '#8B4513',
//                       border: 'none',
//                       borderRadius: '12px',
//                       fontSize: '1rem'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = 'linear-gradient(135deg, #D4A574, #C8860D)';
//                       e.target.style.color = 'white';
//                       e.target.style.transform = 'translateX(8px)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = 'transparent';
//                       e.target.style.color = '#8B4513';
//                       e.target.style.transform = 'translateX(0)';
//                     }}

//                   />
//                 </li>
//               ))}
//               <li>
//             <Divider style={{ 
//               borderColor: '#D4A574', 
//               margin: '24px 0',
//               borderWidth: '2px'
//             }} />
//               </li>
//             </ul>

//             <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: '#D4A574' }}>
//               <img
//                 src="/src/assets/img/logo.png"
//                 alt="Logo de Brews Express"
//                 style={{ height: '100px', marginBottom: '10px' }}
//               />
//               <p className="text-sm mt-2" style={{ color: '#8B4513' }}>
//                 Cerveza Artesanal a la puerta de tu hogar
//               </p>
//             </div>

//             <ul className="list-none p-0 m-0">
//               <li>
//                 {downloadButtons.map((btn, index) => (
//                   <Button
//                     key={index}
//                     label={btn.label}
//                     icon={btn.icon}
//                     className="p-3 w-full font-bold surface-hover transition-colors duration-200"
//                     link
//                     onClick={() => console.log(`Descargando app para ${btn.platform}`)}
//                     style={{
//                       color: '#8B4513',
//                       border: 'none',
//                       borderRadius: '12px',
//                       fontSize: '1rem'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = 'linear-gradient(135deg, #D4A574, #C8860D)';
//                       e.target.style.color = 'white';
//                       e.target.style.transform = 'translateX(8px)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = 'transparent';
//                       e.target.style.color = '#8B4513';
//                       e.target.style.transform = 'translateX(0)';
//                     }}
//                   />
//                 ))}
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </Sidebar>

//       <Toolbar
//         start={startContent}
//         center={centerContent}
//         end={endContent}
//         style={{
//           boxShadow: '0 4px 20px rgba(196, 134, 13, 0.1)',
//           borderBottom: '3px solid #D4A574',
//           padding: '12px 16px',
//           minHeight: window.innerWidth < 768 ? '70px' : '80px'
//         }}
        
//       />
//     </>
//   );
// };





import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from "react-router-dom";

export const HeaderLanding = ({ onSearch }) => {  // ✅ Agregamos prop onSearch
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // ✅ Estado para el término de búsqueda
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

  const logoStyle = {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Verde esmeralda
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
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
        className="p-button-lg hover:bg-green-50 text-green-700"
        style={{
          color: '#059669', // Verde
          border: 'none',
          transition: 'all 0.3s ease'
        }}

      />
      <div className="flex items-center ml-3">
        <img
          height={100}
          src="/src/assets/img/logo.png"
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
              border: '2px solid #3B82F6', // Azul
              borderLeft: '2px solid #3B82F6',
              borderRight: 'none',
              fontSize: '1rem',
              padding: '12px 16px'
            }}
          />
          {searchTerm && (
            <Button
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleClearSearch}
              tooltip="Limpiar búsqueda"
              style={{
                color: '#1F2937', // Negro grisáceo
                border: '2px solid #3B82F6',
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
              background: 'linear-gradient(135deg, #059669, #10B981)', // Verde
              border: '2px solid #059669',
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
            color: '#3B82F6', // Azul
            borderColor: '#3B82F6',
            fontWeight: '600',
            padding: '10px 24px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#3B82F6';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#3B82F6';
          }}

        />
        <Button
          label="Registrar"
          className="p-button-primary p-button-lg"
          onClick={() => navigate('/auth/register')}
          style={{
            background: 'linear-gradient(135deg, #059669, #10B981)', // Verde
            border: 'none',
            color: 'white',
            fontWeight: '600',
            padding: '10px 24px',
            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
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
                      color: '#1F2937', // Negro grisáceo
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#1F2937';
                      e.target.style.transform = 'translateX(0)';
                    }}

                  />
                </li>
              ))}
              <li>
                <Divider style={{
                  borderColor: '#3B82F6', // Azul
                  margin: '24px 0',
                  borderWidth: '2px'
                }} />
              </li>
            </ul>

            <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: '#3B82F6' }}>
              <img
                src="/src/assets/img/logo.png"
                alt="Logo de Brews Express"
                style={{ height: '100px', marginBottom: '10px' }}
              />
              <p className="text-sm mt-2" style={{ color: '#1F2937' }}>
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
                    className="p-3 w-full font-bold surface-hover transition-colors duration-200"
                    link
                    onClick={() => console.log(`Descargando app para ${btn.platform}`)}
                    style={{
                      color: '#1F2937', // Negro grisáceo
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = btn.platform === 'Android' ?
                        'linear-gradient(135deg, #059669, #10B981)' : // Verde para Android
                        'linear-gradient(135deg, #3B82F6, #2563EB)'; // Azul para Apple
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#1F2937';
                      e.target.style.transform = 'translateX(0)';
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
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', // Fondo gris claro
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)', // Sombra azul
          borderBottom: '3px solid #10B981', // Borde verde
          padding: '12px 16px',
          minHeight: window.innerWidth < 768 ? '70px' : '80px'
        }}

      />
    </>
  );
};