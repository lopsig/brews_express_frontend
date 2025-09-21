// import { HeaderAdmin } from "../components/HeaderAdmin";
// import { useNavigate } from "react-router-dom";


// export const HomeAdminPage = () => {

//   const navigate = useNavigate();

//   return (
//     <>
    
//       <HeaderAdmin />
//       <div>
//       <button onClick={() => navigate("/be/all-users-admin")}>Todos los Usuarios</button>
//       </div>
//       <div>
//         <button onClick={() => navigate("/be/all-provider-admin")}>Todas las Cervecerías</button>
//       </div>

//     </>
//   )
// }



import { HeaderAdmin } from "../components/HeaderAdmin";
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // O el tema que prefieras
import 'primeicons/primeicons.css';

export const HomeAdminPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#F3F4F6' // Un fondo suave para un aspecto limpio
    }}>
      <HeaderAdmin />

      <div style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Card
          title="Panel de Administración"
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <Button
              label="Todos los Usuarios"
              icon="pi pi-users"
              className="p-button-secondary p-button-outlined"
              style={{ padding: '1rem' }}
              onClick={() => navigate("/be/all-users-admin")}
            />
            <Button
              label="Todas las Cervecerías"
              icon="pi pi-building"
              className="p-button-secondary p-button-outlined"
              style={{ padding: '1rem' }}
              onClick={() => navigate("/be/all-provider-admin")}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};