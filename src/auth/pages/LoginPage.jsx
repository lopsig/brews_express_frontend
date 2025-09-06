
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {


      const response = await axios.post('http://localhost:8000/auth/login', {
        email: email,
        password: password,
      });

      //Datos del usuario para el contexto
      const userData = {
        id_user: response.data.id_user,
        role: response.data.role,
        email: response.data.email,
      };

      // Usar funcion Login del AuthContext
      login(userData, response.data.token);

      // Redirigir segun el rol
      const userRole = response.data.role;
      if (userRole === 'admin') {
        navigate('/be/home-admin',{ replace: true });
      } else if (userRole === 'provider') {
        navigate('/be/home-provider',{ replace: true });
      } else if (userRole === 'user') {
        navigate('/be/home',{ replace: true });
      }

      console.log('Login successful', response);
      console.log(response.data.message);
      

    } catch (error) {
      console.error('Login failed', error);

      const errorMessage = (
        error.response &&
        error.response.data &&
        error.response.data.detail
      ) ? error.response.data.detail : 'Invalid email or password';


      alert(errorMessage);

    }

  }
  return (
    <>
      <div>
        <h1>Login Page</h1>
        <p>This is the login page.</p>
        <p>Please enter your credentials to log in.</p>

      <form onSubmit={e => handleLogin(e)}>
        <div>
          <label>Correo </label>
          <input type="email" name={'email'} placeholder="Ingresa tu correo" required />
        </div>
        <div>
          <label>Contraseña </label>
          <input type="password" name={'password'} placeholder="Ingresa tu contraseña" required />
        </div>

        <button type="submit">Iniciar Sesión</button>
      </form>
      </div>
    </>

  )
}
