// import axios from "axios";
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from "react-router-dom";
// import { Card } from 'primereact/card';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
// import { ProgressSpinner } from 'primereact/progressspinner';
// import { Message } from 'primereact/message';
// import { InputMask } from 'primereact/inputmask';
// import { Calendar } from 'primereact/calendar';
// import { HeaderAdmin } from "../components/HeaderAdmin";
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primeicons/primeicons.css';
// import 'primereact/resources/primereact.min.css';

// const getAuthToken = () => {
//   return localStorage.getItem('token') || sessionStorage.getItem('token');
// };

// const authenticatedAxios = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Authorization': `Bearer ${getAuthToken()}`
//   }
// });

// export const UpdateProfileUserAdmin = () => {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const toast = useRef(null);

//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone_number: '',
//     birth_date: null,
//     dni: '',
//   });

//   const [validationErrors, setValidationErrors] = useState({});

//   useEffect(() => {
//     const fetchUser = async () => {
//       setFormLoading(true);
//       try {
//         const response = await authenticatedAxios.get(`/be/admin/user/${userId}`);
//         const userData = response.data.user;
//         const formattedDate = userData.birth_date ? new Date(userData.birth_date + 'T00:00:00') : null;

//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || '',
//           phone_number: userData.phone_number || '',
//           birth_date: formattedDate,
//           dni: userData.dni || '',
//         });
//       } catch (error) {
//         console.error('Error fetching user:', error.response ? error.response.data : error.message);
//         toast.current.show({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Error al cargar los datos del usuario',
//           life: 3000
//         });
//         navigate('/be/all-users-admin');
//       } finally {
//         setFormLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUser();
//     }
//   }, [userId, navigate]);

//   const handleInputChange = (e, name) => {
//     const value = e.target ? e.target.value : e.value;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   // Función de validación mejorada para recibir el estado más reciente
//   const validateForm = (dataToValidate) => {
//     const errors = {};
//     if (!dataToValidate.first_name.trim()) errors.first_name = 'El nombre es requerido.';
//     if (!dataToValidate.last_name.trim()) errors.last_name = 'El apellido es requerido.';
//     if (!dataToValidate.email.trim()) {
//       errors.email = 'El correo es requerido.';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataToValidate.email)) {
//       errors.email = 'Formato de correo inválido.';
//     }

//     const phoneNumber = String(dataToValidate.phone_number || '').replace(/\D/g, '');
//     if (!phoneNumber.trim()) {
//       errors.phone_number = 'El teléfono es requerido.';
//     } else if (phoneNumber.length !== 10) {
//       errors.phone_number = 'Número de teléfono inválido.';
//     }

//     const dni = String(dataToValidate.dni || '').replace(/\D/g, '');
//     if (!dni.trim()) {
//       errors.dni = 'El CI es requerido.';
//     } else if (dni.length !== 10) {
//       errors.dni = 'Número de CI inválido.';
//     }

//     // Validación para la fecha de nacimiento
//     if (dataToValidate.birth_date && !(dataToValidate.birth_date instanceof Date)) {
//       errors.birth_date = 'Fecha de nacimiento inválida.';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();


//     const dataToSubmit = { ...formData };

//     if (!validateForm(dataToSubmit)) {
//       toast.current.show({ severity: 'error', summary: 'Error de validación', detail: 'Por favor, corrige los campos con errores.', life: 3000 });
//       return;
//     }

//     // Paso clave: Crear un objeto con solo los datos que han cambiado.
//     const updateData = {};
//     const originalUserData = {
//       first_name: user.first_name || '',
//       last_name: user.last_name || '',
//       email: user.email || '',
//       phone_number: user.phone_number || '',
//       dni: user.dni || '',
//       birth_date: user.birth_date ? new Date(user.birth_date + 'T00:00:00') : null,
//     };

//     // Comparar cada campo para encontrar las diferencias
//     Object.keys(dataToSubmit).forEach(key => {
//       const value = dataToSubmit[key];
//       const originalValue = originalUserData[key];

//       // Normalizar los valores antes de la comparación para evitar falsos positivos
//       const isString = typeof value === 'string' && typeof originalValue === 'string';
//       const isDate = value instanceof Date && originalValue instanceof Date;

//       if (isString && value.trim() !== originalValue.trim()) {
//         updateData[key] = value.trim();
//       } else if (isDate && value.getTime() !== originalValue.getTime()) {
//         updateData[key] = value.toISOString().split('T')[0];
//       } else if (value !== originalValue && !isString && !isDate) {
//         updateData[key] = value;
//       }
//     });

