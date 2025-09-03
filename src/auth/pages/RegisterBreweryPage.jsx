import axios from "axios"
import { useNavigate } from "react-router-dom"

export const RegisterBreweryPage = () => {
  const navigate = useNavigate();
  const handleRegisterBrewery = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {

      const response = await axios.post('http://localhost:8000/breweries/register_brewery', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data.message);
      navigate("/auth/login");
    } catch (error) {
      console.error("Error registering brewery:", error.response.data);
      const errorMessage = error.response.data.detail || 'Error desconocido al registrar la cervecería.';

      alert(errorMessage);
    }
  };

  return (
    <div>
      <h1>Registrate como Proveedor</h1>
      <form onSubmit={handleRegisterBrewery}>
        <div>
          <label>Nombre de Cervecería:</label>
          <input type="text" name="name_brewery" placeholder="Nombre de Cervecería" required />
        </div>
        <div>
          <label>RUC:</label>
          <input type="number" name="ruc" placeholder="RUC" required />
        </div>
        <div>
          <label>Razón Social:</label>
          <input type="text" name="name_comercial" placeholder="Razón Social" required />
        </div>
        <div>
          <label>Ciudad:</label>
          <input type="text" name="city" placeholder="Ciudad" required />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" name="address" placeholder="Dirección" required />
        </div>
        <div>
          <label>Número de Contacto:</label>
          <input type="number" name="contact_number" placeholder="Número de Contacto" required />
        </div>
        <div>
          <label>Horario de Atención:</label>
          <input type="text" name="opening_hours" placeholder="Horario de Atención" required />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="description" placeholder="Descripción" required />
        </div>
        <div>
          <label>Logo:</label>
          <input type="file" name="logo" required />
        </div>
        <div>
          <label>Correo:</label>
          <input type="email" name="email" placeholder="Correo" required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" placeholder="Contraseña" required />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input type="password" placeholder="Confirmar Contraseña" required />
        </div>

        <div>
        <button type="submit">Registar</button>
        </div>


        <button onClick={() => navigate("/auth/register_prov")}>Registar Proveedor</button>
      </form>
    </div>
  );
}
