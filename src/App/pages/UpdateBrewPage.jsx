import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"

export const UpdateBrewPage = () => {
  const navigate = useNavigate()
  const {brewId} = useParams()
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
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBrew = async () => {
      if (!token || !brewId) {
        console.error('No token or brewId found');
        return
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`http://127.0.0.1:8000/brews/${brewId}`, config)
        setBrew(response.data.brew)
        setFormData({
          name: response.data.brew.name,
          style: response.data.brew.style,
          abv: response.data.brew.abv,
          srm: response.data.brew.srm,
          ibu: response.data.brew.ibu,
          ml: response.data.brew.ml,
          price: response.data.brew.price,
          description: response.data.brew.description,
        })
      } catch (error) {
        console.error('Error fetching brew:', error.response ? error.response.data : error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBrew()
  }, [token, brewId])

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
      await axios.put(`http://127.0.0.1:8000/brews/update_brew/${brewId}`, formData, config);
      alert('Producto actualizado con éxito')
    } catch (error) {
      console.error('Error updating brew:', error.response ? error.response.data : error.message)
      alert('Error al actualizar la cerveza.')
    }
    navigate('/be/home-provider');
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      return;
    }
    const data = new FormData();
    data.append('image', imageFile);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
      const response = await axios.put(`http://127.0.0.1:8000/brews/update_brew_image/${brewId}`, data, config);
      // alert('Imagen actualizada con éxito');
    } catch (error) {
      console.error('Error updating brew image:', error.response ? error.response.data : error.message);
      alert('Error al actualizar la imagen de la cerveza.');
    }
    navigate('/be/home-provider');
  };

  const handleTextImageSubmit = (e) => {
    e.preventDefault();
    handleTextSubmit(e)
    handleImageSubmit(e);
  };

  if (loading) { return <div>Cargando...</div>; }
  if (!brew) { return <div>No se encontró la cerveza.</div>; }

  return (
    <div>
      <h1>Actualizar Cerveza</h1>
      <button onClick={() => navigate(-1)} >Regresar</button>
      <button onClick={() => navigate('/be/home-provider')}>Home</button>

      <form onSubmit={handleTextSubmit}>
        <div>
          <label>
            Nombre:
            <input type="text" name="name" value={formData.name} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            Estilo:
            <input type="text" name="style" value={formData.style} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            ABV:
            <input type="text" name="abv" value={formData.abv} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            SRM:
            <input type="text" name="srm" value={formData.srm} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            IBU:
            <input type="text" name="ibu" value={formData.ibu} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            ML:
            <input type="text" name="ml" value={formData.ml} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            Precio:
            <input type="text" name="price" value={formData.price} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            Descripción:
            <textarea name="description" value={formData.description} onChange={handleTextChange} />
          </label>
        </div>
      </form>

      <hr />

      <form onSubmit={handleImageSubmit}>
        <div>
          <div>
            <h2>Imagen Actual</h2>
            {brew.image && <img src={brew.image} alt="Imagen de la cerveza" />}
          </div>
          <div>
          <label>Seleccion Nueva Imagen:</label>
            <input type="file"  onChange={handleImageChange} />
          </div>
        <button onClick={handleTextImageSubmit}>Actualizar</button>
        </div>
      </form>


    </div>
  )
}
