import { Link } from "react-router-dom"

function PublicNavbar(){
    return (
     <>
      <nav>
        <Link to={"/"}>Sign Up</Link>
        <Link to={"/login"}>Login</Link>
      </nav>
      </>
    )
}

export default PublicNavbar