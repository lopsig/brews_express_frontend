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

export const BrewsProviderPage = ({ searchTerm }) => {  // ✅ Recibir searchTerm
  const [brews, setBrews] = useState([])
  const [filteredBrews, setFilteredBrews] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingBrewId, setDeletingBrewId] = useState(null)
  const [styles, setStyles] = useState([])
  const navigate = useNavigate()
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
        // Obtener estilos únicos del proveedor
        const stylesResponse = await authenticatedAxios.get('/brews/my_brew_styles')
        setStyles(stylesResponse.data.styles.map(style => ({ label: style, value: style })))

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
        const url = `/brews/search_my_brews${queryString ? `?${queryString}` : ''}`

        const response = await authenticatedAxios.get(url)
        setFilteredBrews(response.data.brews)

      } catch (error) {
        console.error('Error applying filters:', error)
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al aplicar filtros',
          life: 3000
        })
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [searchTerm, selectedStyle, minAbv, maxAbv, minPrice, maxPrice])

  const clearFilters = () => {
    setSelectedStyle('')
    setMinAbv(null)
    setMaxAbv(null)
    setMinPrice(null)
    setMaxPrice(null)
  }

  const handleUpdateBrew = (brewId) => {
    navigate(`/be/update-brew/${brewId}`)
  }

  const confirmDelete = (brewId, brewName) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas eliminar la cerveza "${brewName}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDeleteBrew(brewId, brewName),
      reject: () => { },
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger'
    })
  }

  const handleDeleteBrew = async (brewId, brewName) => {
    setDeletingBrewId(brewId)
    try {
      await authenticatedAxios.delete(`/brews/delete_brew/${brewId}`)

      setFilteredBrews(prevBrews => prevBrews.filter(brew => brew._id !== brewId))
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `${brewName} eliminada exitosamente`,
        life: 3000
      })

    } catch (error) {
      console.error('Error deleting brew:', error)

      let errorMessage = 'Error desconocido'
      if (error.response?.status === 404) {
        errorMessage = 'Cerveza no encontrada'
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para eliminar'
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor'
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 4000
      })
    } finally {
      setDeletingBrewId(null)
    }
  }

  const renderBrewCard = (brew) => {
    const isDeleting = deletingBrewId === brew._id

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
      </div>
    )

    const footer = (
      <div className="flex justify-content-between align-items-center gap-2">
        <div className="flex flex-wrap gap-1">
          <Badge value={brew.style} severity="info" className="text-xs" />
          <Badge value={`${brew.abv}% ABV`} severity="warning" className="text-xs" />
        </div>
        <div className="flex gap-1">
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => handleUpdateBrew(brew._id)}
            tooltip="Actualizar cerveza"
          />
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text p-button-danger p-button-sm"
            onClick={() => confirmDelete(brew._id, brew.name)}
            disabled={isDeleting}
            tooltip="Eliminar cerveza"
          />
        </div>
      </div>
    )

    return (
      <Card
        key={brew._id}
        title={brew.name}
        subTitle={`${brew.ml}ml | SRM: ${brew.srm} | IBU: ${brew.ibu}`}
        header={header}
        footer={footer}
        className={`mb-4 h-full ${isDeleting ? 'opacity-50' : ''}`}
      >
        <div style={{ minHeight: '60px' }}>
          <p className="line-height-3 text-600 text-sm">
            {brew.description ?
              (brew.description.length > 120 ?
                `${brew.description.substring(0, 120)}...` :
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
      <ConfirmDialog />

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

      {/* Header con botones de acción */}
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Mis Cervezas</h1>
        <div className="flex align-items-center gap-2">
          <Button
            label="Agregar Cerveza"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => navigate('/be/create-brew')}
          />
          <Button
            label="Pedidos"
            icon="pi pi-shopping-cart"
            className="p-button-info"
            onClick={() => navigate('/be/orders-provider')}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="flex align-items-center gap-3 mb-4">
        <Badge
          value={`${filteredBrews.length} cerveza${filteredBrews.length !== 1 ? 's' : ''}`}
          severity="info"
        />
        {searchTerm && (
          <Badge
            value={`Búsqueda: "${searchTerm}"`}
            severity="warning"
          />
        )}
      </div>

      {loading ? (
        <div className="grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="col-12 md:col-6 lg:col-4 xl:col-3">
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
              <p>
                {searchTerm || selectedStyle || minAbv || maxAbv || minPrice || maxPrice
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no tienes cervezas registradas'
                }
              </p>
              <div className="flex gap-2 justify-content-center">
                {(searchTerm || selectedStyle || minAbv || maxAbv || minPrice || maxPrice) && (
                  <Button
                    label="Limpiar Filtros"
                    icon="pi pi-refresh"
                    className="p-button-outlined"
                    onClick={clearFilters}
                  />
                )}
                <Button
                  label="Agregar Cerveza"
                  icon="pi pi-plus"
                  className="p-button-success"
                  onClick={() => navigate('/be/create-brew')}
                />
              </div>
            </div>
          ) : (
            <div className="grid">
              {filteredBrews.map((brew) => (
                <div key={brew._id} className="col-12 md:col-6 lg:col-4 xl:col-3">
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