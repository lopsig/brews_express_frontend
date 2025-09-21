// import axios from 'axios'
// import { useState, useEffect } from 'react'

// export const Body = () => {
//   const [brews, setBrews] = useState([])
//   const [favourites, setFavourites] = useState([]) // Inicializar como array vacío
//   const [loading, setLoading] = useState(false)

//   // Función para obtener el token de autenticación
//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token')
//   }

//   // Función para hacer peticiones autenticadas
//   const authenticatedAxios = axios.create({
//     baseURL: 'http://127.0.0.1:8000',
//     headers: {
//       'Authorization': `Bearer ${getAuthToken()}`
//     }
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Obtener todas las cervezas
//         const brewsResponse = await axios.get('http://127.0.0.1:8000/be/all_brews')
//         setBrews(brewsResponse.data.brews)

//         // Obtener favoritos del usuario (requiere autenticación)
//         try {
//           const favouritesResponse = await authenticatedAxios.get('/be/my_favourites')
//           setFavourites(favouritesResponse.data.favourites || [])
//         } catch (favError) {
//           // Si hay error al obtener favoritos, inicializar como array vacío
//           console.error('Error fetching favourites:', favError.response ? favError.response.data : favError.message)
//           setFavourites([])
//         }
//       } catch (error) {
//         console.error('Error fetching brews:', error.response ? error.response.data : error.message)
//         setFavourites([]) // Asegurar que favourites sea un array
//       }
//     }

//     fetchData()
//   }, [])

//   // Función para agregar a favoritos
//   const addToFavourites = async (brewId) => {
//     setLoading(true)
//     try {
//       await authenticatedAxios.post(`/be/add_favourite/${brewId}`)

//       // Actualizar la lista de favoritos
//       const favouritesResponse = await authenticatedAxios.get('/be/my_favourites')
//       setFavourites(favouritesResponse.data.favourites)

//       // alert('¡Cerveza agregada a favoritos!')
//     } catch (error) {
//       console.error('Error adding to favourites:', error.response ? error.response.data : error.message)

//       if (error.response?.status === 400) {
//         alert('Esta cerveza ya está en tus favoritos')
//       } else {
//         alert('Error al agregar a favoritos')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Función para remover de favoritos
//   const removeFromFavourites = async (brewId) => {
//     setLoading(true)
//     try {
//       await authenticatedAxios.delete(`/be/remove_favourite/${brewId}`)

//       // Actualizar la lista de favoritos
//       const favouritesResponse = await authenticatedAxios.get('/be/my_favourites')
//       setFavourites(favouritesResponse.data.favourites)

//       // alert('Cerveza removida de favoritos')
//     } catch (error) {
//       console.error('Error removing from favourites:', error.response ? error.response.data : error.message)
//       alert('Error al remover de favoritos')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Función para verificar si una cerveza está en favoritos
//   const isInFavourites = (brewId) => {
//     return favourites && favourites.length > 0 && favourites.some(fav => fav.brew_id === brewId)
//   }

//   return (
//     <div>
//       <h1>Brews Express</h1>
//       {brews.length === 0 ? (
//         <p>Cervezas no registradas.</p>
//       ) : (
//         <ul>
//           {brews.map((brew) => (
//             <li key={brew._id}>
//               <h2>{brew.name}</h2>

//               {/* Botón dinámico para favoritos */}
//               {isInFavourites(brew._id) ? (
//                 <button
//                   onClick={() => removeFromFavourites(brew._id)}
//                   disabled={loading}
//                   style={{
//                     backgroundColor: '#dc3545',
//                     color: 'white',
//                     opacity: loading ? 0.6 : 1
//                   }}
//                 >
//                   {loading ? 'Procesando...' : 'Remover de Favoritos'}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => addToFavourites(brew._id)}
//                   disabled={loading}
//                   style={{
//                     backgroundColor: '#28a745',
//                     color: 'white',
//                     opacity: loading ? 0.6 : 1
//                   }}
//                 >
//                   {loading ? 'Procesando...' : 'Añadir a Favoritos'}
//                 </button>
//               )}

