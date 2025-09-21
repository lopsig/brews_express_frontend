// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export const RegisterPage = () => {
//   const navigate = useNavigate();
//   const registerUser = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     const first_name = e.target.first_name.value;
//     const last_name = e.target.last_name.value;
//     const phone_number = e.target.phone_number.value;
//     const dni = e.target.dni.value;
//     const birth_date = e.target.birth_date.value;
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     formData.append('first_name', first_name)
//     formData.append('last_name', last_name)
//     formData.append('phone_number',phone_number)
//     formData.append('dni', dni)
//     formData.append('birth_date', birth_date)
//     formData.append('email', email)
//     formData.append('password', password)

//     const dataUser = Object.fromEntries(formData.entries());

//     const response = await axios.post('http://localhost:8000/auth/register', dataUser)
//     console.log(response.data.message);
//     navigate("/auth/login")
//     console.log(dataUser);
//   }
  

//   return (
//     <div>
//       <h1>Registrate</h1>
//       <form onSubmit={(e) => registerUser(e)} >
//         <div>
//           <label>Nombre </label>
//           <input type="text" name="first_name" placeholder="Nombre" required/>
//         </div>
//         <div>
//           <label>Apellido </label>
//           <input type="text" name="last_name" placeholder="Apellido" required />
//         </div>
//         <div>
//           <label>Celular </label>
//           <input type="number" name="phone_number" placeholder="Celular" required/>
//         </div>
//         <div>
//           <label>C.I </label>
//           <input type="number" name="dni" placeholder="Cédula de Identidad" required/>
//         </div>
//         <div>
//           <label>Fecha de Nacimiento </label>
//           <input type="date" name="birth_date" required/>
//         </div>
//         <div>
//           <label>Correo </label>
//           <input type="email" name="email" placeholder="Correo" required/>
//         </div>
//         <div>
//           <label>Contraseña </label>
//           <input type="password" name="password" placeholder="Contraseña" required/>
//         </div>
//         <div>
//           <label>Confirmar Contraseña </label>
//           <input type="password" placeholder="Contraseña" required/>
//         </div>

//         <button type="submit">Registrate</button>

//       </form>
//     </div>
//   )
// }



