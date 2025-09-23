// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import { useNavigate } from "react-router-dom"

// export const FavouritesUserPage = () => {
//   const [favourites, setFavourites] = useState([])
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   // Función para obtener el token de autenticación
//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token')
//   }

//   // Función para hacer peticiones autenticadas
//   const authenticatedAxios = axios.create({
//     baseURL: API_URL,
//     headers: {
//       'Authorization': `Bearer ${getAuthToken()}`
//     }
//   })

//   useEffect(() => {
//     const fetchFavourites = async () => {
//       try {
//         const response = await authenticatedAxios.get('/be/my_favourites')
//         setFavourites(response.data.favourites)
//       } catch (error) {
//         console.error('Error fetching favourites:', error.response ? error.response.data : error.message)
//       }
//     }

//     fetchFavourites()
//   }, [])

//   // Función para remover de favoritos
//   const removeFromFavourites = async (brewId) => {
//     setLoading(true)
//     try {
//       await authenticatedAxios.delete(`/be/remove_favourite/${brewId}`)

//       // Actualizar la lista de favoritos
//       const response = await authenticatedAxios.get('/be/my_favourites')
//       setFavourites(response.data.favourites)

//       // alert('Cerveza removida de favoritos')
//     } catch (error) {
//       console.error('Error removing from favourites:', error.response ? error.response.data : error.message)
//       alert('Error al remover de favoritos')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <h1>Mis Favoritos</h1>
//       <button onClick={() => navigate('/be/home')}>Home</button>
//       {favourites.length === 0 ? (
//         <p>No tienes cervezas favoritas aún.</p>
//       ) : (
//         <ul>
//           {favourites.map((favourite) => (
//             <li key={favourite._id}>
//               <h2>{favourite.brew_info.name}</h2>

//               <button
//                 onClick={() => removeFromFavourites(favourite.brew_id)}
//                 disabled={loading}
//                 style={{
//                   backgroundColor: '#dc3545',
//                   color: 'white',
//                   opacity: loading ? 0.6 : 1
//                 }}
//               >
//                 {loading ? 'Procesando...' : 'Remover de Favoritos'}
//               </button>

//               <p>Estilo: {favourite.brew_info.style}</p>
//               <p>ABV: {favourite.brew_info.abv}%</p>
//               <p>SRM: {favourite.brew_info.srm}</p>
//               <p>IBU: {favourite.brew_info.ibu}</p>
//               <p>ml: {favourite.brew_info.ml}</p>
//               <p>Precio: {favourite.brew_info.price}</p>
//               <p>Descripción: {favourite.brew_info.description}</p>
//               <p>Agregado el: {new Date(favourite.created_at).toLocaleDateString()}</p>

//               {favourite.brew_info.image && (
//                 <img
//                   src={favourite.brew_info.image}
//                   alt={favourite.brew_info.name}
//                   style={{ width: '200px', height: 'auto' }}
//                 />
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }








import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { Image } from 'primereact/image';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
const API_URL = import.meta.env.VITE_API_URL

