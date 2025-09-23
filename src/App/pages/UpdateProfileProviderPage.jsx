// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom"


// export const UpdateProfileProviderPage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name_brewery: '',
//     ruc: '',
//     name_comercial: '',
//     address: '',
//     contact_number: '',
//     description: '',
//     opening_hours: ''
//   })

//   const [logoFile, setLogoFile] = useState(null);
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
//         }
//         const response = await axios.get(API_URL+'/breweries/brewery', config);
//         setProfile(response.data.brewery);
//         setFormData({
//           name_brewery: response.data.brewery.name_brewery,
//           ruc: response.data.brewery.ruc,
//           name_comercial: response.data.brewery.name_comercial,
//           address: response.data.brewery.address,
//           contact_number: response.data.brewery.contact_number,
//           description: response.data.brewery.description,
//           opening_hours: response.data.brewery.opening_hours
//         });

//       } catch (error) {
//         console.error("Error fetching provider profile:", error.response ? error.response.data : error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProfile();
//   }, [token]);

//   const handleTextChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   }

//   const handleTextSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       };
//       await axios.put(API_URL+'/breweries/update_brewery', formData, config);
//       alert('Perfil actualizado con éxito');
//     } catch (error) {
//       console.error("Error updating provider profile:", error.response ? error.response.data : error.message);
//       alert('Error al actualizar el perfil');
//     }
//     navigate('/be/profile-provider');
//   };

//   const handleLogoChange = (e) => {
//     setLogoFile(e.target.files[0]);
//   };

//   const handleLogoSubmit = async (e) => {
//     e.preventDefault();
//     if (!logoFile) {
//       // alert('Por favor selecciona un archivo de logo');
//       return;
//     }
//     const data = new FormData();
//     data.append('logo', logoFile);
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         }
//       };
//       const response = await axios.put(API_URL+'/breweries/update_brewery_logo', data, config);
//       // alert('Logo actualizado con éxito');
//       setProfile({ ...profile, logo: response.data.logo });
//     } catch (error) {
//       console.error("Error updating logo:", error.response ? error.response.data : error.message);
//       alert('Error al actualizar el logo');
//     }
//     navigate('/be/profile-provider');
//   };

//   const handleTextLogoSubmit = (e) => {
//     e.preventDefault();
//     handleTextSubmit(e)
//     handleLogoSubmit(e);
//   };

//   if (loading) return <div>Obteniendo Datos...</div>;
//   if (!profile) return <div>No se encontró el perfil del proveedor.</div>;

//   return (
//     <div>
//       <h1>Administrar Cuenta</h1>
//       <button onClick={() => navigate(-1)} >Regresar</button>
//       <button onClick={() => navigate('/be/home-provider')}>Home</button>

//       <form onSubmit={handleTextSubmit}>
//         <div>
//           <label>Nombre de la Cervecería:</label>
//           <input type="text" name="name_brewery" value={formData.name_brewery} onChange={handleTextChange} required />
//         </div>
//         <div>
//           <label>RUC:</label>
//           <input type="text" name="ruc" value={formData.ruc} onChange={handleTextChange} required />
//         </div>
//         <div>
//           <label>Razón Social:</label>
//           <input type="text" name="name_comercial" value={formData.name_comercial} onChange={handleTextChange} required />
//         </div>
//         <div>
//           <label>Dirección:</label>
//           <input type="text" name="address" value={formData.address} onChange={handleTextChange} required />
//         </div>
//         <div>
//           <label>Teléfono de Contacto:</label>
//           <input type="text" name="contact_number" value={formData.contact_number} onChange={handleTextChange} required />
//         </div>
//         <div>
//           <label>Descripción:</label>
//           <textarea name="description" value={formData.description} onChange={handleTextChange} required />
//         </div>
//         <div>
//           <label>Horario de Atención:</label>
//           <input type="text" name="opening_hours" value={formData.opening_hours} onChange={handleTextChange} required />
//         </div>

//       </form>

//       <hr />

//       <form onSubmit={handleLogoSubmit}>
//         <div>
//           <div>
//           <h2>Logo Actual</h2>
//             {profile.logo && <img src={profile.logo} alt="Logo actual" style={{ width: '150px' }} />}
//           </div>
//           <div>
//           <label>Cambiar Logo:</label>
//           <input type="file" onChange={handleLogoChange} required />
//         </div>

//           <button onClick={handleTextLogoSubmit}>Actualizar</button>
//         </div>
//       </form>
//     </div>
//   )
// }








