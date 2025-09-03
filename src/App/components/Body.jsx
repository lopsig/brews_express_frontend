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
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Panel } from 'primereact/panel'
import { Badge } from 'primereact/badge'
import { Skeleton } from 'primereact/skeleton'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

export const Body = ({ searchTerm }) => {  // ✅ Recibir searchTerm como prop
  const [brews, setBrews] = useState([])
  const [filteredBrews, setFilteredBrews] = useState([])
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(false)
  const [styles, setStyles] = useState([])
  const [processingFav, setProcessingFav] = useState(null)
  const toast = useRef(null)

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
      <div style={{ position: 'relative' }}>
        {brew.image ? (
          <img
            alt={brew.name}
            src={brew.image}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f8f9fa',
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
          style={{ position: 'absolute', top: '10px', right: '10px' }}
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
        <div>
          <Badge value={brew.style} severity="info" className="mr-2" />
          <Badge value={`${brew.abv}% ABV`} severity="warning" />
        </div>
        <div className="text-right">
          <small className="text-600">
            SRM: {brew.srm} | IBU: {brew.ibu} | {brew.ml}ml
          </small>
        </div>
      </div>
    )

    return (
      <Card
        key={brew._id}
        title={brew.name}
        header={header}
        footer={footer}
        className="mb-4 h-full"
      >
        <div style={{ minHeight: '60px' }}>
          <p className="line-height-3 text-600">
            {brew.description ?
              (brew.description.length > 100 ?
                `${brew.description.substring(0, 100)}...` :
                brew.description
              ) :
              'Sin descripción disponible'
            }
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <Toast ref={toast} />

      {/* Panel de filtros */}
      <Panel header="Filtros de Búsqueda" toggleable collapsed className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3">
            <label htmlFor="style-filter" className="block text-900 font-medium mb-2">Estilo</label>
            <Dropdown
              id="style-filter"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.value)}
              options={[{ label: 'Todos los estilos', value: '' }, ...styles]}
              placeholder="Seleccionar estilo"
              className="w-full"
              showClear
            />
          </div>

                    <div className="col-12 md:col-6 lg:col-2">
                      <label htmlFor="min-abv" className="block text-900 font-medium mb-2">ABV Mínimo</label>
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
                      />
          </div>
          
                    <div className="col-12 md:col-6 lg:col-2">
                      <label htmlFor="max-abv" className="block text-900 font-medium mb-2">ABV Máximo</label>
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
                      />
          </div>

                    <div className="col-12 md:col-6 lg:col-2">
                      <label htmlFor="min-price" className="block text-900 font-medium mb-2">Precio Mín</label>
                      <InputNumber
                        id="min-price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.value)}
                        placeholder="0"
                        prefix="$"
                        className="w-full"
                        min={0}
                        step={0.5}
                      />
          </div>
                    <div className="col-12 md:col-6 lg:col-2">
                      <label htmlFor="max-price" className="block text-900 font-medium mb-2">Precio Máx</label>
                      <InputNumber
                        id="max-price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.value)}
                        placeholder="100"
                        prefix="$"
                        className="w-full"
                        min={0}
                        step={0.5}
                      />
          </div>
          
                    <div className="col-12 md:col-12 lg:col-1">
                      <label className="block text-900 font-medium mb-2">&nbsp;</label>
                      <Button
                        label="Limpiar"
                        icon="pi pi-refresh"
                        className="p-button-outlined w-full"
                        onClick={clearFilters}
                      />
                    </div>
                  </div>
      </Panel>

      {/* Resultados */}
            <div className="flex justify-content-between align-items-center mb-4">
              <h1>Todas Las Cervezas</h1>
              <div className="flex align-items-center">
                <Badge
                  value={`${filteredBrews.length} resultado${filteredBrews.length !== 1 ? 's' : ''}`}
                  severity="info"
                />
                {searchTerm && (
                  <Badge
                    value={`Búsqueda: "${searchTerm}"`}
                    severity="warning"
                    className="ml-2"
                  />
                )}
              </div>
      </div>
      
      {loading ? (
        <div className="grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="col-12 md:col-6 lg:4" >
              <Card>
                <Skeleton width="100%" height="200px" className="mb-3" />
                <Skeleton width="60%" height="1.5rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-3" />
                <Skeleton width="80%" height="1rem" />
              
              
              </Card>
            </div>
            
          ))}
        </div>
      ) : (
        <>
          {filteredBrews.length === 0 ? (
            <div className="text-center p-6">
              <i className="pi pi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              <h3>No se encontraron cervezas</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              <Button
                label="Limpiar Filtros"
                icon="pi pi-refresh"
                className="p-button-outlined"
                onClick={clearFilters}
              />
            </div>

          ) : (
            <div className="grid">
              {filteredBrews.map((brew) => (
                <div key={brew._id} className="col-12 md:col-6 lg:col-4">
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