export const FavouritesUserPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  const authenticatedAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setScreenSize('mobile');
      else if (width < 768) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFavourites = async () => {
      setPageLoading(true);
      setError('');
      try {
        const response = await authenticatedAxios.get('/be/my_favourites');
        setFavourites(response.data.favourites);
      } catch (error) {
        console.error('Error fetching favourites:', error.response?.data || error.message);
        setError('Error al cargar tus cervezas favoritas. Por favor, intenta de nuevo.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const removeFromFavourites = async (brewId) => {
    setLoading(true);
    setError('');
    try {
      await authenticatedAxios.delete(`/be/remove_favourite/${brewId}`);
      setFavourites(favourites.filter(fav => fav.brew_id !== brewId));
      // Opcionalmente, mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error removing from favourites:', error.response?.data || error.message);
      setError('Error al remover de favoritos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getResponsiveConfig = () => {
    const configs = {
      mobile: {
        mainCardWidth: '100%',
        gridColumns: 1,
        buttonsFlexDirection: 'column',
        buttonGap: '10px'
      },
      tablet: {
        mainCardWidth: '700px',
        gridColumns: 2,
        buttonsFlexDirection: 'row',
        buttonGap: '15px'
      },
      desktop: {
        mainCardWidth: '900px',
        gridColumns: 3,
        buttonsFlexDirection: 'row',
        buttonGap: '20px'
      }
    };
    return configs[screenSize];
  };
  const config = getResponsiveConfig();

  const renderCardSkeleton = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
      gap: '20px',
      marginBottom: '2rem'
    }}>
      {[...Array(config.gridColumns * 2)].map((_, i) => (
        <Card key={i} style={{ background: '#2D3748', border: '1px solid #4A5568' }}>
          <div className="flex flex-column align-items-center">
            <Skeleton width="100%" height="200px" style={{ background: '#4B5563', borderRadius: '8px' }} className="mb-3" />
            <Skeleton width="80%" height="1.5rem" className="mb-2" style={{ background: '#4B5563' }} />
            <Skeleton width="60%" height="1rem" className="mb-4" style={{ background: '#4B5563' }} />
            <Skeleton width="100%" height="2.5rem" style={{ background: '#4B5563' }} />
          </div>
        </Card>
      ))}
    </div>
  );

  const header = (
    <div style={{ borderBottom: '1px solid #4A5568', paddingBottom: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#F9FAFB',
        margin: 0
      }}>
        Mis Cervezas Favoritas
      </h1>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: config.mainCardWidth,
        color: '#F9FAFB'
      }}>
        <Card
          header={header}
          style={{
            width: '100%',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            padding: '2rem',
            background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
            color: '#F9FAFB'
          }}
        >
          {error && <Message severity="error" text={error} className="w-full mb-4" />}

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem'
          }}>
            <Button
              label="Volver al Home"
              icon="pi pi-home"
              className="p-button-outlined"
              onClick={() => navigate('/be/home')}
              style={{
                borderColor: '#4A5568',
                color: '#D1D5DB'
              }}
            />
          </div>

          {pageLoading ? renderCardSkeleton() : (
            favourites.length === 0 ? (
              <div className="flex justify-content-center p-5">
                <Message
                  severity="info"
                  text="No tienes cervezas favoritas aún. ¡Descubre y agrega algunas!"
                  className="w-full"
                  style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#D1D5DB', borderColor: '#4B5563' }}
                />
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
                gap: '20px'
              }}>
                {favourites.map((favourite) => (
                  <Card
                    key={favourite._id}
                    style={{
                      background: '#374151',
                      color: '#F9FAFB',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px'
                    }}
                    header={
                      <div style={{ height: '200px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                        <Image
                          src={favourite.brew_info.image || '/default-brew-image.png'}
                          alt={favourite.brew_info.name}
                          imageStyle={{ objectFit: 'cover', height: '100%', width: '100%' }}
                          preview
                        />
                      </div>
                    }
                  >
                    <div className="flex flex-column" style={{ padding: '0.5rem 0' }}>
                      <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                        {favourite.brew_info.name}
                      </h2>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#D1D5DB', }}>
                        Estilo: {favourite.brew_info.style}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#D1D5DB' }}>
                        ABV: {favourite.brew_info.abv}%
                      </p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#D1D5DB' }}>
                        Precio: ${favourite.brew_info.price}
                      </p>
                      <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.8rem', color: '#9CA3AF' }}>
                        Agregado el: {new Date(favourite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      label={loading ? 'Removiendo...' : 'Remover de Favoritos'}
                      icon={loading ? 'pi pi-spinner pi-spin' : 'pi pi-heart-slash'}
                      className="p-button-danger p-button-sm"
                      onClick={() => removeFromFavourites(favourite.brew_id)}
                      disabled={loading}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                        border: 'none',
                        padding: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </Card>
                ))}
              </div>
            )
          )}
        </Card>
      </div>
    </div>
  );
};



