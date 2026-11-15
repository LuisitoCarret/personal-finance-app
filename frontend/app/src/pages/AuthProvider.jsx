import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }){
    const [status,setStatus] = useState('no-authenticated');

    const login = () => {setStatus('authenticated')};
    const logout = () => {setStatus('no-authenticated')};

    return (
        <AuthContext value={{status,login,logout}}>
         { children }
        </AuthContext>
    )
}