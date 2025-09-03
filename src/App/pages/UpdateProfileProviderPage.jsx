import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"


export const UpdateProfileProviderPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name_brewery: '',
    ruc: '',
    name_comercial: '',
    address: '',
    contact_number: '',
    description: '',
    opening_hours: ''
  })

  const [logoFile, setLogoFile] = useState(null);
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
        }
        const response = await axios.get('http://127.0.0.1:8000/breweries/brewery', config);
        setProfile(response.data.brewery);
        setFormData({
          name_brewery: response.data.brewery.name_brewery,
          ruc: response.data.brewery.ruc,
          name_comercial: response.data.brewery.name_comercial,
          address: response.data.brewery.address,
          contact_number: response.data.brewery.contact_number,
          description: response.data.brewery.description,
          opening_hours: response.data.brewery.opening_hours
        });
        
      } catch (error) {
        console.error("Error fetching provider profile:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put('http://127.0.0.1:8000/breweries/update_brewery', formData, config);
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error("Error updating provider profile:", error.response ? error.response.data : error.message);
      alert('Error al actualizar el perfil');
    }
    navigate('/be/profile-provider');
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      // alert('Por favor selecciona un archivo de logo');
      return;
    }
    const data = new FormData();
    data.append('logo', logoFile);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put('http://127.0.0.1:8000/breweries/update_brewery_logo', data, config);
      // alert('Logo actualizado con éxito');
      setProfile({ ...profile, logo: response.data.logo });
    } catch (error) {
      console.error("Error updating logo:", error.response ? error.response.data : error.message);
      alert('Error al actualizar el logo');
    }
    navigate('/be/profile-provider');
  };

  const handleTextLogoSubmit = (e) => {
    e.preventDefault();
    handleTextSubmit(e)
    handleLogoSubmit(e);
  };

  if (loading) return <div>Obteniendo Datos...</div>;
  if (!profile) return <div>No se encontró el perfil del proveedor.</div>;

  return (
    <div>
      <h1>Administrar Cuenta</h1>
      <button onClick={() => navigate(-1)} >Regresar</button>
      <button onClick={() => navigate('/be/home-provider')}>Home</button>

      <form onSubmit={handleTextSubmit}>
        <div>
          <label>Nombre de la Cervecería:</label>
          <input type="text" name="name_brewery" value={formData.name_brewery} onChange={handleTextChange} required />
        </div>
        <div>
          <label>RUC:</label>
          <input type="text" name="ruc" value={formData.ruc} onChange={handleTextChange} required />
        </div>
        <div>
          <label>Razón Social:</label>
          <input type="text" name="name_comercial" value={formData.name_comercial} onChange={handleTextChange} required />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" name="address" value={formData.address} onChange={handleTextChange} required />
        </div>
        <div>
          <label>Teléfono de Contacto:</label>
          <input type="text" name="contact_number" value={formData.contact_number} onChange={handleTextChange} required />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="description" value={formData.description} onChange={handleTextChange} required />
        </div>
        <div>
          <label>Horario de Atención:</label>
          <input type="text" name="opening_hours" value={formData.opening_hours} onChange={handleTextChange} required />
        </div>
        {/* <button type="submit">Actualizar Datos</button> */}
      </form>

      <hr />

      <form onSubmit={handleLogoSubmit}>
        <div>
          <div>
          <h2>Logo Actual</h2>
            {profile.logo && <img src={profile.logo} alt="Logo actual" style={{ width: '150px' }} />}
          </div>
          <div>
          <label>Cambiar Logo:</label>
          <input type="file" onChange={handleLogoChange} required />
        </div>
          {/* <button type="submit">Actualizar Logo</button> */}

          <button onClick={handleTextLogoSubmit}>Actualizar</button>
        </div>
      </form>
    </div>
  )
}
