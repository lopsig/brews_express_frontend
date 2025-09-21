import { Header } from "../components/Header.jsx";
import { Body } from "../components/Body.jsx";
import { useState } from "react";

export const HomePage = () => {

  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div>
      <Header onSearch={handleSearch} />
      <Body searchTerm={searchTerm} />
    </div>
  )
}

  

