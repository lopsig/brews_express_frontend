import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export const UpdateProfileUserPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    birth_date: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('http://127.0.0.1:8000/be/my_profile', config);
        setProfile(response.data.user);
        setFormData({
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          phone_number: response.data.user.phone_number,
          birth_date: response.data.user.birth_date,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      };
      await axios.put('http://127.0.0.1:8000/be/update_user_profile', formData, config);
      alert("Perfil actualizado con éxito");
      navigate('/be/profile-user');
    } catch (error) {
      console.error("Error updating user profile:", error.response ? error.response.data : error.message);
      alert('Error al actualizar el perfil')
    }
  };

  if (loading) {
    return <div>Obteniendo Datos...</div>;
  }

  if (!profile) {
    return <div>No se encontró el perfil del proveedor.</div>;
  }

  return (
    <div>
      <h1>Actualizar Perfil</h1>
      <button onClick={() => navigate(-1)} >Regresar</button>
      <button onClick={() => navigate('/be/home')}>Home</button>


      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text"  name="first_name" value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  )
}
