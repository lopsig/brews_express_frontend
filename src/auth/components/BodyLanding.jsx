import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Panel } from 'primereact/panel'
import { Badge } from 'primereact/badge'
import { Skeleton } from 'primereact/skeleton'

export const BodyLanding = ({ searchTerm }) => {  // ✅ Recibir searchTerm como prop
  const [brews, setBrews] = useState([])
  const [filteredBrews, setFilteredBrews] = useState([])
  const [loading, setLoading] = useState(false)
  const [styles, setStyles] = useState([])

  // Estados para filtros
  const [selectedStyle, setSelectedStyle] = useState('')
  const [minAbv, setMinAbv] = useState(null)
  const [maxAbv, setMaxAbv] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [maxPrice, setMaxPrice] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        // Obtener todas las cervezas
        const brewsResponse = await axios.get('http://127.0.0.1:8000/brews_express/all_brews')
        setBrews(brewsResponse.data.brews)
        setFilteredBrews(brewsResponse.data.brews)

        // Obtener estilos únicos para el dropdown
        const stylesResponse = await axios.get('http://127.0.0.1:8000/brews_express/brew_styles')
        setStyles(stylesResponse.data.styles.map(style => ({ label: style, value: style })))

      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message)
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
        const url = `http://127.0.0.1:8000/brews_express/search_brews${queryString ? `?${queryString}` : ''}`

        const response = await axios.get(url)
        setFilteredBrews(response.data.brews)

      } catch (error) {
        console.error('Error applying filters:', error.response ? error.response.data : error.message)
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [searchTerm, selectedStyle, minAbv, maxAbv, minPrice, maxPrice])

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSelectedStyle('')
    setMinAbv(null)
    setMaxAbv(null)
    setMinPrice(null)
    setMaxPrice(null)
  }

  const renderBrewCard = (brew) => {
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
      <div className="flex justify-content-between align-items-center">
        <div>
          <Badge value={brew.style} severity="info" className="mr-2" />
          <Badge value={`${brew.abv}% ABV`} severity="warning" />
        </div>
        {/* <Button
          label="Ver Detalles"
          icon="pi pi-eye"
          className="p-button-text"
          onClick={() => console.log('Ver detalles de:', brew.name)}
        /> */}
      </div>
    )

    return (
      <Card
        key={brew._id}
        title={brew.name}
        subTitle={`${brew.ml}ml`}
        header={header}
        footer={footer}
        className="mb-4"
        style={{ height: '100%' }}
      >
        <div style={{ minHeight: '80px' }}>
          <p className="line-height-3">
            {brew.description ?
              (brew.description.length > 100 ?
                `${brew.description.substring(0, 100)}...` :
                brew.description
              ) :
              'Sin descripción disponible'
            }
          </p>
          <div className="mt-3">
            <small className="text-600">
              SRM: {brew.srm} | IBU: {brew.ibu}
            </small>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
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
              step={0.1}
            />
          </div>

          <div className="col-12 md:col-6 lg:col-2">
            <label htmlFor="max-price" className="block text-900 font-medium mb-2">Precio Máx</label>
            <InputNumber
              id="max-price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.value)}
              placeholder="30"
              prefix="$"
              className="w-full"
              min={0}
              step={0.1}
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
            <div key={item} className="col-12 md:col-6 lg:col-4">
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