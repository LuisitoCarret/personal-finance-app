import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useContext } from "react";
import { AuthContext } from "../pages/AuthContext";


function PrivateNavbar(){
    const { logout } = useContext(AuthContext);    
    const navigate = useNavigate();

    const confirmLogout = async ()=>{
        const request = await logoutUser();
        console.log(request);
        logout();
        return navigate("/login");
    }

    return(
        <>
        <nav>
            <Link to='/home-transaction'>Home</Link>
            <Link to='/history'>Transactions History</Link>
            <button onClick={confirmLogout}>Logout</button>
        </nav>
        </>
    )
}

export default PrivateNavbar