
import { useState } from "react";
import { HeaderLanding } from "../components/HeaderLanding.jsx";
import { BodyLanding } from "../components/BodyLanding.jsx";


export const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

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

  return (
    <div>
      <VerifyUser />
      <HeaderLanding onSearch={handleSearch} />
      <BodyLanding searchTerm={searchTerm} />
    </div>
  )
}