import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { HeaderAdmin } from "../components/HeaderAdmin";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
const API_URL = import.meta.env.VITE_API_URL
// Función para calcular la edad
const calculateAge = (birthDateString) => {
  if (!birthDateString) return 'N/A';
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};


export const AllUsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const toast = useRef(null);

  const [nameFilter, setNameFilter] = useState('');
  const [nameLastFilter, setNameLastFilter] = useState('');
  const [dniFilter, setDniFilter] = useState('');

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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await authenticatedAxios.get("/be/admin/all_users");
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los usuarios.',
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateUser = (userId) => {
    navigate(`/be/update-profile-user-admin/${userId}`);
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${userName}? Esta acción no se puede deshacer.`);
    if (confirmDelete) {
      setDeletingUserId(userId);
      try {
        await authenticatedAxios.delete(`/be/admin/delete_user/${userId}`);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario eliminado exitosamente',
          life: 3000
        });
      } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        let errorMessage = 'Error al eliminar usuario. Inténtalo de nuevo.';
        if (error.response?.status === 403) {
          errorMessage = 'No se puede eliminar un usuario administrador';
        } else if (error.response?.status === 404) {
          errorMessage = 'Usuario no encontrado';
        }
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        });
      } finally {
        setDeletingUserId(null);
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
          onClick={() => handleUpdateUser(rowData._id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text p-button-sm"
          tooltip="Eliminar"
          disabled={deletingUserId === rowData._id || rowData.role === 'admin'}
          onClick={() => handleDeleteUser(rowData._id, `${rowData.first_name} ${rowData.last_name}`)}
        />
      </div>
    );
  };


  const NameBodyTemplate = (rowData) => {
    return `${rowData.first_name}`;
  };
  const NameLastBodyTemplate = (rowData) => {
    return `${rowData.last_name}`;
  };

  const ageBodyTemplate = (rowData) => {
    return calculateAge(rowData.birth_date);
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.first_name?.toLowerCase().includes(nameFilter.toLowerCase());
    const nameLastMatch = user.last_name?.toLowerCase().includes(nameLastFilter.toLowerCase());
    const dniMatch = (user.dni || "").toString().toLowerCase().includes(dniFilter.toLowerCase());

    // Combina las condiciones de manera independiente usando 'AND' (&&).
    // Si un filtro está vacío, se asume que la condición es true.
    const matchesName = !nameFilter || nameMatch;
    const matchesLastName = !nameLastFilter || nameLastMatch;
    const matchesDni = !dniFilter || dniMatch;

    return matchesName && matchesLastName && matchesDni;
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
        <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando usuarios...</p>
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
            Todos los Usuarios
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
              placeholder="Buscar por apellido"
              value={nameLastFilter}
              onChange={(e) => setNameLastFilter(e.target.value)}
              style={{ width: '100%' }}
            />
          </span>
          <span className="p-input-icon-left p-fluid" style={{ flex: '1' }}>
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar por CI"
              value={dniFilter}
              onChange={(e) => setDniFilter(e.target.value)}
              style={{ width: '100%' }}
            />
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#6B7280' }}>
              No hay usuarios que coincidan con la búsqueda.
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
              value={filteredUsers}
              responsiveLayout="scroll"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sortField="first_name"
              sortOrder={1}
              emptyMessage="No se encontraron usuarios."
              className="p-datatable-sm"
            // globalFilter={nameFilter || nameLastFilter || dniFilter }
            >

              <Column header="Nombre" body={NameBodyTemplate} sortable></Column>
              <Column header="Apellido" body={NameLastBodyTemplate} sortable></Column>
              <Column field="email" header="Correo" sortable></Column>
              <Column field="role" header="Rol" sortable></Column>
              <Column field="dni" header="CI" sortable></Column>
              <Column field="phone_number" header="Teléfono"></Column>
              <Column header="Edad" body={ageBodyTemplate} sortable></Column>
              <Column header="Acciones" body={actionBodyTemplate} style={{ width: '150px', textAlign: 'center' }}></Column>
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
};


