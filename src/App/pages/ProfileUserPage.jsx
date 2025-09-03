import { useState, useEffect, use } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"


export const ProfileUserPage = () => {
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
        const response = await axios.get('http://127.0.0.1:8000/be/my_profile', config);
        setProfile(response.data.user);
        console.log("Profile:", response.data.user)
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
      <button onClick={() => navigate('/be/update-profile-user')}>Actualizar Datos</button>
      <button onClick={() => navigate('/be/home')}>Home</button>
      <p>Nombre: {profile.first_name}</p>
      <p>Apellido: {profile.last_name}</p>
      <p>Contacto: {profile.phone_number}</p>
      {/* <p>CI: {profile.dni}</p> */}
      <p>Fecha de Nacimiento: {profile.birth_date}</p>

      <img src={profile.logo} alt="" />
    </div>

  )
}
