import axios from "axios"
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

export const AllProviderAdmin = () => {
  const navigate = useNavigate()
  const [breweries, setBreweries] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingBreweryId, setDeletingBreweryId] = useState(null)

  // ➡️ Nuevos estados para los filtros
  const [nameFilter, setNameFilter] = useState('')
  const [rucFilter, setRucFilter] = useState('')

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
    const fetchBreweries = async () => {
      setLoading(true)
      try {
        const response = await authenticatedAxios.get("/be/admin/all_breweries")
        setBreweries(response.data.breweries)
      } catch (error) {
        console.error('Error fetching breweries:', error.response ? error.response.data : error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBreweries()
  }, [])

  const handleUpdateBrewery = (breweryId) => {
    navigate(`/be/update-profile-provider-admin/${breweryId}`)
  }

  const handleDeleteBrewery = async (breweryId, breweryName) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la cervecería "${breweryName}"? Esta acción no se puede deshacer.`)
    if (confirmDelete) {
      setDeletingBreweryId(breweryId)
      try {
        console.log('Eliminando cervecería con ID:', breweryId)
        await authenticatedAxios.delete(`/be/admin/delete_brewery/${breweryId}`)
        setBreweries(prevBreweries => prevBreweries.filter(brewery => brewery._id !== breweryId))
        alert('Cervecería eliminada exitosamente')
      } catch (error) {
        console.error('Error deleting brewery:', error.response ? error.response.data : error.message)
        if (error.response?.status === 400) {
          alert('No se puede eliminar la cervecería porque tiene cervezas asociadas. Elimina las cervezas primero.')
        } else if (error.response?.status === 404) {
          alert('Cervecería no encontrada')
        } else {
          alert('Error al eliminar cervecería: ' + (error.response?.data?.detail || 'Error desconocido'))
        }
      } finally {
        setDeletingBreweryId(null)
      }
    }
  }

  const handleViewBrews = (breweryId) => {
    navigate(`/be/admin/all-brews-admin/${breweryId}`)
  }

  // ➡️ Lógica de filtrado de cervecerías
  const filteredBreweries = breweries.filter(brewery => {
    const nameMatch = (brewery.name_brewery || '').toLowerCase().includes(nameFilter.toLowerCase());
    const rucMatch = (brewery.ruc || '').toString().toLowerCase().includes(rucFilter.toLowerCase());

    return nameMatch && rucMatch;
  });

  if (loading) {
    return <div>Cargando cervecerías...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todas las Cervecerías</h1>
      <Button
        label="Regresar"
        icon="pi pi-angle-left"
        className="p-button-secondary"
        onClick={() => navigate('/be/home-admin')}
        style={{ marginBottom: '20px' }}
      />

      {/* ➡️ Contenedor de las barras de búsqueda */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '15px' }}>
        <span className="p-input-icon-left" style={{ width: '50%' }}>
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar por nombre"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </span>
        <span className="p-input-icon-left" style={{ width: '50%' }}>
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar por RUC"
            value={rucFilter}
            onChange={(e) => setRucFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </span>
      </div>

      {/* ➡️ Muestra los resultados filtrados */}
      {filteredBreweries.length === 0 ? (
        <p>No hay cervecerías que coincidan con la búsqueda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredBreweries.map(brewery => (
            <li key={brewery._id} style={{
              border: '1px solid #ddd',
              margin: '15px 0',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h2>{brewery.name_brewery}</h2>
              <div style={{ marginBottom: '15px' }}>
                {/* ➡️ Botones de PrimeReact */}
                <Button
                  label="Actualizar"
                  icon="pi pi-pencil"
                  className="p-button-success p-button-sm"
                  onClick={() => handleUpdateBrewery(brewery._id)}
                  style={{ marginRight: '10px' }}
                />
                <Button
                  label={deletingBreweryId === brewery._id ? 'Eliminando...' : 'Eliminar'}
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => handleDeleteBrewery(brewery._id, brewery.name_brewery)}
                  disabled={deletingBreweryId === brewery._id}
                />
                {/* ➡️ Botón de Ver Cervezas (activo) */}
                {/* <Button
                  label="Ver Cervezas"
                  icon="pi pi-eye"
                  className="p-button-info p-button-sm"
                  onClick={() => handleViewBrews(brewery._id)}
                  style={{ marginLeft: '10px' }}
                /> */}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <p><strong>ID:</strong> {brewery._id}</p>
                <p><strong>RUC:</strong> {brewery.ruc || 'No especificado'}</p>
                <p><strong>Razón Social:</strong> {brewery.name_comercial || 'No especificada'}</p>
                <p><strong>Ciudad:</strong> {brewery.city || 'No especificada'}</p>
                <p><strong>Dirección:</strong> {brewery.address || 'No especificada'}</p>
                <p><strong>Contacto:</strong> {brewery.contact_number || 'No especificado'}</p>
              </div>
              {/* ... (el resto del JSX sin cambios) ... */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
