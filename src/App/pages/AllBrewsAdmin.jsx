


import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { HeaderAdmin } from "../components/HeaderAdmin";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

export const AllBrewsAdmin = () => {
  const navigate = useNavigate();
  const { breweryId } = useParams();
  const [brews, setBrews] = useState([]);
  const [breweryName, setBreweryName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const authenticatedAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  useEffect(() => {
    const fetchBrews = async () => {
      setLoading(true);
      try {
        const response = await authenticatedAxios.get(`/be/admin/brewery_brews/${breweryId}`);
        setBrews(response.data.brews);
        setBreweryName(response.data.brewery_name);
      } catch (error) {
        console.error('Error fetching brews:', error.response ? error.response.data : error.message);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las cervezas de la cervecería.',
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    if (breweryId) {
      fetchBrews();
    }
  }, [breweryId]);

  const handleUpdateBrew = (brewId) => {
    navigate(`/be/update-brew-admin/${brewId}`);
  };

  const handleDeleteBrew = async (brewId, brewName) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la cerveza "${brewName}"? Esta acción no se puede deshacer.`);
    if (confirmDelete) {
      try {
        await authenticatedAxios.delete(`/be/admin/delete_brew/${brewId}`);
        setBrews(prevBrews => prevBrews.filter(brew => brew._id !== brewId));
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cerveza "${brewName}" eliminada exitosamente.`,
          life: 3000
        });
      } catch (error) {
        console.error('Error deleting brew:', error.response ? error.response.data : error.message);
        let errorMessage = 'Error al eliminar la cerveza. Intenta de nuevo.';
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        });
      }
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="p-d-flex p-jc-end p-gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-text p-button-sm"
          tooltip="Actualizar"
          onClick={() => handleUpdateBrew(rowData._id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text p-button-sm"
          tooltip="Eliminar"
          onClick={() => handleDeleteBrew(rowData._id, rowData.name)}
        />
      </div>
    );
  };

  const logoBodyTemplate = (rowData) => {
    return (
      <div className="p-d-flex p-ai-center p-jc-center">
        <img
          src={rowData.image || '/src/assets/img/default-brew-logo.png'}
          alt={rowData.name}
          style={{ width: '50px', borderRadius: '50%' }}
        />
      </div>
    );
  };

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
        <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando cervezas...</p>
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
            Cervezas de: {breweryName || 'Cargando...'}
          </h1>
          <Button
            label="Regresar"
            icon="pi pi-angle-left"
            className="p-button-secondary"
            onClick={() => navigate('/be/all-provider-admin')}
          />
        </div>

        {brews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#6B7280' }}>
              No se encontraron cervezas para esta cervecería.
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
              value={brews}
              responsiveLayout="scroll"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sortField="name"
              sortOrder={1}
              emptyMessage="No se encontraron cervezas."
              className="p-datatable-sm"
            >
              <Column header="Imagen" body={logoBodyTemplate} style={{ width: '80px', textAlign: 'center' }}></Column>
              <Column field="name" header="Nombre" sortable></Column>
              <Column field="style" header="Estilo" sortable></Column>
              <Column field="abv" header="ABV (%)" sortable></Column>
              <Column field="price" header="Precio ($)" sortable></Column>
              <Column field="description" header="Descripción"></Column>
              <Column header="Acciones" body={actionBodyTemplate} style={{ width: '150px', textAlign: 'center' }}></Column>
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
};