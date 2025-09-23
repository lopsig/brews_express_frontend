// import { useState, useEffect, use } from 'react'
// import axios from 'axios'
// import { useNavigate } from "react-router-dom"


// export const ProfileUserPage = () => {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         console.error('No token found')
//         return
//       }
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//         const response = await axios.get(API_URL+'/be/my_profile', config);
//         setProfile(response.data.user);
//         console.log("Profile:", response.data.user)
//       } catch (error) {
//         console.error("Error fetching provider profile:", error.response ? error.response.data : error.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchProfile()
//   }, []);

//   if (loading) {
//     return <div>Obteniendo Datos...</div>
//   }

//   if (!profile) {
//     return <div>No se encontró el perfil del proveedor.</div>
//   }

//   return (
//     <div>
//       <h1>Mi Cuenta</h1>
//       <button onClick={() => navigate('/be/update-profile-user')}>Actualizar Datos</button>
//       <button onClick={() => navigate('/be/home')}>Home</button>
//       <p>Nombre: {profile.first_name}</p>
//       <p>Apellido: {profile.last_name}</p>
//       <p>Contacto: {profile.phone_number}</p>
//       {/* <p>CI: {profile.dni}</p> */}
//       <p>Fecha de Nacimiento: {profile.birth_date}</p>

//       <img src={profile.logo} alt="" />
//     </div>

//   )
// }





import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import { Message } from 'primereact/message';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
const API_URL = import.meta.env.VITE_API_URL
export const ProfileUserPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');
  const navigate = useNavigate();

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
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('No se ha iniciado sesión. Redirigiendo...');
        setTimeout(() => navigate('/be/login'), 2000);
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(API_URL + '/be/my_profile', config);
        setProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
        setError('Error al cargar el perfil. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const getResponsiveConfig = () => {
    const configs = {
      mobile: {
        cardWidth: '100%',
        cardPadding: '1.5rem',
        buttonsFlexDirection: 'column',
        buttonGap: '10px',
        imageSize: '100px',
        titleFontSize: '1.5rem',
        labelFontSize: '0.9rem',
        valueFontSize: '0.9rem'
      },
      tablet: {
        cardWidth: '600px',
        cardPadding: '2rem',
        buttonsFlexDirection: 'row',
        buttonGap: '15px',
        imageSize: '120px',
        titleFontSize: '1.7rem',
        labelFontSize: '1rem',
        valueFontSize: '1rem'
      },
      desktop: {
        cardWidth: '750px',
        cardPadding: '3rem',
        buttonsFlexDirection: 'row',
        buttonGap: '20px',
        imageSize: '150px',
        titleFontSize: '2rem',
        labelFontSize: '1.1rem',
        valueFontSize: '1.1rem'
      }
    };
    return configs[screenSize];
  };

  const config = getResponsiveConfig();

  const renderProfileData = () => (
    <div className="p-fluid">
      <div className="flex flex-column align-items-center mb-5">
        {/* <Image
          src={profile.logo || '/default-user-logo.png'}
          alt="Logo del Usuario"
          width={config.imageSize}
          preview
          className="mb-4"
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #4A5568'
          }}
        /> */}
        <h2 style={{
          fontSize: config.titleFontSize,
          color: '#F9FAFB',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          {profile.first_name} {profile.last_name}
        </h2>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize === 'desktop' ? '1fr 1fr' : '1fr',
        gap: '20px 30px'
      }}>
        <div className="field">
          <p style={{
            color: '#D1D5DB',
            fontWeight: '500',
            fontSize: config.labelFontSize,
            marginBottom: '0.25rem'
          }}>
            Nombre Completo:
          </p>
          <p style={{
            color: '#F9FAFB',
            fontSize: config.valueFontSize,
            fontWeight: 'bold',
            margin: 0
          }}>
            {profile.first_name} {profile.last_name}
          </p>
        </div>
        <div className="field">
          <p style={{
            color: '#D1D5DB',
            fontWeight: '500',
            fontSize: config.labelFontSize,
            marginBottom: '0.25rem'
          }}>
            Contacto:
          </p>
          <p style={{
            color: '#F9FAFB',
            fontSize: config.valueFontSize,
            fontWeight: 'bold',
            margin: 0
          }}>
            {profile.phone_number}
          </p>
        </div>
        <div className="field">
          <p style={{
            color: '#D1D5DB',
            fontWeight: '500',
            fontSize: config.labelFontSize,
            marginBottom: '0.25rem'
          }}>
            Fecha de Nacimiento:
          </p>
          <p style={{
            color: '#F9FAFB',
            fontSize: config.valueFontSize,
            fontWeight: 'bold',
            margin: 0
          }}>
            {profile.birth_date}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="p-fluid flex flex-column align-items-center">
      <Skeleton shape="circle" size={config.imageSize} className="mb-4" style={{ backgroundColor: '#4B5563' }} />
      <Skeleton width="10rem" height="2rem" className="mb-2" style={{ backgroundColor: '#4B5563' }} />
      <div style={{ width: '100%' }}>
        <Skeleton width="100%" height="1.5rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="1.5rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
        <Skeleton width="100%" height="1.5rem" className="mb-3" style={{ backgroundColor: '#4B5563' }} />
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
        Mi Perfil
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
        {error && <Message severity="error" text={error} className="w-full mb-4" style={{ background: '#FEF2F2', color: '#991B1B' }} />}
        {loading ? renderSkeleton() : renderProfileData()}

        <div style={{
          marginTop: '2.5rem',
          display: 'flex',
          flexDirection: config.buttonsFlexDirection,
          gap: config.buttonGap
        }}>
          <Button
            label="Actualizar Perfil"
            icon="pi pi-user-edit"
            className="p-button-primary"
            onClick={() => navigate('/be/update-profile-user')}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              padding: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              color: '#FFFFFF'
            }}
          />
          <Button
            label="Volver al Home"
            icon="pi pi-home"
            className="p-button-secondary p-button-outlined"
            onClick={() => navigate('/be/home')}
            style={{
              padding: '1rem',
              fontWeight: 'bold',
              color: '#D1D5DB',
              borderColor: '#4A5568',
              background: 'transparent'
            }}
          />
        </div>
      </Card>
    </div>
  );
};
