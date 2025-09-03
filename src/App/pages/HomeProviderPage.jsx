import { HeaderProvider } from "../components/HeaderProvider"
import { BrewsProviderPage } from "./BrewsProviderPage"
import { useState } from "react"

export const HomeProviderPage = () => {
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
      <HeaderProvider onSearch={handleSearch} />
      <BrewsProviderPage searchTerm={searchTerm} />
    </div>
  )
}
