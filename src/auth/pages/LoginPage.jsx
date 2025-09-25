import axios from "axios";
import { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');

  // Hook para detectar tamaño de pantalla
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

    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password,
      });

      const userData = {
        id_user: response.data.id_user,
        role: response.data.role,
        email: response.data.email,
      };

      login(userData, response.data.token);

      const userRole = response.data.role;
      if (userRole === 'admin') {
        navigate('/be/home-admin', { replace: true });
      } else if (userRole === 'provider') {
        navigate('/be/home-provider', { replace: true });
      } else if (userRole === 'user') {
        navigate('/be/home', { replace: true });
      }

      console.log('Login successful', response);
      console.log(response.data.message);

    } catch (error) {
      console.error('Login failed', error);

      const errorMessage = (
        error.response &&
        error.response.data &&
        error.response.data.detail
      ) ? error.response.data.detail : 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Configuraciones responsivas
  const getResponsiveConfig = () => {
    const configs = {
      mobile: {
        containerMaxWidth: '100%',
        containerPadding: '12px',
        flexDirection: 'column',
        brandingPadding: '30px 20px',
        brandingMinHeight: '180px',
        formPadding: '25px 20px',
        logoHeight: '60px',
        titleFontSize: '1.6rem',
        descriptionFontSize: '0.9rem',
        formTitleFontSize: '1.4rem',
        showFeatures: false,
        borderRadius: '16px',
        containerMinHeight: 'auto'
      },
      tablet: {
        containerMaxWidth: '600px',
        containerPadding: '16px',
        flexDirection: 'column',
        brandingPadding: '35px 25px',
        brandingMinHeight: '200px',
        formPadding: '30px 25px',
        logoHeight: '70px',
        titleFontSize: '1.8rem',
        descriptionFontSize: '1rem',
        formTitleFontSize: '1.6rem',
        showFeatures: false,
        borderRadius: '18px',
        containerMinHeight: 'auto'
      },
      'desktop-small': {
        containerMaxWidth: '900px',
        containerPadding: '20px',
        flexDirection: 'row',
        brandingPadding: '40px 30px',
        brandingMinHeight: '500px',
        formPadding: '40px 30px',
        logoHeight: '90px',
        titleFontSize: '2rem',
        descriptionFontSize: '1.1rem',
        formTitleFontSize: '1.6rem',
        showFeatures: true,
        borderRadius: '20px',
        containerMinHeight: '500px'
      },
      desktop: {
        containerMaxWidth: '1000px',
        containerPadding: '20px',
        flexDirection: 'row',
        brandingPadding: '60px 40px',
        brandingMinHeight: '600px',
        formPadding: '60px 50px',
        logoHeight: '120px',
        titleFontSize: '2.5rem',
        descriptionFontSize: '1.2rem',
        formTitleFontSize: '1.8rem',
        showFeatures: true,
        borderRadius: '20px',
        containerMinHeight: '600px'
      }
    };
    return configs[screenSize];
  };

  const config = getResponsiveConfig();

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
        gap: screenSize === 'mobile' || screenSize === 'tablet' ? '0' : '0',
        background: '#FFFFFF',
        borderRadius: config.borderRadius,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        minHeight: config.containerMinHeight
      }}>

        {/* Panel izquierdo - Logo y Branding */}
        <div style={{
          flex: screenSize === 'mobile' || screenSize === 'tablet' ? 'none' : '1',
          width: screenSize === 'mobile' || screenSize === 'tablet' ? '100%' : '50%',
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
          <div style={{ marginBottom: screenSize === 'mobile' ? '15px' : '30px' }}>
            <img
              src="/logoSF.png"
              alt="Brews Express Logo"
              style={{
                height: config.logoHeight,
                width: 'auto',
                marginBottom: screenSize === 'mobile' ? '10px' : '20px'
              }}
            />
          </div>

          {/* Título principal */}
          <h1 style={{
            fontSize: config.titleFontSize,
            fontWeight: 'bold',
            marginBottom: screenSize === 'mobile' ? '8px' : '16px',
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
            marginBottom: screenSize === 'mobile' ? '15px' : '30px',
            lineHeight: '1.6',
            maxWidth: screenSize === 'mobile' ? '250px' : '300px'
          }}>
            Cerveza Artesanal a la puerta de tu hogar
          </p>

          {/* Características destacadas - Solo en desktop */}
          {config.showFeatures && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '20px'
            }}>
              {[
                { icon: 'pi pi-check-circle', text: 'Cervezas artesanales premium' },
                { icon: 'pi pi-truck', text: 'Entrega rápida y segura' },
                { icon: 'pi pi-shield', text: 'Calidad garantizada' }
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#E5E7EB',
                  fontSize: screenSize === 'desktop-small' ? '0.85rem' : '0.9rem'
                }}>
                  <i className={feature.icon} style={{
                    fontSize: '1.2rem',
                    color: '#10B981',
                    minWidth: '20px'
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
          width: screenSize === 'mobile' || screenSize === 'tablet' ? '100%' : '50%',
          padding: config.formPadding,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Header del formulario */}
          <div style={{
            marginBottom: screenSize === 'mobile' ? '20px' : '30px',
            textAlign: 'center'
          }}>
            <h3 style={{
              // fontSize: config.formTitleFontSize,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              Accede a tu cuenta para continuar
            </h3>

          </div>

          {/* Error Message */}
          {error && (
            <div style={{ marginBottom: '20px' }}>
              <Message
                severity="error"
                text={error}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  borderRadius: '8px',
                  fontSize: screenSize === 'mobile' ? '0.85rem' : '0.9rem'
                }}
              />
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            {/* Campo Email */}
            <div style={{
              marginBottom: screenSize === 'mobile' ? '20px' : '24px',
              width: '100%'
            }}>
              <FloatLabel style={{ width: '100%' }}>
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: screenSize === 'mobile' ? '14px' : '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: screenSize === 'mobile' ? '10px' : '12px',
                    fontSize: screenSize === 'mobile' ? '16px' : '1rem', // 16px previene zoom en iOS
                    transition: 'all 0.3s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#374151';
                    e.target.style.boxShadow = '0 0 0 3px rgba(55, 65, 81, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <label
                  htmlFor="email"
                  style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.9rem' : '1rem'
                  }}
                >
                  Correo Electrónico
                </label>
              </FloatLabel>
            </div>

            {/* Campo Password */}
            <div style={{
              marginBottom: screenSize === 'mobile' ? '20px' : '24px',
              width: '100%'
            }}>
              <FloatLabel style={{ width: '100%', display: 'block' }}>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  feedback={false}
                  toggleMask
                  style={{
                    width: '100%',
                    display: 'block'
                  }}
                  inputStyle={{
                    padding: screenSize === 'mobile' ? '14px' : '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: screenSize === 'mobile' ? '10px' : '12px',
                    fontSize: screenSize === 'mobile' ? '16px' : '1rem',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    const input = e.target.closest('.p-password').querySelector('input');
                    if (input) {
                      input.style.borderColor = '#374151';
                      input.style.boxShadow = '0 0 0 3px rgba(55, 65, 81, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    const input = e.target.closest('.p-password').querySelector('input');
                    if (input) {
                      input.style.borderColor = '#E5E7EB';
                      input.style.boxShadow = 'none';
                    }
                  }}
                />
                <label
                  htmlFor="password"
                  style={{
                    color: '#6B7280',
                    fontWeight: '500',
                    fontSize: screenSize === 'mobile' ? '0.9rem' : '1rem'
                  }}
                >
                  Contraseña
                </label>
              </FloatLabel>
            </div>

            {/* Botón de Login */}
            <Button
              type="submit"
              label={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              icon={loading ? "pi pi-spinner pi-spin" : "pi pi-sign-in"}
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

          {/* Links adicionales */}
          <div style={{
            textAlign: 'center',
            paddingTop: screenSize === 'mobile' ? '15px' : '20px',
            borderTop: '1px solid #F3F4F6'
          }}>
            <p style={{
              color: '#9CA3AF',
              fontSize: screenSize === 'mobile' ? '0.8rem' : '0.9rem',
              margin: '0 0 12px'
            }}>
              ¿No tienes una cuenta?
            </p>
            <div style={{
              display: 'flex',
              flexDirection: screenSize === 'mobile' ? 'column' : 'row',
              gap: screenSize === 'mobile' ? '8px' : '12px',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Button
                label="Crear Cuenta"
                link
                className="p-button-text"
                onClick={() => navigate('/auth/register')}
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
              {screenSize !== 'mobile' && (
                <span style={{ color: '#D1D5DB' }}>|</span>
              )}
              <Button
                label="¿Eres una cervecería?"
                link
                className="p-button-text"
                onClick={() => navigate('/auth/register_brewery')}
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
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: screenSize === 'mobile' ? '20px' : '30px'
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