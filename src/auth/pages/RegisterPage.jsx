import axios from "axios";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;
    const phone_number = e.target.phone_number.value;
    const dni = e.target.dni.value;
    const birth_date = e.target.birth_date.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    formData.append('first_name', first_name)
    formData.append('last_name', last_name)
    formData.append('phone_number',phone_number)
    formData.append('dni', dni)
    formData.append('birth_date', birth_date)
    formData.append('email', email)
    formData.append('password', password)

    const dataUser = Object.fromEntries(formData.entries());

    const response = await axios.post('http://localhost:8000/auth/register', dataUser)
    console.log(response.data.message);
    navigate("/auth/login")
    console.log(dataUser);
  }
  

  return (
    <div>
      <h1>Registrate</h1>
      <form onSubmit={(e) => registerUser(e)} >
        <div>
          <label>Nombre </label>
          <input type="text" name="first_name" placeholder="Nombre" required/>
        </div>
        <div>
          <label>Apellido </label>
          <input type="text" name="last_name" placeholder="Apellido" required />
        </div>
        <div>
          <label>Celular </label>
          <input type="number" name="phone_number" placeholder="Celular" required/>
        </div>
        <div>
          <label>C.I </label>
          <input type="number" name="dni" placeholder="Cédula de Identidad" required/>
        </div>
        <div>
          <label>Fecha de Nacimiento </label>
          <input type="date" name="birth_date" required/>
        </div>
        <div>
          <label>Correo </label>
          <input type="email" name="email" placeholder="Correo" required/>
        </div>
        <div>
          <label>Contraseña </label>
          <input type="password" name="password" placeholder="Contraseña" required/>
        </div>
        <div>
          <label>Confirmar Contraseña </label>
          <input type="password" placeholder="Contraseña" required/>
        </div>

        <button type="submit">Registrate</button>

      </form>
    </div>
  )
}











//////////////////////////////////////////////////////////


// import axios from "axios";
// import { useNavigate } from "react-router-dom";



// export const RegisterPage = () => {

//   const navigate = useNavigate();
  


//   const registerUser = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const data = Object.fromEntries(formData.entries());
    
//     const response = await axios.post('http://localhost:8000/auth/register', data)
//     navigate("/auth/login")
//     console.log(response.data.message);
// }


//   return (
//     <div>
//       <h1>Register Page</h1>
//       <form onSubmit={(event) => registerUser(event)}>
//         <div>
//           <label>Nombre</label>
//           <input type="text" name="first_name" placeholder="Nombre" required />
//         </div>
//         <div>
//           <label>Last Name</label>
//           <input type="text" name="last_name" placeholder="Apellido" required />
//         </div>

//         <div>
//           <label htmlFor="phone">Phone Number:</label>
//           <input type="tel" id="phone" name="phone_number" required />
//         </div>


//         <div>
//           <label htmlFor="CI">C.I.:</label>
//           <input type="text" id="CI" name="dni" required />
//         </div>

//         <div>
//           <label htmlFor="birthDate">Birth Date:</label>
//           <input type="date" id="birthDate" name="birth_date" required />
//         </div>


//         <div>
//           <label htmlFor="email">Email:</label>
//           <input type="email" id="email" name="email" required />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input type="password" id="password" name="password" required />
//         </div>
//         <button type="submit">Register</button>
//       </form>

//     </div>
//   );
// }