//     // Si no hay datos para actualizar, redirigir y mostrar un mensaje
//     if (Object.keys(updateData).length === 0) {
//       toast.current.show({ severity: 'info', summary: 'Sin cambios', detail: 'No hay datos para actualizar.', life: 3000 });
//       setTimeout(() => {
//         navigate('/be/all-users-admin');
//       }, 1000);
//       return;
//     }

//     setLoading(true);
//     try {
//       const updateData = {};
//       Object.keys(dataToSubmit).forEach(key => {
//         const value = dataToSubmit[key];
//         if (value !== null && value !== undefined && value !== '') {
//           if (key === 'birth_date' && value instanceof Date) {
//             updateData[key] = value.toISOString().split('T')[0];
//           } else if (typeof value === 'string' && value.trim() !== '') {
//             updateData[key] = value.trim();
//           }
//         }
//       });

//       if (Object.keys(updateData).length === 0) {
//         toast.current.show({ severity: 'info', summary: 'Sin cambios', detail: 'No hay datos para actualizar.', life: 3000 });
//         setLoading(false);
//         return;
//       }

//       const response = await authenticatedAxios.put(`/be/admin/update_user/${userId}`, updateData);
//       toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado exitosamente.', life: 3000 });
//       setTimeout(() => {
//         navigate('/be/all-users-admin');
//       }, 1000);
//     } catch (error) {
//       console.error('Error updating user:', error.response ? error.response.data : error.message);
//       const detail = error.response?.data?.detail || 'Error desconocido';
//       if (error.response?.status === 404) {
//         toast.current.show({ severity: 'error', summary: 'Error', detail: 'El usuario no existe o fue eliminado.', life: 3000 });
//         setTimeout(() => {
//           navigate('/be/all-users-admin');
//         }, 1000);
//       } else {
//         toast.current.show({ severity: 'error', summary: 'Error al actualizar', detail: detail, life: 5000 });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (formLoading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         flexDirection: 'column'
//       }}>
//         <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".8s" />
//         <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando datos del usuario...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>No se pudo cargar el usuario.</div>;
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #E5E7EB 100%)',
//       display: 'flex',
//       flexDirection: 'column',
//     }}>
//       <HeaderAdmin />
//       <Toast ref={toast} />

//       <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
//         <Card
//           title={`Editar: ${user.first_name} ${user.last_name}`}
//           style={{
//             width: '100%',
//             maxWidth: '600px',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//             padding: '1rem',
//           }}
//         >
//           <form onSubmit={handleSubmit}>
//             <div className="p-fluid p-formgrid p-grid">
//               <div className="p-field p-col-12 p-md-6">
//                 <label htmlFor="first_name">Nombre</label>
//                 <InputText
//                   id="first_name"
//                   name="first_name"
//                   value={formData.first_name}
//                   onChange={(e) => handleInputChange(e, 'first_name')}
//                   className={validationErrors.first_name ? 'p-invalid' : ''}
//                 />
//                 {validationErrors.first_name && <Message severity="error" text={validationErrors.first_name} />}
//               </div>
//               <div className="p-field p-col-12 p-md-6">
//                 <label htmlFor="last_name">Apellido</label>
//                 <InputText
//                   id="last_name"
//                   name="last_name"
//                   value={formData.last_name}
//                   onChange={(e) => handleInputChange(e, 'last_name')}
//                   className={validationErrors.last_name ? 'p-invalid' : ''}
//                 />
//                 {validationErrors.last_name && <Message severity="error" text={validationErrors.last_name} />}
//               </div>
//               <div className="p-field p-col-12">
//                 <label htmlFor="email">Correo</label>
//                 <InputText
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange(e, 'email')}
//                   className={validationErrors.email ? 'p-invalid' : ''}
//                 />
//                 {validationErrors.email && <Message severity="error" text={validationErrors.email} />}
//               </div>
//               <div className="p-field p-col-12">
//                 <label htmlFor="phone_number">Teléfono</label>
//                 <InputMask
//                   id="phone_number"
//                   name="phone_number"
//                   mask="999-999-9999"
//                   value={formData.phone_number}
//                   onChange={(e) => handleInputChange(e, 'phone_number')}
//                   className={validationErrors.phone_number ? 'p-invalid' : ''}
//                 />
//                 {validationErrors.phone_number && <Message severity="error" text={validationErrors.phone_number} />}
//               </div>
//               <div className="p-field p-col-12">
//                 <label htmlFor="birth_date">Fecha de Nacimiento</label>
//                 <Calendar
//                   id="birth_date"
//                   name="birth_date"
//                   value={formData.birth_date}
//                   onChange={(e) => handleInputChange(e, 'birth_date')}
//                   showIcon
//                   readOnlyInput
//                   dateFormat="yy-mm-dd"
//                   className={validationErrors.birth_date ? 'p-invalid' : ''}
//                 />
//                 {validationErrors.birth_date && <Message severity="error" text={validationErrors.birth_date} />}
//               </div>
//               <div className="p-field p-col-12">
//                 <label htmlFor="dni">CI</label>
//                 <InputMask
//                   id="dni"
//                   name="dni"
//                   mask="9999999999"
//                   value={formData.dni}
//                   onChange={(e) => handleInputChange(e, 'dni')}
//                   className={validationErrors.dni ? 'p-invalid' : ''}
//                 />
//                 {validationErrors.dni && <Message severity="error" text={validationErrors.dni} />}
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//               <Button
//                 type="submit"
//                 label={loading ? 'Actualizando...' : 'Actualizar Usuario'}
//                 icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
//                 className="p-button-success"
//                 disabled={loading || formLoading}
//                 style={{ flex: 1 }}
//               />
//               <Button
//                 type="button"
//                 label="Cancelar"
//                 icon="pi pi-times"
//                 className="p-button-secondary"
//                 onClick={() => navigate('/be/all-users-admin')}
//                 style={{ flex: 1 }}
//               />
//             </div>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// };



