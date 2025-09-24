import axios from "axios";
import { useState, useEffect, useRef } from "react"; // <-- Importa useRef
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import logo from '/src/assets/img/logoSF.png';
const API_URL = import.meta.env.VITE_API_URL;

export const RegisterBreweryPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name_brewery: '',
    ruc: '',
    name_comercial: '',
    city: '',
    address: '',
    contact_number: '',
    opening_hours: '',
    description: '',
    logo: null,
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');
  const [validationErrors, setValidationErrors] = useState({});

  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);

  // <-- Nuevo: Crea una referencia para el componente FileUpload
  const fileUploadRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else if (width < 1024) {
        setScreenSize('desktop-small');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (openingTime && closingTime) {
      const formattedOpening = openingTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const formattedClosing = closingTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const combinedHours = `${formattedOpening} - ${formattedClosing}`;
      setFormData(prev => ({
        ...prev,
        opening_hours: combinedHours
      }));
    }
  }, [openingTime, closingTime]);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'name_brewery':
        if (value.length < 7) {
          errorMsg = 'El nombre de la cervecería debe tener al menos 7 caracteres.';
        }
        break;
      case 'ruc':
        if (!/^\d{13}$/.test(value)) {
          errorMsg = 'El RUC debe tener 13 dígitos.';
        }
        break;
      case 'name_comercial':
        if (value.length < 7) {
          errorMsg = 'La razón social debe tener al menos 7 caracteres.';
        }
        break;
      case 'contact_number':
        if (!/^\d*$/.test(value) || value.length < 7) {
          errorMsg = 'Número de contacto inválido.';
        }
        break;
      case 'opening_hours':
        if (!value || !value.includes('-')) {
          errorMsg = 'Debes seleccionar el horario de atención.';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = 'El correo electrónico no es válido.';
        }
        break;
      case 'password':
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (value.length < 6) {
          errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (!specialCharRegex.test(value)) {
          errorMsg = 'La contraseña debe contener al menos un caracter especial.';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errorMsg = 'Las contraseñas no coinciden.';
        }
        break;
      case 'logo':
        if (!value) {
          errorMsg = 'Debes subir el logo de la cervecería.';
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
      if (key === 'confirmPassword' && !formData[key]) return;
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        errors[key] = errorMsg;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const registerBrewery = async (e) => {
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
        if (key !== 'confirmPassword') {
          submitData.append(key, value);
        }
      });

      const response = await axios.post(`${API_URL}/breweries/register_brewery`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('¡Registro de cervecería exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);

    } catch (error) {
      console.error("Error al registrar cervecería:", error.response?.data);
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
        flexDirection: 'column',
        brandingPadding: '25px 20px',
        brandingMinHeight: '160px',
        formPadding: '25px 20px',
        logoHeight: '50px',
        titleFontSize: '1.4rem',
        descriptionFontSize: '0.85rem',
        formTitleFontSize: '1.3rem',
        showFeatures: false,
        borderRadius: '16px',
        containerMinHeight: 'auto',
        formColumns: 1
      },
      tablet: {
        containerMaxWidth: '700px',
        containerPadding: '16px',
        flexDirection: 'column',
        brandingPadding: '30px 25px',
        brandingMinHeight: '180px',
        formPadding: '35px 30px',
        logoHeight: '60px',
        titleFontSize: '1.6rem',
        descriptionFontSize: '0.9rem',
        formTitleFontSize: '1.5rem',
        showFeatures: false,
        borderRadius: '18px',
        containerMinHeight: 'auto',
        formColumns: 1
      },
      'desktop-small': {
        containerMaxWidth: '950px',
        containerPadding: '20px',
        flexDirection: 'row',
        brandingPadding: '40px 30px',
        brandingMinHeight: '80vh',
        containerMinHeight: '80vh',
        formPadding: '40px 35px',
        logoHeight: '80px',
        titleFontSize: '1.8rem',
        descriptionFontSize: '1rem',
        formTitleFontSize: '1.6rem',
        showFeatures: true,
        borderRadius: '20px',
        formColumns: 2
      },
      desktop: {
        containerMaxWidth: '1100px',
        containerPadding: '20px',
        flexDirection: 'row',
        brandingPadding: '50px 40px',
        brandingMinHeight: '90vh',
        containerMinHeight: '90vh',
        formPadding: '50px 45px',
        logoHeight: '100px',
        titleFontSize: '2.2rem',
        descriptionFontSize: '1.1rem',
        formTitleFontSize: '1.7rem',
        showFeatures: true,
        borderRadius: '20px',
        formColumns: 2
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
    boxSizing: 'border-box'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#374151';
    e.target.style.boxShadow = '0 0 0 3px rgba(55, 65, 81, 0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  const handleFileChange = (e) => {
    const file = e.files[0];
    if (file) {
      handleInputChange('logo', file);
    } else {
      handleInputChange('logo', null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: config.containerPadding,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: config.containerMaxWidth,
        display: 'flex',
        flexDirection: config.flexDirection,
        alignItems: 'stretch',
        gap: '0',
        background: '#FFFFFF',
        borderRadius: config.borderRadius,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        minHeight: config.containerMinHeight,
      }}>
        <div style={{
          flex: screenSize === 'mobile' || screenSize === 'tablet' ? 'none' : '1',
          width: screenSize === 'mobile' || screenSize === 'tablet' ? '100%' : '40%',
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          color: 'white',
          padding: config.brandingPadding,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: config.brandingMinHeight
        }}>
          <div>
            <img
              src={logo}
              alt="Brews Express Logo"
              style={{
                height: config.logoHeight,
                width: 'auto',
                marginBottom: screenSize === 'mobile' ? '8px' : '15px'
              }}
            />
          </div>
          <h1 style={{
            fontSize: config.titleFontSize,
            fontWeight: 'bold',
            marginBottom: screenSize === 'mobile' ? '6px' : '12px',
            textTransform: 'uppercase',
            letterSpacing: screenSize === 'mobile' ? '0.5px' : '1px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2'
          }}>
            Brews Express
          </h1>
          <p style={{
            fontSize: config.descriptionFontSize,
            color: '#D1D5DB',
            marginBottom: screenSize === 'mobile' ? '10px' : '20px',
            lineHeight: '1.6',
            maxWidth: screenSize === 'mobile' ? '200px' : '280px'
          }}>
            Únete a nuestra comunidad cervecera
          </p>
          {config.showFeatures && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '15px'
            }}>
              {[
                { icon: 'pi pi-shopping-bag', text: 'Acceso a un nuevo mercado' },
                { icon: 'pi pi-chart-line', text: 'Gestión de productos simplificada' },
                { icon: 'pi pi-truck', text: 'Control de pedidos y entregas' }
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#E5E7EB',
                  fontSize: screenSize === 'desktop-small' ? '0.8rem' : '0.85rem'
                }}>
                  <i className={feature.icon} style={{
                    fontSize: '1.1rem',
                    color: '#10B981',
                    minWidth: '18px'
                  }}></i>
                  {feature.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          flex: screenSize === 'mobile' || screenSize === 'tablet' ? 'none' : '1',
          width: screenSize === 'mobile' || screenSize === 'tablet' ? '100%' : '60%',
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
            <h2 style={{
              fontSize: config.formTitleFontSize,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '6px'
            }}>
              Registro de Cervecería
            </h2>
            <p style={{
              color: '#6B7280',
              fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem',
              margin: 0
            }}>
              Completa los datos de tu negocio para registrarte
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '16px' }}>
              <Message
                severity="error"
                text={error}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  borderRadius: '8px',
                  fontSize: screenSize === 'mobile' ? '0.8rem' : '0.85rem'
                }}
              />
            </div>
          )}

          {success && (
            <div style={{ marginBottom: '16px' }}>
              <Message
                severity="success"
                text={success}
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  color: '#166534',
                  borderRadius: '8px',
                  fontSize: screenSize === 'mobile' ? '0.8rem' : '0.85rem'
                }}
              />
            </div>
          )}

          <form onSubmit={registerBrewery}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
              gap: screenSize === 'mobile' ? '16px' : '20px',
              marginBottom: screenSize === 'mobile' ? '20px' : '24px'
            }}>
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="name_brewery"
                    value={formData.name_brewery}
                    onChange={(e) => handleInputChange('name_brewery', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={100}
                  />
                  <label htmlFor="name_brewery" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Nombre de Cervecería *</label>
                </FloatLabel>
                {validationErrors.name_brewery && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.name_brewery} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="ruc"
                    value={formData.ruc}
                    onChange={(e) => handleInputChange('ruc', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={13}
                  />
                  <label htmlFor="ruc" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>RUC *</label>
                </FloatLabel>
                {validationErrors.ruc && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.ruc} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="name_comercial"
                    value={formData.name_comercial}
                    onChange={(e) => handleInputChange('name_comercial', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={100}
                  />
                  <label htmlFor="name_comercial" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Razón Social *</label>
                </FloatLabel>
                {validationErrors.name_comercial && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.name_comercial} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={50}
                  />
                  <label htmlFor="city" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Ciudad *</label>
                </FloatLabel>
                {validationErrors.city && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.city} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={150}
                  />
                  <label htmlFor="address" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Dirección *</label>
                </FloatLabel>
                {validationErrors.address && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.address} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={(e) => handleInputChange('contact_number', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={15}
                  />
                  <label htmlFor="contact_number" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Número de Contacto *</label>
                </FloatLabel>
                {validationErrors.contact_number && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.contact_number} /></div>)}
              </div>

              <div style={{
                width: '100%',
                display: 'flex',
                gap: screenSize === 'mobile' ? '12px' : '15px'
              }}>
                <div style={{ flex: 1 }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <Calendar
                      id="openingTime"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.value)}
                      required
                      timeOnly
                      hourFormat="24"
                      showTime
                      style={inputStyle}
                    />
                    <label htmlFor="openingTime" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Hora de Apertura *</label>
                  </FloatLabel>
                </div>
                <div style={{ flex: 1 }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <Calendar
                      id="closingTime"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.value)}
                      required
                      timeOnly
                      hourFormat="24"
                      showTime
                      style={inputStyle}
                    />
                    <label htmlFor="closingTime" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Hora de Cierre *</label>
                  </FloatLabel>
                </div>
              </div>
              {validationErrors.opening_hours && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.opening_hours} /></div>)}

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
                  <label htmlFor="description" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Descripción *</label>
                </FloatLabel>
                {validationErrors.description && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.description} /></div>)}
              </div>

              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column', // <-- Ahora siempre será en columna
                alignItems: 'stretch',   // <-- Para que ocupen todo el ancho
                gap: '10px'
              }}>
                <div style={{ flex: 1 }}>
                  <FileUpload
                    id="logo"
                    name="logo"
                    ref={fileUploadRef} // <-- Nuevo: Asigna la referencia
                    mode="basic"
                    accept="image/*"
                    maxFileSize={10000000}
                    onSelect={handleFileChange}
                    chooseLabel="Subir Logo"
                    style={{ width: '100%' }}
                  />
                  <small style={{ color: '#6B7280', display: 'block', marginTop: '5px' }}>
                    Solo imágenes (max 10MB). {formData.logo && `Archivo seleccionado: ${formData.logo.name}`}
                  </small>
                  {validationErrors.logo && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.logo} /></div>)}
                </div>

                {formData.logo && (
                  <Button
                    type="button"
                    label="Limpiar"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-danger"
                    // <-- Nuevo: Llama al método `clear` y luego limpia el estado
                    onClick={() => {
                      if (fileUploadRef.current) {
                        fileUploadRef.current.clear();
                      }
                      handleInputChange('logo', null);
                    }}
                    style={{ padding: screenSize === 'mobile' ? '14px 10px' : '16px 15px' }}
                  />
                )}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="email" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Correo Electrónico *</label>
                </FloatLabel>
                {validationErrors.email && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.email} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%', display: 'block' }}>
                  <Password
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    feedback
                    toggleMask
                    style={{ width: '100%', display: 'block' }}
                    inputStyle={inputStyle}
                    onFocus={(e) => { const input = e.target.closest('.p-password').querySelector('input'); if (input) handleFocus({ target: input }); }}
                    onBlur={(e) => { const input = e.target.closest('.p-password').querySelector('input'); if (input) handleBlur({ target: input }); }}
                  />
                  <label htmlFor="password" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Contraseña *</label>
                </FloatLabel>
                {validationErrors.password && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.password} /></div>)}
              </div>

              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%', display: 'block' }}>
                  <Password
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    feedback={false}
                    toggleMask
                    style={{ width: '100%', display: 'block' }}
                    inputStyle={inputStyle}
                    onFocus={(e) => { const input = e.target.closest('.p-password').querySelector('input'); if (input) handleFocus({ target: input }); }}
                    onBlur={(e) => { const input = e.target.closest('.p-password').querySelector('input'); if (input) handleBlur({ target: input }); }}
                  />
                  <label htmlFor="confirmPassword" style={{ color: '#6B7280', fontWeight: '500', fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem' }}>Confirmar Contraseña *</label>
                </FloatLabel>
                {validationErrors.confirmPassword && (<div style={{ marginTop: '5px' }}><Message severity="error" text={validationErrors.confirmPassword} /></div>)}
              </div>
            </div>

            <Button
              type="submit"
              label={loading ? "Registrando..." : "Crear Cuenta"}
              icon={loading ? "pi pi-spinner pi-spin" : "pi pi-building"}
              loading={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                  : 'linear-gradient(135deg, #1F2937, #374151)',
                border: 'none',
                borderRadius: screenSize === 'mobile' ? '10px' : '12px',
                fontSize: screenSize === 'mobile' ? '1rem' : '1.1rem',
                fontWeight: 'bold',
                padding: screenSize === 'mobile' ? '14px' : '16px',
                boxShadow: '0 6px 20px rgba(31, 41, 55, 0.3)',
                transition: 'all 0.3s ease',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: screenSize === 'mobile' ? '20px' : '24px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(31, 41, 55, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.3)';
                }
              }}
            />
          </form>

          <div style={{
            textAlign: 'center',
            paddingTop: screenSize === 'mobile' ? '15px' : '20px',
            borderTop: '1px solid #F3F4F6'
          }}>
            <p style={{
              color: '#9CA3AF',
              fontSize: screenSize === 'mobile' ? '0.8rem' : '0.85rem',
              margin: '0 0 10px'
            }}>
              ¿Ya tienes una cuenta de proveedor?
            </p>
            <Button
              label="Iniciar Sesión"
              link
              className="p-button-text"
              onClick={() => navigate('/auth/login')}
              style={{
                color: '#374151',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#F3F4F6';
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
              © 2025 LopSigDev. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};