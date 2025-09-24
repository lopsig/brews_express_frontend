import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import logo from '/src/assets/img/logoSF.png'; 
const API_URL = import.meta.env.VITE_API_URL;

export const CreateBrewPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    style: '',
    abv: '',
    srm: '',
    ibu: '',
    ml: '',
    price: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');
  const [validationErrors, setValidationErrors] = useState({});

  const fileUploadRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop'); // Simplificado a tres tamaños ya que no hay banding lateral para 'desktop-small'
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'name':
      case 'style':
        if (value.length < 3) {
          errorMsg = 'Debe tener al menos 3 caracteres.';
        }
        break;
      case 'abv':
      case 'srm':
      case 'ibu':
      case 'price':
        if (isNaN(value) || value <= 0) {
          errorMsg = 'Debe ser un valor numérico positivo.';
        }
        break;
      case 'ml':
        if (isNaN(value) || !Number.isInteger(Number(value)) || value <= 0) {
          errorMsg = 'Debe ser un número entero positivo.';
        }
        break;
      case 'description':
        if (value.length < 10) {
          errorMsg = 'La descripción debe tener al menos 10 caracteres.';
        }
        break;
      case 'image':
        if (!value) {
          errorMsg = 'Debes subir una imagen de la cerveza.';
        }
        break;
      default:
        if (!value) {
          errorMsg = 'Este campo es requerido.';
        }
        break;
    }
    return errorMsg;
  };

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    const errorMsg = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        errors[key] = errorMsg;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createBrew = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      const id_user = sessionStorage.getItem('id_user');
      submitData.append('id_user', id_user);

      const response = await axios.post(`${API_URL}/brews/create_brew`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('¡Cerveza registrada exitosamente! Redirigiendo...');
      setTimeout(() => {
        navigate("/be/home-provider");
      }, 2000);

    } catch (error) {
      console.error("Error al crear la cerveza:", error.response?.data);
      const errorMessage = error.response?.data?.detail || 'Error en el registro. Por favor, intenta nuevamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getResponsiveConfig = () => {
    const configs = {
      mobile: {
        containerMaxWidth: '100%',
        containerPadding: '12px',
        formPadding: '25px 20px',
        logoHeight: '50px',
        titleFontSize: '1.4rem',
        descriptionFontSize: '0.85rem',
        formTitleFontSize: '1.3rem',
        borderRadius: '16px',
        containerMinHeight: 'auto',
        formColumns: 1
      },
      tablet: {
        containerMaxWidth: '700px',
        containerPadding: '16px',
        formPadding: '35px 30px',
        logoHeight: '60px',
        titleFontSize: '1.6rem',
        descriptionFontSize: '0.9rem',
        formTitleFontSize: '1.5rem',
        borderRadius: '18px',
        containerMinHeight: 'auto',
        formColumns: 1
      },
      desktop: {
        containerMaxWidth: '700px', // Limitar el ancho en desktop también
        containerPadding: '20px',
        formPadding: '50px 45px',
        logoHeight: '70px', // Un poco más pequeño ya que no hay banding lateral
        titleFontSize: '2.0rem',
        descriptionFontSize: '1.0rem',
        formTitleFontSize: '1.7rem',
        borderRadius: '20px',
        containerMinHeight: 'auto', // Ya no es necesario un minHeight fijo si solo es un formulario
        formColumns: 2 // Mantener dos columnas si el ancho lo permite
      }
    };
    return configs[screenSize];
  };

  const config = getResponsiveConfig();

  const inputStyle = {
    padding: screenSize === 'mobile' ? '14px' : '16px',
    border: '2px solid #E5E7EB',
    borderRadius: screenSize === 'mobile' ? '10px' : '12px',
    fontSize: screenSize === 'mobile' ? '16px' : '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    background: '#374151', // Fondo oscuro para inputs
    color: '#FFFFFF' // Texto blanco para inputs
  };

  const floatLabelStyle = {
    color: '#D1D5DB', // Color más claro para las etiquetas flotantes
    fontWeight: '500',
    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
  };

  const messageStyle = {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#166534',
    borderRadius: '8px',
    fontSize: screenSize === 'mobile' ? '0.8rem' : '0.85rem'
  }

  const errorMessageStyle = {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#991B1B',
    borderRadius: '8px',
    fontSize: screenSize === 'mobile' ? '0.8rem' : '0.85rem'
  }

  const handleFocus = (e) => {
    e.target.style.borderColor = '#6EE7B7'; // Color de enfoque claro para fondo oscuro
    e.target.style.boxShadow = '0 0 0 3px rgba(110, 231, 183, 0.2)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#4B5563'; // Un gris más oscuro para el borde en estado normal
    e.target.style.boxShadow = 'none';
  };

  const handleFileChange = (e) => {
    const file = e.files[0];
    if (file) {
      handleInputChange('image', file);
    } else {
      handleInputChange('image', null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: "#c4c8ceff",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: config.containerPadding,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#F9FAFB' 
    }}>
      <div style={{
        width: '100%',
        maxWidth: config.containerMaxWidth,
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'stretch',
        background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)', 
        borderRadius: config.borderRadius,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        minHeight: config.containerMinHeight,
      }}>
        <div style={{
          padding: config.formPadding,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto'
        }}>
          <div style={{
            marginBottom: screenSize === 'mobile' ? '20px' : '25px',
            textAlign: 'center'
          }}>
            <img
              src={logo}
              alt="Brews Express Logo"
              style={{
                height: config.logoHeight,
                width: 'auto',
                marginBottom: screenSize === 'mobile' ? '8px' : '15px'
              }}
            />
            <h2 style={{
              fontSize: config.formTitleFontSize,
              fontWeight: 'bold',
              color: '#F9FAFB', // Título blanco
              marginBottom: '6px'
            }}>
              Registrar Cerveza
            </h2>
            <p style={{
              color: '#D1D5DB', // Texto de descripción más claro
              fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem',
              margin: 0
            }}>
              Añade una nueva cerveza a tu catálogo
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '16px' }}>
              <Message
                severity="error"
                text={error}
                style={errorMessageStyle}
              />
            </div>
          )}

          {success && (
            <div style={{ marginBottom: '16px' }}>
              <Message
                severity="success"
                text={success}
                style={messageStyle}
              />
            </div>
          )}

          <form onSubmit={createBrew}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
              gap: screenSize === 'mobile' ? '16px' : '20px',
              marginBottom: screenSize === 'mobile' ? '20px' : '24px'
            }}>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={100}
                  />
                  <label htmlFor="name" style={floatLabelStyle}>Nombre de Cerveza *</label>
                </FloatLabel>
                {validationErrors.name && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.name} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="style"
                    value={formData.style}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={100}
                  />
                  <label htmlFor="style" style={floatLabelStyle}>Estilo *</label>
                </FloatLabel>
                {validationErrors.style && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.style} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="abv"
                    type="number"
                    step="0.1"
                    value={formData.abv}
                    onChange={(e) => handleInputChange('abv', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="abv" style={floatLabelStyle}>ABV (%) *</label>
                </FloatLabel>
                {validationErrors.abv && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.abv} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="srm"
                    type="number"
                    step="0.1"
                    value={formData.srm}
                    onChange={(e) => handleInputChange('srm', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="srm" style={floatLabelStyle}>SRM *</label>
                </FloatLabel>
                {validationErrors.srm && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.srm} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="ibu"
                    type="number"
                    step="0.1"
                    value={formData.ibu}
                    onChange={(e) => handleInputChange('ibu', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="ibu" style={floatLabelStyle}>IBU *</label>
                </FloatLabel>
                {validationErrors.ibu && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.ibu} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="ml"
                    type="number"
                    value={formData.ml}
                    onChange={(e) => handleInputChange('ml', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="ml" style={floatLabelStyle}>ml *</label>
                </FloatLabel>
                {validationErrors.ml && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.ml} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="price" style={floatLabelStyle}>Precio *</label>
                </FloatLabel>
                {validationErrors.price && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.price} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputTextarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={500}
                  />
                  <label htmlFor="description" style={floatLabelStyle}>Descripción *</label>
                </FloatLabel>
                {validationErrors.description && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.description} style={errorMessageStyle} /></div>)}
              </div>

              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '10px'
              }}>
                <div style={{ flex: 1 }}>
                  <FileUpload
                    id="image"
                    name="image"
                    ref={fileUploadRef}
                    mode="basic"
                    accept="image/*"
                    maxFileSize={10000000}
                    onSelect={handleFileChange}
                    chooseLabel="Subir Imagen"
                    uploadLabel=" " // Oculta el botón de "upload" predeterminado
                    cancelLabel=" " // Oculta el botón de "cancel" predeterminado
                    style={{
                      width: '100%',
                      backgroundColor: '#4B5563', // Fondo del botón de file upload más oscuro
                      color: '#F9FAFB', // Texto del botón de file upload blanco
                      borderRadius: screenSize === 'mobile' ? '10px' : '12px',
                      borderColor: '#4B5563'
                    }}
                    buttonProps={{
                      style: {
                        backgroundColor: '#4B5563', // Asegurar que los botones internos también sean oscuros
                        color: '#F9FAFB',
                        borderColor: '#4B5563'
                      }
                    }}
                  />
                  <small style={{ color: '#D1D5DB', display: 'block', marginTop: '5px' }}>
                    Solo imágenes (max 10MB). {formData.image && `Archivo seleccionado: ${formData.image.name}`}
                  </small>
                  {validationErrors.image && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.image} style={errorMessageStyle} /></div>)}
                </div>

                {formData.image && (
                  <Button
                    type="button"
                    label="Limpiar"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-danger"
                    onClick={() => {
                      if (fileUploadRef.current) {
                        fileUploadRef.current.clear();
                      }
                      handleInputChange('image', null);
                    }}
                    style={{
                      padding: screenSize === 'mobile' ? '14px 10px' : '16px 15px',
                      backgroundColor: 'transparent', // Botón limpiar transparente
                      borderColor: '#EF4444', // Borde rojo para "danger"
                      color: '#EF4444' // Texto rojo
                    }}
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              label={loading ? "Registrando..." : "Crear Cerveza"}
              icon={loading ? "pi pi-spinner pi-spin" : "pi pi-beer"}
              loading={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                  : 'linear-gradient(135deg, #10B981, #059669)', // Un verde más vibrante para el botón de acción
                border: 'none',
                borderRadius: screenSize === 'mobile' ? '10px' : '12px',
                fontSize: screenSize === 'mobile' ? '1rem' : '1.1rem',
                fontWeight: 'bold',
                padding: screenSize === 'mobile' ? '14px' : '16px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)', // Sombra verde
                transition: 'all 0.3s ease',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: screenSize === 'mobile' ? '20px' : '24px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }
              }}
            />
          </form>

          <div style={{
            textAlign: 'center',
            paddingTop: screenSize === 'mobile' ? '15px' : '20px',
            borderTop: '1px solid #4B5563' // Borde más oscuro
          }}>
            <Button
              label="Volver al inicio"
              link
              className="p-button-text"
              onClick={() => navigate('/be/home-provider')}
              style={{
                color: '#D1D5DB', // Color más claro para el texto del botón
                fontWeight: '600',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#4B5563'; // Fondo más oscuro al pasar el ratón
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            />
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: screenSize === 'mobile' ? '15px' : '20px'
          }}>
            <p style={{
              color: '#9CA3AF',
              fontSize: screenSize === 'mobile' ? '0.7rem' : '0.75rem',
              margin: 0
            }}>
              © 2025 LopSig Dev. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


