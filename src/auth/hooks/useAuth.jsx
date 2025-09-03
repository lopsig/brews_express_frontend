import { useState } from "react";


const useAuth= () => {

  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id_user');
    
    
    
    setToken(null);

  }
  
  return { token, logout };
};

export default useAuth;




