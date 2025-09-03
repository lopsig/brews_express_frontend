import axios from "axios"
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"


export const UpdateProfileUserAdmin = () => {
  const navigate = useNavigate()
  const { userId } = useParams() // Obtener el ID del usuario de la URL
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    // email: '',
    phone_number: '',
    birth_date: '',
    // dni: '',
    // role: ''
  })

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  const authenticatedAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authenticatedAxios.get(`/be/admin/user/${userId}`)
        const userData = response.data.user
        setUser(userData)
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          // email: userData.email || '',
          phone_number: userData.phone_number || '',
          birth_date: userData.birth_date || '',
          // dni: userData.dni || '',
          // role: userData.role || ''
        })
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message)
        alert('Error al cargar los datos del usuario')
        navigate('/be/all-users-admin')
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Debug: Verificar el userId
      console.log('Intentando actualizar usuario con ID:', userId)

      // Filtrar campos vacíos antes de enviar
      const updateData = {}
      Object.keys(formData).forEach(key => {
        const value = formData[key]

        // Verificar que el valor existe y no esté vacío
        if (value !== null && value !== undefined && value !== '') {
          // Si es string, aplicar trim, si no, usar el valor tal como está
          if (typeof value === 'string') {
            const trimmedValue = value.trim()
            if (trimmedValue !== '') {
              updateData[key] = trimmedValue
            }
          } else {
            // Para números, fechas, etc.
            updateData[key] = value
          }
        }
      })

      if (Object.keys(updateData).length === 0) {
        alert('No hay cambios para actualizar')
        setLoading(false)
        return
      }

      console.log('Datos a actualizar:', updateData)

      const response = await authenticatedAxios.put(`/be/admin/update_user/${userId}`, updateData)
      alert('Usuario actualizado exitosamente')
      navigate('/be/all-users-admin')
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message)
      console.error('User ID que causó el error:', userId)

      if (error.response?.status === 404) {
        alert('El usuario no existe o fue eliminado. Regresando a la lista.')
        navigate('/be/all-users-admin')
      } else {
        alert('Error al actualizar usuario: ' + (error.response?.data?.detail || 'Error desconocido'))
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Actualizar Usuario</h1>
      <h2>Editando: {user.first_name} {user.last_name}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="first_name"><strong>Nombre:</strong></label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="last_name"><strong>Apellido:</strong></label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* <div>
          <label htmlFor="email"><strong>Correo:</strong></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div> */}

        <div>
          <label htmlFor="phone_number"><strong>Teléfono:</strong></label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="birth_date"><strong>Fecha de Nacimiento:</strong></label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* <div>
          <label htmlFor="dni"><strong>CI:</strong></label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div> */}

        {/* <div>
          <label htmlFor="role"><strong>Rol:</strong></label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Seleccionar rol</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div> */}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/be/all-users-admin')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