//               <p>Estilo: {brew.style}</p>
//               <p>ABV: {brew.abv}%</p>
//               <p>SRM: {brew.srm}</p>
//               <p>IBU: {brew.ibu}</p>
//               <p>ml: {brew.ml}</p>
//               <p>Precio: {brew.price}</p>
//               <p>Descripción: {brew.description}</p>
//               {brew.image && (
//                 <img
//                   src={brew.image}
//                   alt={brew.name}
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



import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Panel } from 'primereact/panel'
import { Badge } from 'primereact/badge'
import { Skeleton } from 'primereact/skeleton'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { confirmDialog } from 'primereact/confirmdialog'
import { useRef } from 'react'

export const Body = ({ searchTerm }) => {  // ✅ Recibir searchTerm como prop
  const [brews, setBrews] = useState([])
  const [filteredBrews, setFilteredBrews] = useState([])
  const [loading, setLoading] = useState(false)
  const [favourites, setFavourites] = useState([])
  const [styles, setStyles] = useState([])
  const [processingFav, setProcessingFav] = useState(null)
  const toast = useRef(null)
  const navigate = useNavigate()

  // Estados para filtros
  const [selectedStyle, setSelectedStyle] = useState('')
  const [minAbv, setMinAbv] = useState(null)
  const [maxAbv, setMaxAbv] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [maxPrice, setMaxPrice] = useState(null)

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  const authenticatedAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        // Obtener estilos únicos
        const stylesResponse = await axios.get('http://127.0.0.1:8000/be/brew_styles')
        setStyles(stylesResponse.data.styles.map(style => ({ label: style, value: style })))

        // Obtener favoritos del usuario
        try {
          const favouritesResponse = await authenticatedAxios.get('/be/my_favourites')
          setFavourites(favouritesResponse.data.favourites || [])
        } catch (favError) {
          console.error('Error fetching favourites:', favError)
          setFavourites([])
        }

      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Aplicar filtros cuando cambien los parámetros
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if (searchTerm) params.append('search', searchTerm)
        if (selectedStyle) params.append('style', selectedStyle)
        if (minAbv !== null) params.append('min_abv', minAbv)
        if (maxAbv !== null) params.append('max_abv', maxAbv)
        if (minPrice !== null) params.append('min_price', minPrice)
        if (maxPrice !== null) params.append('max_price', maxPrice)

        const queryString = params.toString()
        const url = `http://127.0.0.1:8000/be/search_brews${queryString ? `?${queryString}` : ''}`

        const response = await axios.get(url)
        setFilteredBrews(response.data.brews)

      } catch (error) {
        console.error('Error applying filters:', error)
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [searchTerm, selectedStyle, minAbv, maxAbv, minPrice, maxPrice])

  // Función para limpiar filtros
  const clearFilters = () => {
    setSelectedStyle('')
    setMinAbv(null)
    setMaxAbv(null)
    setMinPrice(null)
    setMaxPrice(null)
  }

  // Verificar si cerveza está en favoritos
  const isInFavourites = (brewId) => {
    return favourites && favourites.length > 0 && favourites.some(fav => fav.brew_id === brewId)
  }

  // Agregar a favoritos
  const addToFavourites = async (brewId, brewName) => {
    setProcessingFav(brewId)
    try {
      await authenticatedAxios.post(`/be/add_favourite/${brewId}`)

      // Actualizar favoritos
      const favouritesResponse = await authenticatedAxios.get('/be/my_favourites')
      setFavourites(favouritesResponse.data.favourites)

      toast.current.show({
        severity: 'success',
        summary: 'Favorito agregado',
        detail: `${brewName} agregado a favoritos`,
        life: 3000
      })
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.status === 400 ? 'Ya está en favoritos' : 'Error al agregar',
        life: 3000
      })
    } finally {
      setProcessingFav(null)
    }
  }

  // Remover de favoritos
  const removeFromFavourites = async (brewId, brewName) => {
    setProcessingFav(brewId)
    try {
      await authenticatedAxios.delete(`/be/remove_favourite/${brewId}`)

      // Actualizar favoritos
      const favouritesResponse = await authenticatedAxios.get('/be/my_favourites')
      setFavourites(favouritesResponse.data.favourites)

      toast.current.show({
        severity: 'info',
        summary: 'Favorito removido',
        detail: `${brewName} removido de favoritos`,
        life: 3000
      })
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al remover de favoritos',
        life: 3000
      })
    } finally {
      setProcessingFav(null)
    }
  }

  const renderBrewCard = (brew) => {
    const isFavourite = isInFavourites(brew._id)
    const isProcessing = processingFav === brew._id

    const header = (
      <div style={{
        position: 'relative',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden'
      }}>
        {brew.image ? (
          <img
            alt={brew.name}
            src={brew.image}
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '200px',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="pi pi-image" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
          </div>
        )}
        <Badge
          value={`$${brew.price}`}
          severity="success"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Button
          icon={isFavourite ? "pi pi-heart-fill" : "pi pi-heart"}
          className={`p-button-rounded ${isFavourite ? 'p-button-danger' : 'p-button-outlined'}`}
          style={{ position: 'absolute', top: '10px', left: '10px' }}
          onClick={() => isFavourite ?
            removeFromFavourites(brew._id, brew.name) :
            addToFavourites(brew._id, brew.name)
          }
          disabled={isProcessing}
          tooltip={isFavourite ? 'Remover de favoritos' : 'Agregar a favoritos'}
        />
      </div>
    )

    const footer = (
      <div className="flex justify-content-between align-items-center">
        <div className="flex flex-wrap gap-1">
          <Badge value={brew.style} severity="info" className="mr-2" />
          <Badge value={`${brew.abv}% ABV`} severity="warning" />
        </div>


        {/* <div className="text-right">
          <small className="text-600">
            SRM: {brew.srm} | IBU: {brew.ibu} | {brew.ml}ml
          </small>
        </div> */}





      </div>

    )

    return (
      <Card
        key={brew._id}
        title={
          <div style={{ color: '#1F2937', fontWeight: 'bold' }}>
            {brew.name}
          </div>
        }
        subTitle={
          <div style={{ color: '#6B7280', fontWeight: '500' }}>
            {brew.ml}ml
          </div>
        }
        header={header}
        footer={footer}
        className="mb-4 h-full"
        style={{
          height: '100%',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ minHeight: '100px' }}>
          <p className="line-height-3">
            {brew.description ?
              (brew.description.length > 120 ?
                `${brew.description.substring(0, 120)}...` :
                brew.description
              ) :
              'Sin descripción disponible'
            }
          </p>
          <div
            className="mt-3"

          >
            <small className="text-600">
              SRM: {brew.srm} | IBU: {brew.ibu}
            </small>
          </div>
        </div>

      </Card>
    )
  }

  return (
    <div style={{
      padding: '24px 16px',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
      minHeight: '100vh'
    }}>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Panel de filtros */}
      <Panel
        header={
          <div style={{
            color: '#1F2937',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="pi pi-filter" />
            Filtros de Búsqueda
          </div>
        }
        toggleable
        collapsed
        className="mb-6"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="col-12 md:col-6 lg:col-2">
                    <Button
                      label="Limpiar"
                      icon="pi pi-refresh"
                      className="w-full"
                      onClick={clearFilters}
                      style={{
                        background: '#F3F4F6',
                        border: '1px solid #D1D5DB',
                        color: '#374151',
                        borderRadius: '8px',
                        fontWeight: '600',
                        width: '80px',
          
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#E5E7EB';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#F3F4F6';
                      }}
          />
        </div>

        <div className="grid gap-4 p-4">

          <div className="col-12 md:col-6 lg:col-3">
            <label htmlFor="style-filter" className="block font-medium mb-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
              Estilo de Cerveza
            </label>
            <Dropdown
              id="style-filter"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.value)}
              options={[{ label: 'Todos los estilos', value: '' }, ...styles]}
              placeholder="Seleccionar estilo"
              className="w-full"
              showClear
              style={{
                borderColor: '#D1D5DB',
                borderRadius: '8px'
              }}
            />
          </div>

          <div className="col-12 md:col-6 lg:col-2">
            <label htmlFor="min-abv" className="block font-medium mb-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
              ABV Mínimo
            </label>
            <InputNumber
              id="min-abv"
              value={minAbv}
              onChange={(e) => setMinAbv(e.value)}
              placeholder="0"
              suffix="%"
              className="w-full"
              min={0}
              max={20}
              step={0.1}
              style={{
                borderColor: '#D1D5DB',
                borderRadius: '8px'
              }}
            />
          </div>
          
          <div className="col-12 md:col-6 lg:col-2">
            <label htmlFor="max-abv" className="block font-medium mb-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
              ABV Máximo
            </label>
            <InputNumber
              id="max-abv"
              value={maxAbv}
              onChange={(e) => setMaxAbv(e.value)}
              placeholder="20"
              suffix="%"
              className="w-full"
              min={0}
              max={20}
              step={0.1}
              style={{
                borderColor: '#D1D5DB',
                borderRadius: '8px'
              }}
            />
          </div>


          <div className="col-12 md:col-6 lg:col-2">
            <label htmlFor="min-price" className="block font-medium mb-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
              Precio Mínimo
            </label>
            <InputNumber
              id="min-price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.value)}
              placeholder="0"
              prefix="$"
              className="w-full"
              min={0}
              step={0.1}
              style={{
                borderColor: '#D1D5DB',
                borderRadius: '8px'
              }}
            />
          </div>
          <div className="col-12 md:col-6 lg:col-2">
            <label htmlFor="max-price" className="block font-medium mb-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
              Precio Máximo
            </label>
            <InputNumber
              id="max-price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.value)}
              placeholder="100"
              prefix="$"
              className="w-full"
              min={0}
              step={0.1}
              style={{
                borderColor: '#D1D5DB',
                borderRadius: '8px'
              }}
            />


          </div>
          
                  </div>
      </Panel>
            <div className="flex flex-col sm:flex-row justify-between align-items-start sm:align-items-center mb-6 gap-4">
      
            
              <div className="flex align-items-center gap-2">
                <Button
                  label="Mis Favoritos"
                  icon="pi pi-heart"
                  className="p-button-success"
            onClick={() => navigate('/be/favourites-user')}
                />

              </div>
            </div>



      {/* Resultados */}
      <div className="flex flex-wrap align-items-center gap-2">

        <h1>Todas Las Cervezas</h1>
        <span
          style={{
            background: '#F3F4F6',
            color: '#374151',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            border: '1px solid #E5E7EB'
          }}
        >
          {filteredBrews.length} resultado{filteredBrews.length !== 1 ? 's' : ''}
        </span>
        {searchTerm && (
          <span
            style={{
              background: 'linear-gradient(135deg, #1F2937, #374151)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            "{searchTerm}"
          </span>
        )}

      </div>
      
      {loading ? (
        <div className="grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="col-12 sm:col-6 lg:col-4 xl:col-3">
              <Card style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '12px'
              }}>
                <Skeleton width="100%" height="220px" className="mb-3" />
                <Skeleton width="70%" height="1.5rem" className="mb-2" />
                <Skeleton width="40%" height="1rem" className="mb-3" />
                <Skeleton width="100%" height="4rem" className="mb-3" />
                <div className="flex justify-between">
                  <Skeleton width="60%" height="1.5rem" />
                  <Skeleton width="80px" height="2rem" />
                </div>
              </Card>
            </div>
            
          ))}
        </div>
      ) : (
        <>
          {filteredBrews.length === 0 ? (
              <div
                className="text-center p-8"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <i className="pi pi-search" style={{ fontSize: '4rem', color: '#D1D5DB', marginBottom: '16px' }}></i>
                <h3 style={{ color: '#1F2937', marginBottom: '8px' }}>No se encontraron cervezas</h3>
                <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                  Intenta ajustar los filtros de búsqueda o el término de búsqueda
                </p>
                <Button
                  label="Limpiar Filtros"
                  icon="pi pi-refresh"
                  onClick={clearFilters}
                  style={{
                    background: 'linear-gradient(135deg, #1F2937, #374151)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                />
              </div>

          ) : (
            <div className="grid">
              {filteredBrews.map((brew) => (
                <div key={brew._id} className="col-12 sm:col-6 lg:col-4 xl:col-3">
                  {renderBrewCard(brew)}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
      )
  }