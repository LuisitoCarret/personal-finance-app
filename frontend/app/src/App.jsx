import { Navigate, Route,Routes } from "react-router-dom" 
import PrivateRoutes from "./pages/private/PrivateRoutes"
import PublicRoutes from "./pages/public/PublicRoutes"
import { useContext } from "react"
import { AuthContext } from "./pages/AuthContext"

function App(){
    const { status } = useContext(AuthContext);
    return(
        <>
        <Routes>
            {
                status === 'authenticated' ? <Route path="/*" element={<PrivateRoutes />}></Route> :
                <Route path="/*" element={<PublicRoutes />}></Route>
            }
            <Route path="*" element={<Navigate to="/singup" replace />}></Route>
        </Routes>
        </>
    )
}

export default App