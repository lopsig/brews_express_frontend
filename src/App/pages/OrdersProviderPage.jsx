// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import { useNavigate } from "react-router-dom"

// export const OrdersProviderPage = () => {
//   const [favouritedBrews, setFavouritedBrews] = useState([])
//   const [statistics, setStatistics] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token')
//   }

//   const authenticatedAxios = axios.create({
//     baseURL: API_URL,
//     headers: {
//       'Authorization': `Bearer ${getAuthToken()}`
//     }
//   })

//   useEffect(() => {
//     const fetchFavouritedBrews = async () => {
//       setLoading(true)
//       try {
//         const response = await authenticatedAxios.get('/brews/my_brews_favourites')
//         setFavouritedBrews(response.data.favourited_brews)
//         setStatistics(response.data.statistics)
//       } catch (error) {
//         console.error('Error fetching favourited brews:', error.response ? error.response.data : error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchFavouritedBrews()
//   }, [])

//   if (loading) {
//     return <div>Cargando datos de favoritos...</div>
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Mis Cervezas Favoritas por Usuarios</h1>
//       <button
//         onClick={() => navigate('/be/home-provider')}
//         style={{
//           marginBottom: '20px',
//           padding: '10px 20px',
//           backgroundColor: '#6c757d',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Home
//       </button>

//       {/* Estadísticas */}
//       {statistics && (
//         <div style={{
//           backgroundColor: '#e9ecef',
//           padding: '20px',
//           borderRadius: '8px',
//           marginBottom: '20px'
//         }}>
//           <h2>Estadísticas de Favoritos</h2>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
//             <div style={{ textAlign: 'center' }}>
//               <h3 style={{ color: '#007bff', margin: '0' }}>{statistics.total_brews_with_favourites}</h3>
//               <p>Cervezas con Favoritos</p>
//             </div>
//             <div style={{ textAlign: 'center' }}>
//               <h3 style={{ color: '#28a745', margin: '0' }}>{statistics.total_favourites_count}</h3>
//               <p>Total de Favoritos</p>
//             </div>
//             <div style={{ textAlign: 'center' }}>
//               <h3 style={{ color: '#dc3545', margin: '0' }}>{statistics.most_popular_brew.favourites_count}</h3>
//               <p>Favoritos de la Más Popular</p>
//             </div>
//           </div>
//           {statistics.most_popular_brew.name && (
//             <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
//               Cerveza más popular: {statistics.most_popular_brew.name}
//             </p>
//           )}
//         </div>
//       )}

//       {favouritedBrews.length === 0 ? (
//         <div style={{
//           textAlign: 'center',
//           padding: '40px',
//           backgroundColor: '#f8f9fa',
//           borderRadius: '8px'
//         }}>
//           <h3>No hay favoritos aún</h3>
//           <p>Ninguna de tus cervezas ha sido marcada como favorita por los usuarios.</p>
//         </div>
//       ) : (
//         <div>
//           <h2>Cervezas Favoritas de los Usuarios</h2>
//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             {favouritedBrews.map((brew) => (
//               <li key={brew._id} style={{
//                 border: '1px solid #ddd',
//                 margin: '15px 0',
//                 padding: '20px',
//                 borderRadius: '8px',
//                 backgroundColor: '#fff',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//                   <h3 style={{ margin: '0' }}>{brew.name}</h3>
//                   <div style={{
//                     backgroundColor: '#28a745',
//                     color: 'white',
//                     padding: '5px 15px',
//                     borderRadius: '20px',
//                     fontSize: '14px',
//                     fontWeight: 'bold'
//                   }}>
//                     {brew.total_favourites} Favorito{brew.total_favourites !== 1 ? 's' : ''}
//                   </div>
//                 </div>

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
//                   <p><strong>Estilo:</strong> {brew.style}</p>
//                   <p><strong>ABV:</strong> {brew.abv}%</p>
//                   <p><strong>Precio:</strong> ${brew.price}</p>
//                   <p><strong>ML:</strong> {brew.ml}</p>
//                 </div>

