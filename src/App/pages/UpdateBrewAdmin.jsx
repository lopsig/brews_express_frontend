import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { HeaderAdmin } from "../components/HeaderAdmin";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';


export const UpdateBrewAdmin = () => {
  const navigate = useNavigate();
  const { brewId } = useParams();
  const [brew, setBrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const authenticatedAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  useEffect(() => {
    const fetchBrew = async () => {
      try {
        const response = await authenticatedAxios.get(`/be/admin/brew/${brewId}`);
        setBrew(response.data.brew);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brew:", error.response?.data || error.message);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos de la cerveza.',
          life: 3000
        });
        setLoading(false);
      }
    };

    if (brewId) {
      fetchBrew();
    }
  }, [brewId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrew(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authenticatedAxios.put(`/be/admin/update_brew/${brewId}`, brew);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cerveza actualizada correctamente.',
        life: 3000
      });
    } catch (error) {
      console.error('Error updating brew:', error.response?.data || error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar la cerveza.',
        life: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen flex-column">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".8s" />
        <p className="mt-3 text-gray-500">Cargando cerveza...</p>
      </div>
    );
  }

  if (!brew) {
    return (
      <div className="flex justify-content-center align-items-center h-screen flex-column">
        <p className="text-xl text-gray-500">Cerveza no encontrada.</p>
        <Button label="Regresar" className="mt-4" onClick={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-column">
      <HeaderAdmin />
      <Toast ref={toast} />
      <div className="flex-grow-1 p-5 max-w-7xl mx-auto w-full">
        <div className="flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Actualizar Cerveza</h1>
          <Button
            label="Regresar"
            icon="pi pi-angle-left"
            className="p-button-secondary"
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleUpdate} className="p-fluid">
            <div className="p-grid p-formgrid p-fluid">
              <div className="p-col-12 p-md-6 mb-4">
                <label htmlFor="name" className="block text-900 font-medium mb-2">Nombre</label>
                <InputText id="name" name="name" value={brew.name || ''} onChange={handleChange} />
              </div>
              <div className="p-col-12 p-md-6 mb-4">
                <label htmlFor="style" className="block text-900 font-medium mb-2">Estilo</label>
                <InputText id="style" name="style" value={brew.style || ''} onChange={handleChange} />
              </div>
              <div className="p-col-12 p-md-6 mb-4">
                <label htmlFor="abv" className="block text-900 font-medium mb-2">ABV (%)</label>
                <InputNumber id="abv" name="abv" value={brew.abv || 0} onValueChange={(e) => setBrew(prev => ({ ...prev, abv: e.value }))} mode="decimal" minFractionDigits={2} maxFractionDigits={2} />
              </div>
              <div className="p-col-12 p-md-6 mb-4">
                <label htmlFor="price" className="block text-900 font-medium mb-2">Precio ($)</label>
                <InputNumber id="price" name="price" value={brew.price || 0} onValueChange={(e) => setBrew(prev => ({ ...prev, price: e.value }))} mode="currency" currency="USD" locale="en-US" />
              </div>
              <div className="p-col-12 mb-4">
                <label htmlFor="description" className="block text-900 font-medium mb-2">Descripción</label>
                <InputTextarea id="description" name="description" value={brew.description || ''} onChange={handleChange} rows={5} autoResize />
              </div>
            </div>
            <div className="flex justify-content-end gap-3 mt-5">
              <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-secondary" onClick={() => navigate(-1)} />
              <Button type="submit" label="Guardar Cambios" icon="pi pi-check" loading={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};