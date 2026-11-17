import { Link } from "react-router-dom"

function PublicNavbar(){
    return (
     <>
      <nav>
        <Link to={"/signup"}>Sign Up</Link>
        <Link to={"/login"}>Login</Link>
      </nav>
      </>
    )
}

export default PublicNavbar