//                 {brew.image && (
//                   <div style={{ marginBottom: '15px' }}>
//                     <img
//                       src={brew.image}
//                       alt={brew.name}
//                       style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
//                       onError={(e) => {
//                         e.target.style.display = 'none'
//                       }}
//                     />
//                   </div>
//                 )}

//                 {/* Lista de usuarios que dieron favorito */}
//                 <div style={{
//                   backgroundColor: '#f8f9fa',
//                   padding: '15px',
//                   borderRadius: '6px',
//                   marginTop: '15px'
//                 }}>
//                   <h4 style={{ margin: '0 0 10px 0' }}>Usuarios que marcaron como favorito:</h4>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
//                     {brew.users_who_favourited.map((user, index) => (
//                       <div key={user._id} style={{
//                         backgroundColor: 'white',
//                         padding: '10px',
//                         borderRadius: '4px',
//                         border: '1px solid #dee2e6'
//                       }}>
//                         <p style={{ margin: '0', fontWeight: 'bold' }}>
//                           {user.first_name} {user.last_name}
//                         </p>
//                         <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
//                           {user.email}
//                         </p>
//                         {brew.favourites_info[index] && (
//                           <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
//                             Agregado: {new Date(brew.favourites_info[index].created_at).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }












import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import { Badge } from 'primereact/badge';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
const API_URL = import.meta.env.VITE_API_URL

