import { useContext, useState } from "react";
import PublicNavbar from "../../components/PublicNavbar"
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { loginUser } from "../../services/authService";
import "./Login.style.css";

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
       console.log("1. Respuesta de loginUser:", condition);
      if (condition){ 
        console.log("2. Entrando a login() y navegando a /Home...");
        login();
        return navigate("/Home");
      }else{
         console.log("3. No entró al if. Motivo:", condition);
        return condition.data
      }
  };

  return(
    <div className="login-page">
      <PublicNavbar />
      <main className="login-layout">
        <section className="login-intro" aria-label="Personal finance overview">
          <div className="login-intro__content">
            <span className="login-eyebrow">YOUR MONEY, IN BALANCE</span>
            <h1>Make room for what matters.</h1>
            <p>Understand your spending, build better habits, and feel more confident about your finances.</p>
          </div>
          <div className="login-insight" aria-hidden="true">
            <div className="login-insight__top">
              <span>Monthly overview</span>
              <span className="login-insight__status"><i /> On track</span>
            </div>
            <div className="login-insight__amount">$2,840.00</div>
            <div className="login-insight__caption">Available this month</div>
            <div className="login-chart">
              <span style={{ height: "36%" }} />
              <span style={{ height: "56%" }} />
              <span style={{ height: "44%" }} />
              <span style={{ height: "72%" }} />
              <span style={{ height: "58%" }} />
              <span style={{ height: "88%" }} />
              <span style={{ height: "66%" }} />
            </div>
            <div className="login-chart__labels"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div>
          </div>
          <span className="login-decoration login-decoration--one" />
          <span className="login-decoration login-decoration--two" />
        </section>

        <section className="login-panel">
          <div className="login-card">
            <div className="login-card__mark" aria-hidden="true">F</div>
            <span className="login-eyebrow login-eyebrow--dark">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p className="login-card__description">Pick up where you left off.</p>

            <div className="login-fields">
              <div className="login-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                  id="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              <div className="login-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="login-submit" disabled={fieldsValid()} onClick={isLogin}>Log in <span aria-hidden="true">→</span></button>
            <p className="login-signup">New here? <Link to="/signup">Create an account</Link></p>
          </div>
          <p className="login-footer">Your financial journey starts with a single step.</p>
        </section>
      </main>
    </div>
  )
}

export default Login