import axios from "axios";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { HeaderAdmin } from "../components/HeaderAdmin";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
const API_URL = import.meta.env.VITE_API_URL
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const authenticatedAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
});

export const UpdateProfileUserAdmin = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birth_date: null,
    dni: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      setFormLoading(true);
      try {
        const response = await authenticatedAxios.get(`/be/admin/user/${userId}`);
        const userData = response.data.user;
        const formattedDate = userData.birth_date ? new Date(userData.birth_date + 'T00:00:00') : null;

        setUser(userData);
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          birth_date: formattedDate,
          dni: userData.dni || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos del usuario',
          life: 3000
        });
        navigate('/be/all-users-admin');
      } finally {
        setFormLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, navigate]);

  const handleInputChange = (e, name) => {
    const value = e.target ? e.target.value : e.value;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = (dataToValidate) => {
    const errors = {};
    if (!dataToValidate.first_name.trim()) errors.first_name = 'El nombre es requerido.';
    if (!dataToValidate.last_name.trim()) errors.last_name = 'El apellido es requerido.';
    if (!dataToValidate.email.trim()) {
      errors.email = 'El correo es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataToValidate.email)) {
      errors.email = 'Formato de correo inválido.';
    }

    const phoneNumber = String(dataToValidate.phone_number || '').replace(/\D/g, '');
    if (!phoneNumber.trim()) {
      errors.phone_number = 'El teléfono es requerido.';
    } else if (phoneNumber.length !== 10) {
      errors.phone_number = 'Número de teléfono inválido.';
    }

    const dni = String(dataToValidate.dni || '').replace(/\D/g, '');
    if (!dni.trim()) {
      errors.dni = 'El CI es requerido.';
    } else if (dni.length !== 10) {
      errors.dni = 'Número de CI inválido.';
    }

    if (dataToValidate.birth_date && !(dataToValidate.birth_date instanceof Date)) {
      errors.birth_date = 'Fecha de nacimiento inválida.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para manejar errores del backend
  const handleBackendErrors = (error) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;

      // Si el detail es un array de objetos de validación
      if (Array.isArray(detail)) {
        const backendErrors = {};
        detail.forEach(err => {
          if (err.loc && err.msg) {
            const field = err.loc[err.loc.length - 1]; // último elemento del loc
            backendErrors[field] = err.msg;
          }
        });
        setValidationErrors(backendErrors);

        // Mostrar mensaje general
        const firstError = detail[0];
        toast.current.show({
          severity: 'error',
          summary: 'Error de validación',
          detail: firstError.msg || 'Por favor, corrige los errores en el formulario',
          life: 5000
        });
      } else if (typeof detail === 'string') {
        // Si es un string simple
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: detail,
          life: 5000
        });
      } else {
        // Si es otro tipo de objeto
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error de validación en el servidor',
          life: 5000
        });
      }
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error desconocido del servidor',
        life: 5000
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = { ...formData };

    if (!validateForm(dataToSubmit)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor, corrige los campos con errores.',
        life: 3000
      });
      return;
    }

    // Preparar datos para envío - SIEMPRE enviar todos los campos obligatorios
    const updateData = {};

    Object.keys(dataToSubmit).forEach(key => {
      const value = dataToSubmit[key];

      if (key === 'birth_date') {
        // Manejo especial para fechas
        if (value instanceof Date) {
          updateData[key] = value.toISOString().split('T')[0];
        } else {
          updateData[key] = null;
        }
      } else if (typeof value === 'string') {
        // Limpiar strings y asegurar que no estén vacíos
        const cleanValue = value.trim();
        updateData[key] = cleanValue || null;
      } else {
        updateData[key] = value;
      }
    });

    // Verificar si hay cambios comparando con datos originales
    const originalUserData = {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      dni: user.dni || '',
      birth_date: user.birth_date ? new Date(user.birth_date + 'T00:00:00') : null,
    };

    let hasChanges = false;
    Object.keys(dataToSubmit).forEach(key => {
      const currentValue = dataToSubmit[key];
      const originalValue = originalUserData[key];

      if (key === 'birth_date') {
        if (currentValue instanceof Date && originalValue instanceof Date) {
          if (currentValue.getTime() !== originalValue.getTime()) {
            hasChanges = true;
          }
        } else if (currentValue !== originalValue) {
          hasChanges = true;
        }
      } else if (typeof currentValue === 'string' && typeof originalValue === 'string') {
        if (currentValue.trim() !== originalValue.trim()) {
          hasChanges = true;
        }
      } else if (currentValue !== originalValue) {
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      toast.current.show({
        severity: 'info',
        summary: 'Sin cambios',
        detail: 'No hay datos para actualizar.',
        life: 3000
      });
      setTimeout(() => {
        navigate('/be/all-users-admin');
      }, 1000);
      return;
    }

    setLoading(true);
    try {
      const response = await authenticatedAxios.put(`/be/admin/update_user/${userId}`, updateData);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado exitosamente.',
        life: 3000
      });
      setTimeout(() => {
        navigate('/be/all-users-admin');
      }, 1000);
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);

      if (error.response?.status === 404) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'El usuario no existe o fue eliminado.',
          life: 3000
        });
        setTimeout(() => {
          navigate('/be/all-users-admin');
        }, 1000);
      } else if (error.response?.status === 422) {
        // Manejar errores de validación del backend
        handleBackendErrors(error);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: error.response?.data?.detail || 'Error desconocido',
          life: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".8s" />
        <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando datos del usuario...</p>
      </div>
    );
  }

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>No se pudo cargar el usuario.</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #E5E7EB 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <HeaderAdmin />
      <Toast ref={toast} />

      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <Card
          title={`Editar: ${user.first_name} ${user.last_name}`}
          style={{
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '1rem',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="first_name">Nombre</label>
                <InputText
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange(e, 'first_name')}
                  className={validationErrors.first_name ? 'p-invalid' : ''}
                />
                {validationErrors.first_name && <Message severity="error" text={validationErrors.first_name} />}
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="last_name">Apellido</label>
                <InputText
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange(e, 'last_name')}
                  className={validationErrors.last_name ? 'p-invalid' : ''}
                />
                {validationErrors.last_name && <Message severity="error" text={validationErrors.last_name} />}
              </div>
              <div className="p-field p-col-12">
                <label htmlFor="email">Correo</label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className={validationErrors.email ? 'p-invalid' : ''}
                />
                {validationErrors.email && <Message severity="error" text={validationErrors.email} />}
              </div>
              <div className="p-field p-col-12">
                <label htmlFor="phone_number">Teléfono</label>
                <InputMask
                  id="phone_number"
                  name="phone_number"
                  mask="999-999-9999"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange(e, 'phone_number')}
                  className={validationErrors.phone_number ? 'p-invalid' : ''}
                />
                {validationErrors.phone_number && <Message severity="error" text={validationErrors.phone_number} />}
              </div>
              <div className="p-field p-col-12">
                <label htmlFor="birth_date">Fecha de Nacimiento</label>
                <Calendar
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange(e, 'birth_date')}
                  showIcon
                  readOnlyInput
                  dateFormat="yy-mm-dd"
                  className={validationErrors.birth_date ? 'p-invalid' : ''}
                />
                {validationErrors.birth_date && <Message severity="error" text={validationErrors.birth_date} />}
              </div>
              <div className="p-field p-col-12">
                <label htmlFor="dni">CI</label>
                <InputMask
                  id="dni"
                  name="dni"
                  mask="9999999999"
                  value={formData.dni}
                  onChange={(e) => handleInputChange(e, 'dni')}
                  className={validationErrors.dni ? 'p-invalid' : ''}
                />
                {validationErrors.dni && <Message severity="error" text={validationErrors.dni} />}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button
                type="submit"
                label={loading ? 'Actualizando...' : 'Actualizar Usuario'}
                icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                className="p-button-success"
                disabled={loading || formLoading}
                style={{ flex: 1 }}
              />
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => navigate('/be/all-users-admin')}
                style={{ flex: 1 }}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};