import axios from "axios";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { InputMask } from 'primereact/inputmask';
import { HeaderAdmin } from "../components/HeaderAdmin";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Actualizar el token en cada petición
const authenticatedAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

// Interceptor para agregar el token dinámicamente
authenticatedAxios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const UpdateProfileProviderAdmin = () => {
  const navigate = useNavigate();
  const { breweryId } = useParams();
  const location = useLocation();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    name_brewery: '',
    ruc: '',
    name_comercial: '',
    city: '',
    address: '',
    contact_number: '',
    email: '',
    opening_hours: '',
    description: '',
    logo: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const breweryData = location.state?.breweryData;

    if (breweryData) {
      // Usar datos ya disponibles (optimizado)
      setBrewery(breweryData);
      setFormData({
        name_brewery: breweryData.name_brewery || '',
        ruc: breweryData.ruc || '',
        name_comercial: breweryData.name_comercial || '',
        city: breweryData.city || '',
        address: breweryData.address || '',
        contact_number: breweryData.contact_number || '',
        email: breweryData.email || '',
        opening_hours: breweryData.opening_hours || '',
        description: breweryData.description || '',
        logo: breweryData.logo || ''
      });
    } else {
      // Fallback: hacer petición si no hay datos
      const fetchBrewery = async () => {
        setFormLoading(true);
        try {
          const response = await authenticatedAxios.get(`/be/admin/brewery/${breweryId}`);
          const breweryData = response.data.brewery;

          setBrewery(breweryData);
          setFormData({
            name_brewery: breweryData.name_brewery || '',
            ruc: breweryData.ruc || '',
            name_comercial: breweryData.name_comercial || '',
            city: breweryData.city || '',
            address: breweryData.address || '',
            contact_number: breweryData.contact_number || '',
            email: breweryData.email || '',
            opening_hours: breweryData.opening_hours || '',
            description: breweryData.description || '',
            logo: breweryData.logo || ''
          });
        } catch (error) {
          console.error('Error fetching brewery:', error.response ? error.response.data : error.message);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los datos de la cervecería',
            life: 3000
          });
          navigate('/be/all-provider-admin');
        } finally {
          setFormLoading(false);
        }
      };

      fetchBrewery();
    }
  }, [breweryId, location.state, navigate]);

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

    if (!dataToValidate.name_brewery.trim()) {
      errors.name_brewery = 'El nombre de la cervecería es requerido.';
    }

    const ruc = String(dataToValidate.ruc || '').replace(/\D/g, '');
    if (!ruc.trim()) {
      errors.ruc = 'El RUC es requerido.';
    } else if (ruc.length !== 13) {
      errors.ruc = 'El RUC debe tener 13 dígitos.';
    }

    if (!dataToValidate.name_comercial.trim()) {
      errors.name_comercial = 'La razón social es requerida.';
    }

    if (!dataToValidate.city.trim()) {
      errors.city = 'La ciudad es requerida.';
    }

    if (!dataToValidate.address.trim()) {
      errors.address = 'La dirección es requerida.';
    }

    const contactNumber = String(dataToValidate.contact_number || '').replace(/\D/g, '');
    if (!contactNumber.trim()) {
      errors.contact_number = 'El número de contacto es requerido.';
    } else if (contactNumber.length !== 10) {
      errors.contact_number = 'El número de contacto debe tener 10 dígitos.';
    }

    // Validación mejorada del email
    if (!dataToValidate.email.trim()) {
      errors.email = 'El correo es requerido.';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(dataToValidate.email.trim())) {
        errors.email = 'Formato de correo inválido.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para manejar errores del backend
  const handleBackendErrors = (error) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;

      if (Array.isArray(detail)) {
        const backendErrors = {};
        detail.forEach(err => {
          if (err.loc && err.msg) {
            const field = err.loc[err.loc.length - 1];
            backendErrors[field] = err.msg;
          }
        });
        setValidationErrors(backendErrors);

        const firstError = detail[0];
        toast.current.show({
          severity: 'error',
          summary: 'Error de validación',
          detail: firstError.msg || 'Por favor, corrige los errores en el formulario',
          life: 5000
        });
      } else if (typeof detail === 'string') {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: detail,
          life: 5000
        });
      } else {
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

    // Normalizar datos antes de validar
    const dataToSubmit = { ...formData };

    // Limpiar espacios en blanco y normalizar
    Object.keys(dataToSubmit).forEach(key => {
      if (typeof dataToSubmit[key] === 'string') {
        dataToSubmit[key] = dataToSubmit[key].trim();
      }
    });

    if (!validateForm(dataToSubmit)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor, corrige los campos con errores.',
        life: 3000
      });
      return;
    }

    // Preparar datos para envío de forma más limpia
    const updateData = {};

    // Solo incluir campos que realmente han cambiado
    const originalBreweryData = {
      name_brewery: brewery.name_brewery || '',
      ruc: brewery.ruc || '',
      name_comercial: brewery.name_comercial || '',
      city: brewery.city || '',
      address: brewery.address || '',
      contact_number: brewery.contact_number || '',
      email: brewery.email || '',
      opening_hours: brewery.opening_hours || '',
      description: brewery.description || '',
      logo: brewery.logo || ''
    };

    let hasChanges = false;
    Object.keys(dataToSubmit).forEach(key => {
      const currentValue = typeof dataToSubmit[key] === 'string' ?
        dataToSubmit[key].trim() : dataToSubmit[key];
      const originalValue = typeof originalBreweryData[key] === 'string' ?
        originalBreweryData[key].trim() : originalBreweryData[key];

      if (currentValue !== originalValue) {
        updateData[key] = currentValue || null;
        hasChanges = true;
      }
    });

    // Debug: Mostrar qué campos han cambiado
    console.log('Campos que han cambiado:', updateData);
    console.log('Email original:', brewery.email);
    console.log('Email nuevo:', dataToSubmit.email);

    if (!hasChanges) {
      toast.current.show({
        severity: 'info',
        summary: 'Sin cambios',
        detail: 'No hay datos para actualizar.',
        life: 3000
      });
      setTimeout(() => {
        navigate('/be/all-provider-admin');
      }, 1000);
      return;
    }

    setLoading(true);
    try {
      // Enviar todos los campos, no solo los cambiados
      const fullUpdateData = { ...dataToSubmit };

      console.log('Datos enviados al backend:', fullUpdateData);

      const response = await authenticatedAxios.put(`/be/admin/update_brewery/${breweryId}`, fullUpdateData);

      console.log('Respuesta del backend:', response.data);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cervecería actualizada exitosamente.',
        life: 3000
      });
      setTimeout(() => {
        navigate('/be/all-provider-admin');
      }, 1000);
    } catch (error) {
      console.error('Error updating brewery:', error.response ? error.response.data : error.message);

      if (error.response?.status === 404) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'La cervecería no existe o fue eliminada.',
          life: 3000
        });
        setTimeout(() => {
          navigate('/be/all-provider-admin');
        }, 1000);
      } else if (error.response?.status === 422) {
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
        <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando datos de la cervecería...</p>
      </div>
    );
  }

  if (!brewery) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>No se pudo cargar la cervecería.</div>;
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
          title={`Editar: ${brewery.name_brewery}`}
          style={{
            width: '100%',
            maxWidth: '800px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '1rem',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="p-fluid p-formgrid p-grid">

              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="name_brewery">Nombre de la Cervecería</label>
                <InputText
                  id="name_brewery"
                  name="name_brewery"
                  value={formData.name_brewery}
                  onChange={(e) => handleInputChange(e, 'name_brewery')}
                  className={validationErrors.name_brewery ? 'p-invalid' : ''}
                />
                {validationErrors.name_brewery && <Message severity="error" text={validationErrors.name_brewery} />}
              </div>

              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="ruc">RUC</label>
                <InputMask
                  id="ruc"
                  name="ruc"
                  mask="9999999999999"
                  value={formData.ruc}
                  onChange={(e) => handleInputChange(e, 'ruc')}
                  className={validationErrors.ruc ? 'p-invalid' : ''}
                />
                {validationErrors.ruc && <Message severity="error" text={validationErrors.ruc} />}
              </div>

              <div className="p-field p-col-12">
                <label htmlFor="name_comercial">Razón Social</label>
                <InputText
                  id="name_comercial"
                  name="name_comercial"
                  value={formData.name_comercial}
                  onChange={(e) => handleInputChange(e, 'name_comercial')}
                  className={validationErrors.name_comercial ? 'p-invalid' : ''}
                />
                {validationErrors.name_comercial && <Message severity="error" text={validationErrors.name_comercial} />}
              </div>

              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="city">Ciudad</label>
                <InputText
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange(e, 'city')}
                  className={validationErrors.city ? 'p-invalid' : ''}
                />
                {validationErrors.city && <Message severity="error" text={validationErrors.city} />}
              </div>

              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="contact_number">Número de Contacto</label>
                <InputMask
                  id="contact_number"
                  name="contact_number"
                  mask="999-999-9999"
                  value={formData.contact_number}
                  onChange={(e) => handleInputChange(e, 'contact_number')}
                  className={validationErrors.contact_number ? 'p-invalid' : ''}
                />
                {validationErrors.contact_number && <Message severity="error" text={validationErrors.contact_number} />}
              </div>

              <div className="p-field p-col-12">
                <label htmlFor="email">Correo Electrónico</label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className={validationErrors.email ? 'p-invalid' : ''}
                  placeholder="ejemplo@correo.com"
                />
                {validationErrors.email && <Message severity="error" text={validationErrors.email} />}
              </div>

              <div className="p-field p-col-12">
                <label htmlFor="address">Dirección</label>
                <InputText
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className={validationErrors.address ? 'p-invalid' : ''}
                />
                {validationErrors.address && <Message severity="error" text={validationErrors.address} />}
              </div>

              <div className="p-field p-col-12">
                <label htmlFor="opening_hours">Horario de Atención</label>
                <InputText
                  id="opening_hours"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={(e) => handleInputChange(e, 'opening_hours')}
                  placeholder="Ej: Lunes a Viernes 9:00 AM - 6:00 PM"
                />
              </div>

              <div className="p-field p-col-12">
                <label htmlFor="description">Descripción</label>
                <InputTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  rows="4"
                  autoResize
                />
              </div>

              <div className="p-field p-col-12">
                <label htmlFor="logo">URL del Logo</label>
                <InputText
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={(e) => handleInputChange(e, 'logo')}
                  placeholder="https://ejemplo.com/logo.jpg"
                  className={validationErrors.logo ? 'p-invalid' : ''}
                />
                {validationErrors.logo && <Message severity="error" text={validationErrors.logo} />}

                {formData.logo && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Vista previa:</p>
                    <img
                      src={formData.logo}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button
                type="submit"
                label={loading ? 'Actualizando...' : 'Actualizar Cervecería'}
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
                onClick={() => navigate('/be/all-provider-admin')}
                style={{ flex: 1 }}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};