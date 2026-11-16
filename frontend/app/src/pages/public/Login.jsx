import { useContext, useState } from "react";
import Navbar from "../../components/PublicNavbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { loginUser } from "../../services/authService";

function Login(){
  const [username,setUserName] = useState('');
  const [password,setPassword] = useState('');

  const fieldsValid = () =>{
    if (username === '' || password === ''){
        return true  
    }else{
        return false
    }
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const isLogin = async () =>{
      const data ={
        "username": username,
        "password": password
      }
      const condition = await loginUser(data);
      if (condition){ 
        login();
        return navigate("/Home");
      }else{
        return condition.data
      }
  };

  return(
    <>
    <Navbar />
    <div>
      <div>
          <label>
              Username <input type="text" value={username} onChange={e => setUserName(e.target.value)} id="username" />
          </label>
      </div>
      <div>
          <label>
              Password <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="password" />
          </label>
      </div>
      <button disabled={fieldsValid()} onClick={isLogin}>Log in</button>
    </div>
    </>
  )
}

export default Login