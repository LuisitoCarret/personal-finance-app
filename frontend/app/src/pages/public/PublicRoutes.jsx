import { Routes,Route, Navigate } from "react-router-dom"
import Login from "./Login"
import SignUpPage from "./SignUp"

function PublicRoutes(){
    return (
        <>
        <Routes>
            <Route path="*" element={<Navigate to="/login" replace />}></Route>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<Login />} />
        </Routes>
        </>
    )
}

export default PublicRoutes