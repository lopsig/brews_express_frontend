import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Panel } from 'primereact/panel'
import { Badge } from 'primereact/badge'
import { Skeleton } from 'primereact/skeleton'
const API_URL = import.meta.env.VITE_API_URL

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
        const brewsResponse = await axios.get(API_URL + '/brews_express/all_brews')
        setBrews(brewsResponse.data.brews)
        setFilteredBrews(brewsResponse.data.brews)

        // Obtener estilos únicos para el dropdown
        const stylesResponse = await axios.get(API_URL + '/brews_express/brew_styles')
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
        const url = API_URL + `/brews_express/search_brews${queryString ? `?${queryString}` : ''}`

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
            height: '220px',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="pi pi-image" style={{ fontSize: '3rem', color: '#9CA3AF' }}></i>
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
        className="mb-4 hover:shadow-lg transition-all duration-300"
        style={{
          height: '100%',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ minHeight: '100px' }}>
          <p
            className="line-height-3"

          >

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
              width: '80px'
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

      {/* Resultados */}
      <div className="flex flex-col sm:flex-row justify-between align-items-start sm:align-items-center mb-6 gap-4">
        <h1 style={{
          color: '#1F2937',
          fontSize: window.innerWidth < 768 ? '1.8rem' : '2.2rem',
          fontWeight: 'bold',
          margin: 0
        }}>
          Cervezas Artesanales
        </h1>
        <div className="flex flex-wrap align-items-center gap-2">
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
      </div>

      {/* Contenido principal */}
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