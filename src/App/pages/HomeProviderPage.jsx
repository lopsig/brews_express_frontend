import { HeaderProvider } from "../components/HeaderProvider"
import { BrewsProviderPage } from "./BrewsProviderPage"
import { useState } from "react"

export const HomeProviderPage = () => {
const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div>
      <HeaderProvider onSearch={handleSearch} />
      <BrewsProviderPage searchTerm={searchTerm} />
    </div>
  )
}
