// import React, {useState, useEffect} from 'react'
// import axios from 'axios'
// import { useNavigate } from "react-router-dom"

// export const UpdateProfileUserPage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     phone_number: '',
//     birth_date: '',
//   });

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) {
//         console.error('No token found');
//         return;
//       }
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         };
//         const response = await axios.get('http://127.0.0.1:8000/be/my_profile', config);
//         setProfile(response.data.user);
//         setFormData({
//           first_name: response.data.user.first_name,
//           last_name: response.data.user.last_name,
//           phone_number: response.data.user.phone_number,
//           birth_date: response.data.user.birth_date,
//         });
//       } catch (error) {
//         console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No token found');
//       return;
//     }
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       };
//       await axios.put('http://127.0.0.1:8000/be/update_user_profile', formData, config);
//       alert("Perfil actualizado con éxito");
//       navigate('/be/profile-user');
//     } catch (error) {
//       console.error("Error updating user profile:", error.response ? error.response.data : error.message);
//       alert('Error al actualizar el perfil')
//     }
//   };

//   if (loading) {
//     return <div>Obteniendo Datos...</div>;
//   }

//   if (!profile) {
//     return <div>No se encontró el perfil del proveedor.</div>;
//   }

//   return (
//     <div>
//       <h1>Actualizar Perfil</h1>
//       <button onClick={() => navigate(-1)} >Regresar</button>
//       <button onClick={() => navigate('/be/home')}>Home</button>


//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Nombre:</label>
//           <input type="text"  name="first_name" value={formData.first_name}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Apellido:</label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Teléfono:</label>
//           <input
//             type="text"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Fecha de Nacimiento:</label>
//           <input
//             type="date"
//             name="birth_date"
//             value={formData.birth_date}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit">Actualizar</button>
//       </form>
//     </div>
//   )
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import { Skeleton } from 'primereact/skeleton';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

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
  const [screenSize, setScreenSize] = useState('desktop');
  const [updateStatus, setUpdateStatus] = useState({ message: '', severity: '' });
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUpdateStatus({ message: 'No se ha iniciado sesión. Redirigiendo...', severity: 'error' });
        setTimeout(() => navigate('/be/login'), 2000);
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://127.0.0.1:8000/be/my_profile', config);
        const fetchedProfile = response.data.user;
        setProfile(fetchedProfile);
        setFormData({
          first_name: fetchedProfile.first_name,
          last_name: fetchedProfile.last_name,
          phone_number: fetchedProfile.phone_number,
          birth_date: fetchedProfile.birth_date,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        setUpdateStatus({ message: 'Error al cargar el perfil. Por favor, intenta de nuevo.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateStatus({ message: '', severity: '' });
    if (!token) {
      setUpdateStatus({ message: 'No se ha iniciado sesión.', severity: 'error' });
      setLoading(false);
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
      setUpdateStatus({ message: "Perfil actualizado con éxito.", severity: 'success' });
      setTimeout(() => {
        navigate('/be/profile-user');
      }, 2000);
    } catch (error) {
      console.error("Error updating user profile:", error.response?.data || error.message);
      setUpdateStatus({ message: 'Error al actualizar el perfil.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getResponsiveConfig = () => {
    const configs = {
      mobile: {
        cardWidth: '100%',
        cardPadding: '1.5rem',
        formColumns: 1,
        titleFontSize: '1.5rem'
      },
      tablet: {
        cardWidth: '600px',
        cardPadding: '2rem',
        formColumns: 1,
        titleFontSize: '1.7rem'
      },
      desktop: {
        cardWidth: '750px',
        cardPadding: '3rem',
        formColumns: 2,
        titleFontSize: '2rem'
      }
    };
    return configs[screenSize];
  };

  const config = getResponsiveConfig();

  const inputStyle = {
    padding: screenSize === 'mobile' ? '14px' : '16px',
    border: '2px solid #4B5563',
    borderRadius: screenSize === 'mobile' ? '10px' : '12px',
    fontSize: screenSize === 'mobile' ? '16px' : '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    background: '#374151',
    color: '#FFFFFF'
  };

  const floatLabelStyle = {
    color: '#D1D5DB',
    fontWeight: '500',
    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#6EE7B7';
    e.target.style.boxShadow = '0 0 0 3px rgba(110, 231, 183, 0.2)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#4B5563';
    e.target.style.boxShadow = 'none';
  };

  const renderFormSkeleton = () => (
    <div className="p-fluid">
      <div style={{
        display: 'grid',
        gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
        gap: '20px',
        marginBottom: '2rem'
      }}>
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
      </div>
    </div>
  );

  const header = (
    <div style={{ borderBottom: '1px solid #4A5568', paddingBottom: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#F9FAFB',
        margin: 0
      }}>
        Actualizar Perfil
      </h1>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Card
        header={header}
        style={{
          width: config.cardWidth,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: '20px',
          padding: config.cardPadding,
          background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
          color: '#F9FAFB'
        }}
      >
        {updateStatus.message && (
          <Message
            severity={updateStatus.severity}
            text={updateStatus.message}
            className="w-full mb-4"
          />
        )}

        {loading ? renderFormSkeleton() : (
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
              gap: '20px',
              marginBottom: '2rem'
            }}>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="first_name" style={floatLabelStyle}>Nombre</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="last_name" style={floatLabelStyle}>Apellido</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="phone_number" style={floatLabelStyle}>Teléfono de Contacto</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="birth_date" style={floatLabelStyle}>Fecha de Nacimiento</label>
                </FloatLabel>
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: screenSize === 'mobile' ? 'column' : 'row',
              gap: '15px'
            }}>
              <Button
                type="submit"
                label={loading ? "Actualizando..." : "Actualizar Perfil"}
                icon={loading ? "pi pi-spinner pi-spin" : "pi pi-check"}
                className="p-button-primary"
                loading={loading}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  padding: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              />
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => navigate(-1)}
                className="p-button-secondary p-button-outlined"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontWeight: 'bold',
                  color: '#D1D5DB',
                  borderColor: '#4A5568',
                  background: 'transparent'
                }}
              />
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};



