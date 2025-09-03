import React, { useState } from "react"; 
import axios from "axios";

export const RegisterPage = () => {
    // Definimos el estado para cada campo del formulario
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        dni: '',
        birth_date: '', // Para input type="date", el valor es un string "YYYY-MM-DD"
        email: '',
        password: '',
    });

    // Función para manejar los cambios en los inputs y actualizar el estado
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Enviamos los datos del estado directamente
            const response = await axios.post('http://localhost:8000/auth/register', formData);

            // Si la petición es exitosa (código 2xx), mostramos el mensaje de éxito
       
            console.log(response.data.message || 'Usuario registrado exitosamente.');

            // --- Limpiar el formulario después de un registro exitoso ---
            setFormData({
                first_name: '',
                last_name: '',
                phone_number: '',
                dni: '',
                birth_date: '',
                email: '',
                password: '',
            });

        } catch (error) {
            // Manejamos cualquier error que Axios lance (incluyendo 400 Bad Request)
            console.error("Error al registrar:", error);

            let errorMessage = 'Ocurrió un error inesperado al registrar.';

            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                console.error("Datos de error del servidor:", error.response.data);
                // Intenta obtener un mensaje de error del backend
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && typeof error.response.data === 'object') {
                    // Si el backend envía un objeto de errores (común en validaciones, ej. {"email": ["ya existe"]})
                    // Podemos iterar sobre ellos y construir un mensaje
                    errorMessage = "Error de validación:";
                    for (const key in error.response.data) {
                        if (Array.isArray(error.response.data[key])) {
                            errorMessage += `\n- ${key}: ${error.response.data[key].join(', ')}`;
                        } else {
                            errorMessage += `\n- ${key}: ${error.response.data[key]}`;
                        }
                    }
                } else if (error.response.status === 400) {
                    errorMessage = 'Solicitud incorrecta. Por favor, revisa los datos ingresados.';
                }
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta del servidor (ej. red caída)
                errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión o inténtalo más tarde.';
            } else {
                // Algo más sucedió al configurar la petición
                errorMessage = error.message;
            }

            alert(`Error de registro: ${errorMessage}`);
        }
    };

    return (
        <div>
            <h1>Register Page</h1>
            {/* Es importante usar el evento onSubmit en el form y no en el button */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="first_name" // El `name` debe coincidir con lo que espera tu backend
                        value={formData.first_name} // El valor del input viene del estado
                        onChange={handleChange} // Cuando cambia el input, actualizamos el estado
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="CI">C.I.:</label>
                    <input
                        type="text"
                        id="CI"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="birthDate">Birth Date:</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};