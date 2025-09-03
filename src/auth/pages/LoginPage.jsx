
import axios from "axios";
export const LoginPage = () => {
  const VerifyUser = () => {
    // Lógica para verificar el usuario
    const userRole = localStorage.getItem('role');
    if (userRole === 'admin') {
      window.location.href = '/be/home-admin';
    } else if (userRole === 'provider') {
      window.location.href = '/be/home-provider';
    } else if (userRole === 'user') {
      window.location.href = '/be';
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {


      const response = await axios.post('http://localhost:8000/auth/login', {
        email: email,
        password: password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('id_user', response.data.id_user);

      

      const userRole = response.data.role;
      if (userRole === 'admin') {
        window.location.href = '/be/home-admin';
      } else if (userRole === 'provider') {
        window.location.href = '/be/home-provider';
      } else if (userRole === 'user') {
        window.location.href = '/be';
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
      <VerifyUser />
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






// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export const LoginPage = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     try {
//       const response = await axios.post('http://localhost:8000/auth/login', {
//         email: email,
//         password: password,
//       });

//       // Crear el objeto usuario con toda la información necesaria
//       const userData = {
//         role: response.data.role,
//         id_user: response.data.id_user,
//         email: email, // También puedes incluir el email si lo necesitas
//         // Agrega aquí cualquier otra información del usuario que necesites
//       };

//       // Usar el método login del contexto
//       login(userData, response.data.token);

//       // Guardar también el role e id_user por separado si los necesitas en otros lugares
//       localStorage.setItem('role', response.data.role);
//       localStorage.setItem('id_user', response.data.id_user);

//       // Navegar según el rol del usuario
//       const userRole = response.data.role;
//       if (userRole === 'admin') {
//         navigate('/be/home-admin');
//       } else if (userRole === 'provider') {
//         navigate('/be/home-provider');
//       } else if (userRole === 'user') {
//         navigate('/be/home'); // Cambié '/be' por '/be/home'
//       }

//       console.log('Login successful', response);
//       console.log(response.data.message);

//     } catch (error) {
//       console.error('Login failed', error);

//       const errorMessage = (
//         error.response &&
//         error.response.data &&
//         error.response.data.detail
//       ) ? error.response.data.detail : 'Invalid email or password';

//       alert(errorMessage);
//     }
//   }

//   return (
//     <div>
//       <h1>Login Page</h1>
//       <p>This is the login page.</p>
//       <p>Please enter your credentials to log in.</p>

//       <form onSubmit={e => handleLogin(e)}>
//         <div>
//           <label>Correo </label>
//           <input type="email" name={'email'} placeholder="Ingresa tu correo" required />
//         </div>
//         <div>
//           <label>Contraseña </label>
//           <input type="password" name={'password'} placeholder="Ingresa tu contraseña" required />
//         </div>

//         <button type="submit">Iniciar Sesión</button>
//       </form>
//     </div>
//   )
// }