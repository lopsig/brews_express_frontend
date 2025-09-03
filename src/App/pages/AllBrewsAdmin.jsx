import axios from "axios"
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"

export const AllBrewsAdmin = () => {
  const navigate = useNavigate()
  const { breweryId } = useParams()
  const [brews, setBrews] = useState([])
  const [breweryName, setBreweryName] = useState('')
  const [loading, setLoading] = useState(true)

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
    const fetchBreweryBrews = async () => {
      try {
        const response = await authenticatedAxios.get(`/be/admin/brewery_brews/${breweryId}`)
        setBrews(response.data.brews)
        setBreweryName(response.data.brewery_name)
      } catch (error) {
        console.error('Error fetching brewery brews:', error.response ? error.response.data : error.message)
        alert('Error al cargar las cervezas de la cervecería')
        navigate('/be/all-provider-admin')
      } finally {
        setLoading(false)
      }
    }

    if (breweryId) {
      fetchBreweryBrews()
    }
  }, [breweryId])

  if (loading) {
    return <div>Cargando cervezas...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cervezas de {breweryName}</h1>
      <button onClick={() => navigate('/be/all-provider-admin')}>Regresar a Cervecerías</button>

      {brews.length === 0 ? (
        <p>Esta cervecería no tiene cervezas registradas.</p>
      ) : (
        <div>
          <p><strong>Total de cervezas:</strong> {brews.length}</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {brews.map(brew => (
              <li key={brew._id} style={{
                border: '1px solid #ddd',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}>
                <h3>{brew.name}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <p><strong>Estilo:</strong> {brew.style}</p>
                  <p><strong>ABV:</strong> {brew.abv}%</p>
                  <p><strong>SRM:</strong> {brew.srm}</p>
                  <p><strong>IBU:</strong> {brew.ibu}</p>
                  <p><strong>ML:</strong> {brew.ml}</p>
                  <p><strong>Precio:</strong> ${brew.price}</p>
                </div>

                {brew.description && (
                  <p><strong>Descripción:</strong> {brew.description}</p>
                )}

                {brew.image && (
                  <div style={{ marginTop: '10px' }}>
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}