import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
const API_URL = import.meta.env.VITE_API_URL
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
  });
  const [logoFile, setLogoFile] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [updateStatus, setUpdateStatus] = useState({ message: '', severity: '' });
  const fileUploadRef = useRef(null);
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
        setTimeout(() => navigate('/be/login-provider'), 2000);
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get(API_URL + '/breweries/brewery', config);
        const fetchedProfile = response.data.brewery;
        setProfile(fetchedProfile);
        setFormData({
          name_brewery: fetchedProfile.name_brewery,
          ruc: fetchedProfile.ruc,
          name_comercial: fetchedProfile.name_comercial,
          address: fetchedProfile.address,
          contact_number: fetchedProfile.contact_number,
          description: fetchedProfile.description,
          opening_hours: fetchedProfile.opening_hours
        });
      } catch (error) {
        console.error("Error fetching provider profile:", error.response?.data || error.message);
        setUpdateStatus({ message: 'Error al cargar el perfil. Por favor, intenta de nuevo.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateStatus({ message: '', severity: '' });

    try {
      // Actualizar datos de texto
      const textConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(API_URL + '/breweries/update_brewery', formData, textConfig);

      // Si hay un logo nuevo, subirlo
      if (logoFile) {
        const logoData = new FormData();
        logoData.append('logo', logoFile);
        const logoConfig = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        };
        const logoResponse = await axios.put(API_URL + '/breweries/update_brewery_logo', logoData, logoConfig);
        setProfile({ ...profile, logo: logoResponse.data.logo });
      }

      setUpdateStatus({ message: 'Perfil actualizado con éxito.', severity: 'success' });
      setTimeout(() => {
        navigate('/be/profile-provider');
      }, 2000);

    } catch (error) {
      console.error("Error al actualizar el perfil:", error.response?.data || error.message);
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
        imageSize: '100px',
        titleFontSize: '1.5rem',
        labelFontSize: '0.9rem'
      },
      tablet: {
        cardWidth: '600px',
        cardPadding: '2rem',
        formColumns: 1,
        imageSize: '120px',
        titleFontSize: '1.7rem',
        labelFontSize: '1rem'
      },
      desktop: {
        cardWidth: '750px',
        cardPadding: '3rem',
        formColumns: 2,
        imageSize: '150px',
        titleFontSize: '2rem',
        labelFontSize: '1.1rem'
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
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Skeleton shape="circle" size={config.imageSize} className="mb-4" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="10rem" height="2rem" className="mb-2" style={{ backgroundColor: '#4B5563' }} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
        gap: '20px'
      }}>
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="8rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
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
        Administrar Perfil
      </h1>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: "#c4c8ceff",
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
          <form onSubmit={handleUpdate}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: '#D1D5DB', marginBottom: '1rem', fontSize: config.labelFontSize }}>
                Logo Actual
              </p>
              <Image
                src={profile?.logo || '/default-brewery-logo.png'}
                alt="Logo actual"
                width={config.imageSize}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #4A5568'
                }}
              />
            </div>

            <div style={{
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FileUpload
                id="logo-upload"
                name="logo"
                ref={fileUploadRef}
                mode="basic"
                accept="image/*"
                maxFileSize={10000000}
                onSelect={handleLogoChange}
                chooseLabel="Cambiar Logo"
                style={{
                  width: '100%',
                  backgroundColor: '#4B5563',
                  color: '#F9FAFB',
                  borderRadius: '12px',
                  borderColor: '#4B5563'
                }}
              />
              {logoFile && (
                <small style={{ color: '#D1D5DB' }}>
                  Archivo seleccionado: {logoFile.name}
                </small>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
              gap: '20px',
              marginBottom: '2rem'
            }}>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="name_brewery"
                    name="name_brewery"
                    value={formData.name_brewery}
                    onChange={handleTextChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="name_brewery" style={floatLabelStyle}>Nombre de Cervecería</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="ruc"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleTextChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="ruc" style={floatLabelStyle}>RUC</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="name_comercial"
                    name="name_comercial"
                    value={formData.name_comercial}
                    onChange={handleTextChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="name_comercial" style={floatLabelStyle}>Razón Social</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleTextChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="address" style={floatLabelStyle}>Dirección</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="contact_number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleTextChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="contact_number" style={floatLabelStyle}>Teléfono de Contacto</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleTextChange}
                    required
                    rows={4}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="description" style={floatLabelStyle}>Descripción</label>
                </FloatLabel>
              </div>
              <div className="field col-12">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="opening_hours"
                    name="opening_hours"
                    value={formData.opening_hours}
                    onChange={handleTextChange}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="opening_hours" style={floatLabelStyle}>Horario de Atención</label>
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