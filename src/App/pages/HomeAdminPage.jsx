import { HeaderAdmin } from "../components/HeaderAdmin";
import { useNavigate } from "react-router-dom";


export const HomeAdminPage = () => {
  const VerifyUser = () => {
    // Lógica para verificar el usuario
    const userRole = localStorage.getItem('role');
    if (userRole === null) {
      window.location.href = '/auth/brews_express';
    }
  }
  const navigate = useNavigate();

  return (
    <>
      <VerifyUser />
      <HeaderAdmin />
      <div>
      <button onClick={() => navigate("/be/all-users-admin")}>Todos los Usuarios</button>
      </div>
      <div>
        <button onClick={() => navigate("/be/all-provider-admin")}>Todas las Cervecerías</button>
      </div>

    </>
  )
}
