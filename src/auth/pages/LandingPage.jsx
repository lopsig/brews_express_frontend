
import { useState } from "react";
import { HeaderLanding } from "../components/HeaderLanding.jsx";
import { BodyLanding } from "../components/BodyLanding.jsx";


export const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
  }



  return (
    <div>
    
      <HeaderLanding onSearch={handleSearch} />
      <BodyLanding searchTerm={searchTerm} />
      {/* Footer */}
      <div className="text-center mt-6">
        <p style={{
          color: '#9CA3AF',
          fontSize: '0.75rem',
          margin: 0
        }}>
          © 2025 LopSigDev. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}