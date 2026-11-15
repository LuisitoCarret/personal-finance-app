import { Link } from "react-router-dom";

function PrivateNavbar(){
    return(
        <>
        <nav>
            <Link to='/home-transaction'>Home</Link>
            <Link to='/history'>Transactions History</Link>
            <Link to='/about'>About</Link>
        </nav>
        </>
    )
}

export default PrivateNavbar