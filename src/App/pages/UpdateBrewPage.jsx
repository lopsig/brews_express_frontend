// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useNavigate, useParams } from "react-router-dom"

// export const UpdateBrewPage = () => {
//   const navigate = useNavigate()
//   const {brewId} = useParams()
//   const [brew, setBrew] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     style: '',
//     abv: '',
//     srm: '',
//     ibu: '',
//     ml: '',
//     price: '',
//     description: '',
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchBrew = async () => {
//       if (!token || !brewId) {
//         console.error('No token or brewId found');
//         return
//       }
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//         const response = await axios.get(API_URL+`/brews/${brewId}`, config)
//         setBrew(response.data.brew)
//         setFormData({
//           name: response.data.brew.name,
//           style: response.data.brew.style,
//           abv: response.data.brew.abv,
//           srm: response.data.brew.srm,
//           ibu: response.data.brew.ibu,
//           ml: response.data.brew.ml,
//           price: response.data.brew.price,
//           description: response.data.brew.description,
//         })
//       } catch (error) {
//         console.error('Error fetching brew:', error.response ? error.response.data : error.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchBrew()
//   }, [token, brewId])

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
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//       await axios.put(API_URL+`/brews/update_brew/${brewId}`, formData, config);
//       alert('Producto actualizado con éxito')
//     } catch (error) {
//       console.error('Error updating brew:', error.response ? error.response.data : error.message)
//       alert('Error al actualizar la cerveza.')
//     }
//     navigate('/be/home-provider');
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleImageSubmit = async (e) => {
//     e.preventDefault();
//     if (!imageFile) {
//       return;
//     }
//     const data = new FormData();
//     data.append('image', imageFile);

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//       const response = await axios.put(API_URL+`/brews/update_brew_image/${brewId}`, data, config);
//       // alert('Imagen actualizada con éxito');
//     } catch (error) {
//       console.error('Error updating brew image:', error.response ? error.response.data : error.message);
//       alert('Error al actualizar la imagen de la cerveza.');
//     }
//     navigate('/be/home-provider');
//   };

//   const handleTextImageSubmit = (e) => {
//     e.preventDefault();
//     handleTextSubmit(e)
//     handleImageSubmit(e);
//   };

//   if (loading) { return <div>Cargando...</div>; }
//   if (!brew) { return <div>No se encontró la cerveza.</div>; }

//   return (
//     <div>
//       <h1>Actualizar Cerveza</h1>
//       <button onClick={() => navigate(-1)} >Regresar</button>
//       <button onClick={() => navigate('/be/home-provider')}>Home</button>

//       <form onSubmit={handleTextSubmit}>
//         <div>
//           <label>
//             Nombre:
//             <input type="text" name="name" value={formData.name} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             Estilo:
//             <input type="text" name="style" value={formData.style} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             ABV:
//             <input type="text" name="abv" value={formData.abv} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             SRM:
//             <input type="text" name="srm" value={formData.srm} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             IBU:
//             <input type="text" name="ibu" value={formData.ibu} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             ML:
//             <input type="text" name="ml" value={formData.ml} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             Precio:
//             <input type="text" name="price" value={formData.price} onChange={handleTextChange} />
//           </label>
//         </div>
//         <div>
//           <label>
//             Descripción:
//             <textarea name="description" value={formData.description} onChange={handleTextChange} />
//           </label>
//         </div>
//       </form>

//       <hr />

//       <form onSubmit={handleImageSubmit}>
//         <div>
//           <div>
//             <h2>Imagen Actual</h2>
//             {brew.image && <img src={brew.image} alt="Imagen de la cerveza" />}
//           </div>
//           <div>
//           <label>Seleccion Nueva Imagen:</label>
//             <input type="file"  onChange={handleImageChange} />
//           </div>
//         <button onClick={handleTextImageSubmit}>Actualizar</button>
//         </div>
//       </form>


//     </div>
//   )
// }


import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
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

export const UpdateBrewPage = () => {
  const navigate = useNavigate();
  const { brewId } = useParams();
  const [brew, setBrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    abv: '',
    srm: '',
    ibu: '',
    ml: '',
    price: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [updateStatus, setUpdateStatus] = useState({ message: '', severity: '' });
  const fileUploadRef = useRef(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setScreenSize('mobile');
      else if (width < 768) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBrew = async () => {
      if (!token || !brewId) {
        setUpdateStatus({ message: 'No se ha iniciado sesión o no se encontró el ID.', severity: 'error' });
        setTimeout(() => navigate('/be/login-provider'), 2000);
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(API_URL + `/brews/${brewId}`, config);
        const fetchedBrew = response.data.brew;
        setBrew(fetchedBrew);
        setFormData({
          name: fetchedBrew.name,
          style: fetchedBrew.style,
          abv: fetchedBrew.abv,
          srm: fetchedBrew.srm,
          ibu: fetchedBrew.ibu,
          ml: fetchedBrew.ml,
          price: fetchedBrew.price,
          description: fetchedBrew.description,
        });
      } catch (error) {
        console.error('Error fetching brew:', error.response?.data || error.message);
        setUpdateStatus({ message: 'Error al cargar los datos. Por favor, intenta de nuevo.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBrew();
  }, [token, brewId, navigate]);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateStatus({ message: '', severity: '' });

    try {
      // Actualizar datos de texto
      const textConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      await axios.put(API_URL + `/brews/update_brew/${brewId}`, formData, textConfig);

      // Si hay una imagen nueva, subirla
      if (imageFile) {
        const imageData = new FormData();
        imageData.append('image', imageFile);
        const imageConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };
        await axios.put(API_URL + `/brews/update_brew_image/${brewId}`, imageData, imageConfig);
      }

      setUpdateStatus({ message: 'Cerveza actualizada con éxito.', severity: 'success' });
      setTimeout(() => {
        navigate('/be/home-provider');
      }, 2000);
    } catch (error) {
      console.error('Error updating brew:', error.response?.data || error.message);
      setUpdateStatus({ message: 'Error al actualizar la cerveza.', severity: 'error' });
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
        imageSize: '150px'
      },
      tablet: {
        cardWidth: '600px',
        cardPadding: '2rem',
        formColumns: 2,
        imageSize: '200px'
      },
      desktop: {
        cardWidth: '750px',
        cardPadding: '3rem',
        formColumns: 2,
        imageSize: '250px'
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
        <Skeleton width={config.imageSize} height={config.imageSize} className="mb-4" style={{ backgroundColor: '#4B5563' }} />
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
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="3rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="8rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
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
        Actualizar Cerveza
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
          <form onSubmit={handleUpdate}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: '#D1D5DB', marginBottom: '1rem' }}>Imagen Actual</p>
              <Image
                src={brew?.image || '/default-brew-image.png'}
                alt="Imagen de la cerveza"
                width={config.imageSize}
                preview
                style={{
                  borderRadius: '8px',
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
                id="image-upload"
                name="image"
                ref={fileUploadRef}
                mode="basic"
                accept="image/*"
                maxFileSize={10000000}
                onSelect={handleImageChange}
                chooseLabel="Cambiar Imagen"
                style={{
                  width: '100%',
                  backgroundColor: '#4B5563',
                  color: '#F9FAFB',
                  borderRadius: '12px',
                  borderColor: '#4B5563'
                }}
              />
              {imageFile && (
                <small style={{ color: '#D1D5DB' }}>
                  Archivo seleccionado: {imageFile.name}
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
                  <InputText id="name" name="name" value={formData.name} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="name" style={floatLabelStyle}>Nombre</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText id="style" name="style" value={formData.style} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="style" style={floatLabelStyle}>Estilo</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText id="abv" name="abv" value={formData.abv} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="abv" style={floatLabelStyle}>ABV</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText id="srm" name="srm" value={formData.srm} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="srm" style={floatLabelStyle}>SRM</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText id="ibu" name="ibu" value={formData.ibu} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="ibu" style={floatLabelStyle}>IBU</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText id="ml" name="ml" value={formData.ml} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="ml" style={floatLabelStyle}>ML</label>
                </FloatLabel>
              </div>
              <div className="field">
                <FloatLabel style={{ width: '100%' }}>
                  <InputText id="price" name="price" value={formData.price} onChange={handleTextChange} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="price" style={floatLabelStyle}>Precio</label>
                </FloatLabel>
              </div>
              <div className="field col-12">
                <FloatLabel style={{ width: '100%' }}>
                  <InputTextarea id="description" name="description" value={formData.description} onChange={handleTextChange} required rows={4} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  <label htmlFor="description" style={floatLabelStyle}>Descripción</label>
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
                label={loading ? "Actualizando..." : "Actualizar Cerveza"}
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