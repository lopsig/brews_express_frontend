import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ➡️ Importaciones de PrimeReact
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export const AllUsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // ➡️ Nuevos estados para los filtros
  const [nameFilter, setNameFilter] = useState('');
  const [dniFilter, setDniFilter] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const authenticatedAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
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
        console.log('Eliminando usuario con ID:', userId);
        await authenticatedAxios.delete(`/be/admin/delete_user/${userId}`);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        if (error.response?.status === 403) {
          alert('No se puede eliminar un usuario administrador');
        } else if (error.response?.status === 404) {
          alert('Usuario no encontrado');
        } else {
          alert('Error al eliminar usuario: ' + (error.response?.data?.detail || 'Error desconocido'));
        }
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(nameFilter.toLowerCase());
    const dniMatch = (user.dni || "").toString().toLowerCase().includes(dniFilter.toLowerCase());
    return nameMatch && dniMatch;
  });

  if (loading) {
    return <div className="p-text-center p-mt-5">Cargando usuarios...</div>;
  }

  return (
    <div className="p-p-4">
      <h1>Todos los Usuarios</h1>
      <Button
        label="Regresar"
        icon="pi pi-angle-left"
        className="p-button-secondary p-mb-3"
        onClick={() => navigate('/be/home-admin')}
      />
      {/* ➡️ Contenedor de las barras de búsqueda, ajustado para PrimeFlex */}
      <div className="p-grid p-jc-between p-mb-4">
        <div className="p-col-12 p-md-5">
          <span className="p-input-icon-left p-fluid">
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar por nombre o apellido"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </span>
        </div>
        <div className="p-col-12 p-md-5">
          <span className="p-input-icon-left p-fluid">
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar por CI"
              value={dniFilter}
              onChange={(e) => setDniFilter(e.target.value)}
            />
          </span>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p>No hay usuarios que coincidan con la búsqueda.</p>
      ) : (
        <div className="p-grid p-nogutter p-justify-center">
          {filteredUsers.map(user => (
            <Card
              key={user._id}
              title={`${user.first_name} ${user.last_name}`}
              subTitle={`Rol: ${user.role}`}
              className="p-col-12 p-md-6 p-lg-4 p-xl-3 p-mb-4"
              style={{ margin: '0.5rem' }}
            >
              <div className="p-d-flex p-jc-center p-mb-3">
                <Button
                  label="Actualizar"
                  icon="pi pi-pencil"
                  className="p-button-success p-button-sm p-mr-2"
                  onClick={() => handleUpdateUser(user._id)}
                />
                <Button
                  label={deletingUserId === user._id ? 'Eliminando...' : 'Eliminar'}
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => handleDeleteUser(user._id, `${user.first_name} ${user.last_name}`)}
                  disabled={deletingUserId === user._id || user.role === 'admin'}
                />
              </div>
              <div className="p-grid">
                <div className="p-col-12"><strong>ID:</strong> {user._id}</div>
                <div className="p-col-12"><strong>Correo:</strong> {user.email}</div>
                <div className="p-col-12"><strong>Teléfono:</strong> {user.phone_number || 'No especificado'}</div>
                <div className="p-col-12"><strong>Fecha de Nacimiento:</strong> {user.birth_date || 'No especificada'}</div>
                <div className="p-col-12"><strong>CI:</strong> {user.dni || 'No especificado'}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};