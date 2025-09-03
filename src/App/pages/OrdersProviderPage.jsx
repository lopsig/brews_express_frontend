import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

export const OrdersProviderPage = () => {
  const [favouritedBrews, setFavouritedBrews] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  const authenticatedAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  useEffect(() => {
    const fetchFavouritedBrews = async () => {
      setLoading(true)
      try {
        const response = await authenticatedAxios.get('/brews/my_brews_favourites')
        setFavouritedBrews(response.data.favourited_brews)
        setStatistics(response.data.statistics)
      } catch (error) {
        console.error('Error fetching favourited brews:', error.response ? error.response.data : error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFavouritedBrews()
  }, [])

  if (loading) {
    return <div>Cargando datos de favoritos...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Cervezas Favoritas por Usuarios</h1>
      <button
        onClick={() => navigate('/be/home-provider')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Home
      </button>

      {/* Estadísticas */}
      {statistics && (
        <div style={{
          backgroundColor: '#e9ecef',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2>Estadísticas de Favoritos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', margin: '0' }}>{statistics.total_brews_with_favourites}</h3>
              <p>Cervezas con Favoritos</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#28a745', margin: '0' }}>{statistics.total_favourites_count}</h3>
              <p>Total de Favoritos</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#dc3545', margin: '0' }}>{statistics.most_popular_brew.favourites_count}</h3>
              <p>Favoritos de la Más Popular</p>
            </div>
          </div>
          {statistics.most_popular_brew.name && (
            <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
              Cerveza más popular: {statistics.most_popular_brew.name}
            </p>
          )}
        </div>
      )}

      {favouritedBrews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3>No hay favoritos aún</h3>
          <p>Ninguna de tus cervezas ha sido marcada como favorita por los usuarios.</p>
        </div>
      ) : (
        <div>
          <h2>Cervezas Favoritas de los Usuarios</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {favouritedBrews.map((brew) => (
              <li key={brew._id} style={{
                border: '1px solid #ddd',
                margin: '15px 0',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: '0' }}>{brew.name}</h3>
                  <div style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {brew.total_favourites} Favorito{brew.total_favourites !== 1 ? 's' : ''}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  <p><strong>Estilo:</strong> {brew.style}</p>
                  <p><strong>ABV:</strong> {brew.abv}%</p>
                  <p><strong>Precio:</strong> ${brew.price}</p>
                  <p><strong>ML:</strong> {brew.ml}</p>
                </div>

                {brew.image && (
                  <div style={{ marginBottom: '15px' }}>
                    <img
                      src={brew.image}
                      alt={brew.name}
                      style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Lista de usuarios que dieron favorito */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '6px',
                  marginTop: '15px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Usuarios que marcaron como favorito:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {brew.users_who_favourited.map((user, index) => (
                      <div key={user._id} style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                      }}>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>
                          {user.first_name} {user.last_name}
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
                          {user.email}
                        </p>
                        {brew.favourites_info[index] && (
                          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                            Agregado: {new Date(brew.favourites_info[index].created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}