export const OrdersProviderPage = () => {
  const [favouritedBrews, setFavouritedBrews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');
  const navigate = useNavigate();

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

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
    const fetchFavouritedBrews = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await authenticatedAxios.get('/brews/my_brews_favourites');
        setFavouritedBrews(response.data.favourited_brews);
        setStatistics(response.data.statistics);
      } catch (error) {
        console.error('Error fetching favourited brews:', error.response?.data || error.message);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchFavouritedBrews();
  }, []);

  const getResponsiveConfig = () => {
    const configs = {
      mobile: {
        mainCardWidth: '100%',
        statGrid: '1fr',
        buttonFlex: 'column',
        listColumns: '1fr'
      },
      tablet: {
        mainCardWidth: '700px',
        statGrid: 'repeat(3, 1fr)',
        buttonFlex: 'row',
        listColumns: 'repeat(2, 1fr)'
      },
      desktop: {
        mainCardWidth: '900px',
        statGrid: 'repeat(3, 1fr)',
        buttonFlex: 'row',
        listColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      }
    };
    return configs[screenSize];
  };
  const config = getResponsiveConfig();

  const renderStatistics = () => (
    <Card
      title="Estadísticas de Favoritos"
      style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #2D3748, #4A5568)', color: '#F9FAFB' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: config.statGrid, gap: '15px' }}>
        <div style={{ textAlign: 'center', padding: '15px', background: '#374151', borderRadius: '12px' }}>
          <h3 style={{ color: '#60A5FA', margin: '0 0 5px 0', fontSize: '1.5rem' }}>
            {statistics?.total_brews_with_favourites}
          </h3>
          <p style={{ margin: '0', color: '#D1D5DB' }}>Cervezas con Favoritos</p>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#374151', borderRadius: '12px' }}>
          <h3 style={{ color: '#34D399', margin: '0 0 5px 0', fontSize: '1.5rem' }}>
            {statistics?.total_favourites_count}
          </h3>
          <p style={{ margin: '0', color: '#D1D5DB' }}>Total de Favoritos</p>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#374151', borderRadius: '12px' }}>
          <h3 style={{ color: '#EF4444', margin: '0 0 5px 0', fontSize: '1.5rem' }}>
            {statistics?.most_popular_brew?.favourites_count}
          </h3>
          <p style={{ margin: '0', color: '#D1D5DB' }}>Cerveza Más Popular</p>
        </div>
      </div>
      {statistics?.most_popular_brew?.name && (
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontWeight: 'bold', color: '#F9FAFB' }}>
          La más popular: {statistics.most_popular_brew.name}
        </p>
      )}
    </Card>
  );

  const renderEmptyState = () => (
    <Message
      severity="info"
      text="Ninguna de tus cervezas ha sido marcada como favorita por los usuarios."
      className="w-full"
      style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#D1D5DB', borderColor: '#4B5563' }}
    />
  );

  const renderBrewList = () => (
    <div className="p-fluid">
      <h2 style={{ color: '#F9FAFB', borderBottom: '1px solid #4A5568', paddingBottom: '1rem' }}>
        Detalles de Cervezas Favoritas
      </h2>
      {favouritedBrews.map(brew => (
        <Card
          key={brew._id}
          className="mb-4"
          style={{ background: 'linear-gradient(135deg, #2D3748, #4A5568)', color: '#F9FAFB', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
        >
          <div style={{ display: 'flex', flexDirection: screenSize === 'mobile' ? 'column' : 'row', gap: '20px', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <Image
                src={brew.image || '/default-brew-image.png'}
                alt={brew.name}
                width="150"
                preview
                style={{ borderRadius: '8px', objectFit: 'cover', border: '2px solid #4A5568' }}
                onError={(e) => {
                  e.target.src = '/default-brew-image.png';
                  e.target.style.display = 'block';
                }}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#F9FAFB' }}>{brew.name}</h3>
                <Badge
                  value={`${brew.total_favourites} Favorito${brew.total_favourites !== 1 ? 's' : ''}`}
                  severity="success"
                  style={{ background: '#059669', padding: '0.5rem 1rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: screenSize === 'mobile' ? '1fr' : '1fr 1fr', gap: '10px', color: '#D1D5DB' }}>
                <p style={{ margin: 0 }}><strong>Estilo:</strong> {brew.style}</p>
                <p style={{ margin: 0 }}><strong>ABV:</strong> {brew.abv}%</p>
                <p style={{ margin: 0 }}><strong>Precio:</strong> ${brew.price}</p>
                <p style={{ margin: 0 }}><strong>ML:</strong> {brew.ml}</p>
              </div>
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(55, 65, 81, 0.5)',
                borderRadius: '8px',
                border: '1px solid #4B5563'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#F9FAFB' }}>Usuarios que dieron favorito:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: config.listColumns, gap: '10px' }}>
                  {brew.users_who_favourited.map((user, index) => (
                    <div key={user._id} style={{
                      padding: '10px',
                      borderRadius: '6px',
                      background: '#374151',
                      border: '1px solid #4B5563',
                      color: '#F9FAFB'
                    }}>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{user.first_name} {user.last_name}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#9CA3AF' }}>{user.email}</p>
                      {brew.favourites_info[index] && (
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.7rem', color: '#9CA3AF' }}>
                          Agregado: {new Date(brew.favourites_info[index].created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSkeleton = () => (
    <div style={{ marginBottom: '2rem' }}>
      <Skeleton width="100%" height="150px" style={{ background: '#4B5563', borderRadius: '12px' }} />
      <Skeleton width="100%" height="200px" style={{ background: '#4B5563', marginTop: '1rem', borderRadius: '12px' }} />
      <Skeleton width="100%" height="200px" style={{ background: '#4B5563', marginTop: '1rem', borderRadius: '12px' }} />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: config.mainCardWidth,
        color: '#F9FAFB'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
            Mis Cervezas Favoritas Por Usuarios
          </h1>
          <Button
            label="Volver al Home"
            icon="pi pi-home"
            className="p-button-outlined"
            onClick={() => navigate('/be/home-provider')}
            style={{
              borderColor: '#4A5568',
              color: '#D1D5DB'
            }}
          />
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-4" />}
        {loading ? renderSkeleton() : (
          <>
            {statistics && renderStatistics()}
            {favouritedBrews.length > 0 ? renderBrewList() : renderEmptyState()}
          </>
        )}
      </div>
    </div>
  );
};