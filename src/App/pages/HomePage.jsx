import { Header } from "../components/Header.jsx";
import { Body } from "../components/Body.jsx";
import { useState } from "react";

export const HomePage = () => {

  const VerifyUser = () => {
    // Lógica para verificar el usuario
    const userRole = localStorage.getItem('role');
    if (userRole === null) {
      window.location.href = '/auth/brews_express';
    }
  }
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div>
      <VerifyUser />
      <Header onSearch={handleSearch} />
      <Body searchTerm={searchTerm} />
    </div>
  )
}

  

//   return (
//     <>
//       <Header/>
//       <Body/>

//     </>
//   );
// };