import axios from "axios";
import { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    dni: '',
    birth_date: null,
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');

  // ✅ Nuevo estado para los errores de validación por campo
  const [validationErrors, setValidationErrors] = useState({});

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

  // ✅ Lógica de validación por campo
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'first_name':
        if (value.length < 3) {
          errorMsg = 'El nombre debe tener al menos 3 caracteres.';
        }
        break;
      case 'last_name':
        if (value.length < 3) {
          errorMsg = 'El apellido debe tener al menos 3 caracteres.';
        }
        break;
      case 'phone_number':
        if (!/^\d*$/.test(value)) {
          errorMsg = 'Solo se permiten números.';
        }
        if (value.length < 10) {
          errorMsg = 'Telefono debe tener 10 digitos.'
        }
        break;
      case 'dni':
        if (!/^\d*$/.test(value)) {
          errorMsg = 'Solo se permiten números.';
        }
        if (value.length < 10) {
          errorMsg = 'CI debe tener 10 digitos.'
        }
        break;
      case 'birth_date':
        if (value) {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            errorMsg = 'Debes ser mayor de 18 años para registrarte.';
          }
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
      default:
        break;
    }
    return errorMsg;
  };

  // ✅ Actualiza el estado del formulario y valida el campo en tiempo real
  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Validación en tiempo real
    const errorMsg = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));
    setError(''); // Limpia el error general al empezar a escribir
  };

  // ✅ Función de validación completa para el formulario
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

  const registerUser = async (e) => {
    e.preventDefault();

    // ✅ Validar todo el formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') {
          if (key === 'birth_date' && value) {
            submitData.append(key, value.toISOString().split('T')[0]);
          } else if (value) {
            submitData.append(key, value);
          }
        }
      });

      const dataUser = Object.fromEntries(submitData.entries());
      const response = await axios.post('http://localhost:8000/auth/register', dataUser);

      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      console.log(response.data.message);

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);

    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.detail || 'Error en el registro. Por favor, intenta nuevamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ... (el resto del código de configuraciones y estilos no cambia) ...

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
        formColumns: 2
      },
      'desktop-small': {
        containerMaxWidth: '950px',
        containerPadding: '20px',
        flexDirection: 'row',
        brandingPadding: '40px 30px',
        brandingMinHeight: '700px',
        formPadding: '40px 35px',
        logoHeight: '80px',
        titleFontSize: '1.8rem',
        descriptionFontSize: '1rem',
        formTitleFontSize: '1.6rem',
        showFeatures: true,
        borderRadius: '20px',
        containerMinHeight: '700px',
        formColumns: 2
      },
      desktop: {
        containerMaxWidth: '1100px',
        containerPadding: '20px',
        flexDirection: 'row',
        brandingPadding: '50px 40px',
        brandingMinHeight: '800px',
        formPadding: '50px 45px',
        logoHeight: '100px',
        titleFontSize: '2.2rem',
        descriptionFontSize: '1.1rem',
        formTitleFontSize: '1.7rem',
        showFeatures: true,
        borderRadius: '20px',
        containerMinHeight: '800px',
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
      {/* Contenedor principal responsivo */}
      <div style={{
        width: '100%',
        maxWidth: config.containerMaxWidth,
        display: 'flex',
        flexDirection: config.flexDirection,
        alignItems: screenSize === 'mobile' || screenSize === 'tablet' ? 'stretch' : 'center',
        gap: '0',
        background: '#FFFFFF',
        borderRadius: config.borderRadius,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        minHeight: config.containerMinHeight,
      }}>

        {/* Panel izquierdo - Logo y Branding */}
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
          {/* Logo */}
          <div style={{ marginBottom: screenSize === 'mobile' ? '15px' : '25px' }}>
            <img
              src="/src/assets/img/logoSF.png"
              alt="Brews Express Logo"
              style={{
                height: config.logoHeight,
                width: 'auto',
                marginBottom: screenSize === 'mobile' ? '8px' : '15px'
              }}
            />
          </div>

          {/* Título principal */}
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

          {/* Descripción */}
          <p style={{
            fontSize: config.descriptionFontSize,
            color: '#D1D5DB',
            marginBottom: screenSize === 'mobile' ? '10px' : '20px',
            lineHeight: '1.6',
            maxWidth: screenSize === 'mobile' ? '200px' : '280px'
          }}>
            Únete a nuestra comunidad cervecera
          </p>

          {/* Características destacadas - Solo en desktop */}
          {config.showFeatures && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '15px'
            }}>
              {[
                { icon: 'pi pi-users', text: 'Comunidad cervecera exclusiva' },
                { icon: 'pi pi-gift', text: 'Ofertas y promociones especiales' },
                { icon: 'pi pi-star', text: 'Acceso a cervezas limitadas' }
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

        {/* Panel derecho - Formulario */}
        <div style={{
          flex: screenSize === 'mobile' || screenSize === 'tablet' ? 'none' : '1',
          width: screenSize === 'mobile' || screenSize === 'tablet' ? '100%' : '60%',
          padding: config.formPadding,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto'
        }}>
          {/* Header del formulario */}
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
              Crear Cuenta
            </h2>
            <p style={{
              color: '#6B7280',
              fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem',
              margin: 0
            }}>
              Completa tus datos para registrarte
            </p>
          </div>

          {/* Messages */}
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

          {/* Formulario */}
          <form onSubmit={registerUser}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: config.formColumns === 2 ? '1fr 1fr' : '1fr',
              gap: screenSize === 'mobile' ? '16px' : '20px',
              marginBottom: screenSize === 'mobile' ? '20px' : '24px'
            }}>
              {/* Nombre */}
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={50}
                  />
                  <label htmlFor="first_name" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Nombre *
                  </label>
                </FloatLabel>
                {validationErrors.first_name && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.first_name} />
                  </div>
                )}
              </div>

              {/* Apellido */}
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={50}
                  />
                  <label htmlFor="last_name" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Apellido *
                  </label>
                </FloatLabel>
                {validationErrors.last_name && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.last_name} />
                  </div>
                )}
              </div>

              {/* Email */}
              <div style={{
                width: '100%',
                gridColumn: config.formColumns === 2 ? 'span 2' : 'span 1'
              }}>
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
                  <label htmlFor="email" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Correo Electrónico *
                  </label>
                </FloatLabel>
              </div>

              {/* Teléfono */}
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="phone_number" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Teléfono *
                  </label>
                </FloatLabel>
                {validationErrors.phone_number && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.phone_number} />
                  </div>
                )}
              </div>

              {/* DNI */}
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%' }}>
                  <InputText
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => handleInputChange('dni', e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="dni" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Cédula de Identidad *
                  </label>
                </FloatLabel>
                {validationErrors.dni && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.dni} />
                  </div>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div style={{
                width: '100%',
                gridColumn: config.formColumns === 2 ? 'span 2' : 'span 1'
              }}>
                <FloatLabel style={{ width: '100%' }}>
                  <Calendar
                    id="birth_date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    required
                    style={{
                      width: '100%'
                    }}
                    inputStyle={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="birth_date" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Fecha de Nacimiento *
                  </label>
                </FloatLabel>
                {validationErrors.birth_date && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.birth_date} />
                  </div>
                )}
              </div>

              {/* Contraseña */}
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%', display: 'block' }}>
                  <Password
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    feedback
                    toggleMask
                    style={{
                      width: '100%',
                      display: 'block'
                    }}
                    inputStyle={inputStyle}
                    onFocus={(e) => {
                      const input = e.target.closest('.p-password').querySelector('input');
                      if (input) handleFocus({ target: input });
                    }}
                    onBlur={(e) => {
                      const input = e.target.closest('.p-password').querySelector('input');
                      if (input) handleBlur({ target: input });
                    }}
                  />
                  <label htmlFor="password" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Contraseña *
                  </label>
                </FloatLabel>
                {validationErrors.password && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.password} />
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div style={{ width: '100%' }}>
                <FloatLabel style={{ width: '100%', display: 'block' }}>
                  <Password
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    feedback={false}
                    toggleMask
                    style={{
                      width: '100%',
                      display: 'block'
                    }}
                    inputStyle={inputStyle}
                    onFocus={(e) => {
                      const input = e.target.closest('.p-password').querySelector('input');
                      if (input) handleFocus({ target: input });
                    }}
                    onBlur={(e) => {
                      const input = e.target.closest('.p-password').querySelector('input');
                      if (input) handleBlur({ target: input });
                    }}
                  />
                  <label htmlFor="confirmPassword" style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                  }}>
                    Confirmar Contraseña *
                  </label>
                </FloatLabel>
                {validationErrors.confirmPassword && (
                  <div style={{ marginTop: '5px' }}>
                    <Message severity="error" text={validationErrors.confirmPassword} />
                  </div>
                )}
              </div>
            </div>

            {/* Botón de Registro */}
            <Button
              type="submit"
              label={loading ? "Registrando..." : "Crear Cuenta"}
              icon={loading ? "pi pi-spinner pi-spin" : "pi pi-user-plus"}
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
          {/* Links adicionales y Footer... (el resto del código no cambia) */}
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
              ¿Ya tienes una cuenta?
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

          {/* Footer */}
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