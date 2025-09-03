import { useState, useEffect, use } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"


export const ProfileProviderPage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get('http://127.0.0.1:8000/breweries/brewery', config);
        setProfile(response.data.brewery);
        console.log("Profile:", response.data.brewery)
      } catch (error) {
        console.error("Error fetching provider profile:", error.response ? error.response.data : error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, []);

  if (loading) {
    return <div>Obteniendo Datos...</div>
  }

  if (!profile) {
    return <div>No se encontró el perfil del proveedor.</div>
  }

  return (
    <div>
      <h1>Mi Cuenta</h1>
      <button onClick={() => navigate('/be/update-profile-provider')}>Actualizar Datos</button>
      <button onClick={() => navigate('/be/home-provider')}>Home</button>
      <h2>{profile.name_brewery}</h2>
      <p>RUC: {profile.ruc}</p>
      <p>Razon Social: {profile.name_comercial}</p>
      <p>Direccion: {profile.address}</p>
      <p>Telefono: {profile.contact_number}</p>
      <p>Descripción: {profile.description}</p>
      <p>Horario de Atención: {profile.opening_hours}</p>
      <img src={profile.logo} alt="" />
    </div>

  )
}
