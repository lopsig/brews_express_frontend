
import axios from "axios"
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom"

export const UpdateProfileProviderAdmin = () => {
  const navigate = useNavigate()
  const { breweryId } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name_brewery: '',
    ruc: '',
    name_comercial: '',
    city: '',
    address: '',
    contact_number: '',
    opening_hours: '',
    description: '',
    logo: ''
  })

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
    const breweryData = location.state?.breweryData

    if (breweryData) {
      // Usar datos ya disponibles (optimizado)
      setFormData({
        name_brewery: breweryData.name_brewery || '',
        ruc: breweryData.ruc || '',
        name_comercial: breweryData.name_comercial || '',
        city: breweryData.city || '',
        address: breweryData.address || '',
        contact_number: breweryData.contact_number || '',
        opening_hours: breweryData.opening_hours || '',
        description: breweryData.description || '',
        logo: breweryData.logo || ''
      })
    } else {
      // Fallback: hacer petición si no hay datos
      const fetchBrewery = async () => {
        try {
          const response = await authenticatedAxios.get(`/be/admin/brewery/${breweryId}`)
          const brewery = response.data.brewery
          setFormData({
            name_brewery: brewery.name_brewery || '',
            ruc: brewery.ruc || '',
            name_comercial: brewery.name_comercial || '',
            city: brewery.city || '',
            address: brewery.address || '',
            contact_number: brewery.contact_number || '',
            opening_hours: brewery.opening_hours || '',
            description: brewery.description || '',
            logo: brewery.logo || ''
          })
        } catch (error) {
          console.error('Error fetching brewery:', error.response ? error.response.data : error.message)
          alert('Error al cargar los datos de la cervecería')
          navigate('/be/all-provider-admin')
        }
      }

      fetchBrewery()
    }
  }, [breweryId, location.state])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Intentando actualizar cervecería con ID:', breweryId)

      // Filtrar campos vacíos antes de enviar
      const updateData = {}
      Object.keys(formData).forEach(key => {
        const value = formData[key]

        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'string') {
            const trimmedValue = value.trim()
            if (trimmedValue !== '') {
              updateData[key] = trimmedValue
            }
          } else {
            updateData[key] = value
          }
        }
      })

      if (Object.keys(updateData).length === 0) {
        alert('No hay cambios para actualizar')
        setLoading(false)
        return
      }

      console.log('Datos a actualizar:', updateData)

      const response = await authenticatedAxios.put(`/be/admin/update_brewery/${breweryId}`, updateData)
      alert('Cervecería actualizada exitosamente')
      navigate('/be/all-provider-admin')

    } catch (error) {
      console.error('Error updating brewery:', error.response ? error.response.data : error.message)
      console.error('Brewery ID que causó el error:', breweryId)

      if (error.response?.status === 404) {
        alert('La cervecería no existe o fue eliminada. Regresando a la lista.')
        navigate('/be/all-provider-admin')
      } else {
        alert('Error al actualizar cervecería: ' + (error.response?.data?.detail || 'Error desconocido'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Actualizar Cervecería</h1>
      <h2>Editando: {formData.name_brewery}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="name_brewery"><strong>Nombre de la Cervecería:</strong></label>
          <input
            type="text"
            id="name_brewery"
            name="name_brewery"
            value={formData.name_brewery}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="ruc"><strong>RUC:</strong></label>
          <input
            type="text"
            id="ruc"
            name="ruc"
            value={formData.ruc}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="name_comercial"><strong>Razón Social:</strong></label>
          <input
            type="text"
            id="name_comercial"
            name="name_comercial"
            value={formData.name_comercial}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="city"><strong>Ciudad:</strong></label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="address"><strong>Dirección:</strong></label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="contact_number"><strong>Número de Contacto:</strong></label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="opening_hours"><strong>Horario de Atención:</strong></label>
          <input
            type="text"
            id="opening_hours"
            name="opening_hours"
            value={formData.opening_hours}
            onChange={handleInputChange}
            placeholder="Ej: Lunes a Viernes 9:00 AM - 6:00 PM"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="description"><strong>Descripción:</strong></label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '5px', resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="logo"><strong>URL del Logo:</strong></label>
          <input
            type="url"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="https://ejemplo.com/logo.jpg"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {formData.logo && (
            <div style={{ marginTop: '10px' }}>
              <p>Vista previa:</p>
              <img
                src={formData.logo}
                alt="Preview"
                style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Actualizando...' : 'Actualizar Cervecería'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/be/all-provider-admin')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}