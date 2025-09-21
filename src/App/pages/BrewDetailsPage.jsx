import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';

export const BrewDetailsPage = () => {
  const { brewId } = useParams();
  const navigate = useNavigate();
  const [brew, setBrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrewDetails = async () => {
      try {
        // Endpoint para obtener una cerveza por su ID (necesitarás crear este endpoint en tu backend)
        const response = await axios.get(`http://127.0.0.1:8000/be/brew/${brewId}`);
        setBrew(response.data.brew);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles de la cerveza. Por favor, intenta de nuevo.');
        setLoading(false);
        console.error(err);
      }
    };

    if (brewId) {
      fetchBrewDetails();
    } else {
      setError('ID de cerveza no proporcionado.');
      setLoading(false);
    }
  }, [brewId]);

  const header = (
    <div style={{
      position: 'relative',
      borderRadius: '12px 12px 0 0',
      overflow: 'hidden'
    }}>
      {brew && brew.image ? (
        <img
          alt={brew.name}
          src={brew.image}
          style={{
            width: '100%',
            height: '350px',
            objectFit: 'cover',
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '350px',
          background: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px 12px 0 0'
        }}>
          <i className="pi pi-image" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '600px', borderRadius: '12px' }}>
          <Skeleton width="100%" height="350px" className="mb-3" />
          <Skeleton width="80%" height="2rem" className="mb-2" />
          <Skeleton width="60%" height="1.5rem" className="mb-4" />
          <Skeleton width="100%" height="150px" />
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="p-4"><Message severity="error" text={error} /></div>;
  }

  if (!brew) {
    return <div className="p-4"><Message severity="warn" text="Cerveza no encontrada." /></div>;
  }

  return (
    <div className="p-4 flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Card
        title={
          <div className="text-center" style={{ color: '#1F2937', fontWeight: 'bold' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{brew.name}</h1>
            <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>{brew.brewery_name || 'Cervecería Desconocida'}</p>
          </div>
        }
        header={header}
        style={{
          width: '90%',
          maxWidth: '800px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}
      >
        <div className="p-fluid">
          <p style={{ color: '#4B5563', fontSize: '1.1rem', lineHeight: '1.7' }}>
            {brew.description || 'Sin descripción disponible.'}
          </p>
          <div className="grid mt-4">
            <div className="col-12 md:col-6">
              <ul className="list-none p-0 m-0 text-lg">
                <li className="mb-2"><span className="font-semibold" style={{ color: '#374151' }}>Estilo:</span> {brew.style}</li>
                <li className="mb-2"><span className="font-semibold" style={{ color: '#374151' }}>ABV:</span> {brew.abv}%</li>
                <li className="mb-2"><span className="font-semibold" style={{ color: '#374151' }}>IBU:</span> {brew.ibu}</li>
              </ul>
            </div>
            <div className="col-12 md:col-6">
              <ul className="list-none p-0 m-0 text-lg">
                <li className="mb-2"><span className="font-semibold" style={{ color: '#374151' }}>SRM:</span> {brew.srm}</li>
                <li className="mb-2"><span className="font-semibold" style={{ color: '#374151' }}>Volumen:</span> {brew.ml}ml</li>
                <li className="mb-2"><span className="font-semibold" style={{ color: '#374151' }}>Precio:</span> ${brew.price}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-5 text-center">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            className="p-button-secondary"
            onClick={() => navigate(-1)}
          />
        </div>
      </Card>
    </div>
  );
};