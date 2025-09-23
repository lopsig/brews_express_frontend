import axios from "axios";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import { HeaderAdmin } from "../components/HeaderAdmin";
const API_URL = import.meta.env.VITE_API_URL

export const AllProviderAdmin = () => {
  const navigate = useNavigate();
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingBreweryId, setDeletingBreweryId] = useState(null);
  const toast = useRef(null);

  const [nameFilter, setNameFilter] = useState('');
  const [rucFilter, setRucFilter] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const authenticatedAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      try {
        const response = await authenticatedAxios.get("/be/admin/all_breweries");
        setBreweries(response.data.breweries);
      } catch (error) {
        console.error('Error fetching breweries:', error.response ? error.response.data : error.message);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las cervecerías.',
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBreweries();
  }, []);

  const handleUpdateBrewery = (breweryId) => {
    navigate(`/be/update-profile-provider-admin/${breweryId}`);
  };

  const handleDeleteBrewery = async (breweryId, breweryName) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la cervecería "${breweryName}"? Esta acción no se puede deshacer.`);
    if (confirmDelete) {
      setDeletingBreweryId(breweryId);
      try {
        console.log('Eliminando cervecería con ID:', breweryId);
        await authenticatedAxios.delete(`/be/admin/delete_brewery/${breweryId}`);
        setBreweries(prevBreweries => prevBreweries.filter(brewery => brewery._id !== breweryId));
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cervecería "${breweryName}" eliminada exitosamente.`,
          life: 3000
        });
      } catch (error) {
        console.error('Error deleting brewery:', error.response ? error.response.data : error.message);
        let errorMessage = 'Error al eliminar cervecería. Intenta de nuevo.';
        if (error.response?.status === 400) {
          errorMessage = 'No se puede eliminar la cervecería porque tiene cervezas asociadas. Elimina las cervezas primero.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Cervecería no encontrada';
        }
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        });
      } finally {
        setDeletingBreweryId(null);
      }
    }
  };

  const handleViewBrews = (breweryId) => {
    navigate(`/be/all-brews-admin/${breweryId}`);
  };

  // Define las columnas y el body de la tabla
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="p-d-flex p-jc-end p-gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-text p-button-sm"
          tooltip="Actualizar"
          onClick={() => handleUpdateBrewery(rowData._id)}
        />
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-text p-button-sm"
          tooltip="Ver Cervezas"
          onClick={() => handleViewBrews(rowData._id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text p-button-sm"
          tooltip="Eliminar"
          disabled={deletingBreweryId === rowData._id}
          onClick={() => handleDeleteBrewery(rowData._id, rowData.name_brewery)}
        />
      </div>
    );
  };

  const logoBodyTemplate = (rowData) => {
    return (
      <div className="p-d-flex p-ai-center p-jc-center">
        <img
          src={rowData.logo || '/src/assets/img/default-brewery-logo.png'}
          alt={rowData.name_brewery}
          style={{ width: '50px', borderRadius: '50%' }}
        />
      </div>
    );
  };

  const filteredBreweries = breweries.filter(brewery => {
    const nameMatch = (brewery.name_brewery || '').toLowerCase().includes(nameFilter.toLowerCase());
    const rucMatch = (brewery.ruc || '').toString().toLowerCase().includes(rucFilter.toLowerCase());
    return nameMatch && rucMatch;
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".8s" />
        <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando cervecerías...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #E5E7EB 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <HeaderAdmin />
      <Toast ref={toast} />

      <div style={{
        flexGrow: 1,
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#1F2937' }}>
            Todas las Cervecerías
          </h1>
          <Button
            label="Regresar"
            icon="pi pi-angle-left"
            className="p-button-secondary"
            onClick={() => navigate('/be/home-admin')}
          />
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: '1.5rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <span className="p-input-icon-left p-fluid" style={{ flex: '1' }}>
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar por nombre"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ width: '100%' }}
            />
          </span>
          <span className="p-input-icon-left p-fluid" style={{ flex: '1' }}>
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar por RUC"
              value={rucFilter}
              onChange={(e) => setRucFilter(e.target.value)}
              style={{ width: '100%' }}
            />
          </span>
        </div>

        {filteredBreweries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#6B7280' }}>
              No hay cervecerías que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}>
            <DataTable
              value={filteredBreweries}
              responsiveLayout="scroll"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sortField="name_brewery"
              sortOrder={1}
              emptyMessage="No se encontraron cervecerías."
              className="p-datatable-sm"
              globalFilter={nameFilter || rucFilter}
            >
              <Column header="Logo" body={logoBodyTemplate} style={{ width: '80px', textAlign: 'center' }}></Column>
              <Column field="name_brewery" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre"></Column>
              <Column field="ruc" header="RUC" sortable></Column>
              <Column field="city" header="Ciudad" sortable></Column>
              <Column field="contact_number" header="Contacto"></Column>
              <Column field="email" header="Correo"></Column>
              <Column header="Acciones" body={actionBodyTemplate} style={{ width: '150px', textAlign: 'center' }}></Column>
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
};