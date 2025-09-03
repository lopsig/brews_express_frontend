import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

export const FavouritesUserPage = () => {
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  // Función para hacer peticiones autenticadas
  const authenticatedAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await authenticatedAxios.get('/be/my_favourites')
        setFavourites(response.data.favourites)
      } catch (error) {
        console.error('Error fetching favourites:', error.response ? error.response.data : error.message)
      }
    }

    fetchFavourites()
  }, [])

  // Función para remover de favoritos
  const removeFromFavourites = async (brewId) => {
    setLoading(true)
    try {
      await authenticatedAxios.delete(`/be/remove_favourite/${brewId}`)

      // Actualizar la lista de favoritos
      const response = await authenticatedAxios.get('/be/my_favourites')
      setFavourites(response.data.favourites)

      // alert('Cerveza removida de favoritos')
    } catch (error) {
      console.error('Error removing from favourites:', error.response ? error.response.data : error.message)
      alert('Error al remover de favoritos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Mis Favoritos</h1>
      <button onClick={() => navigate('/be/home')}>Home</button>
      {favourites.length === 0 ? (
        <p>No tienes cervezas favoritas aún.</p>
      ) : (
        <ul>
          {favourites.map((favourite) => (
            <li key={favourite._id}>
              <h2>{favourite.brew_info.name}</h2>

              <button
                onClick={() => removeFromFavourites(favourite.brew_id)}
                disabled={loading}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Procesando...' : 'Remover de Favoritos'}
              </button>

              <p>Estilo: {favourite.brew_info.style}</p>
              <p>ABV: {favourite.brew_info.abv}%</p>
              <p>SRM: {favourite.brew_info.srm}</p>
              <p>IBU: {favourite.brew_info.ibu}</p>
              <p>ml: {favourite.brew_info.ml}</p>
              <p>Precio: {favourite.brew_info.price}</p>
              <p>Descripción: {favourite.brew_info.description}</p>
              <p>Agregado el: {new Date(favourite.created_at).toLocaleDateString()}</p>

              {favourite.brew_info.image && (
                <img
                  src={favourite.brew_info.image}
                  alt={favourite.brew_info.name}
                  style={{ width: '200px', height: 'auto' }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}