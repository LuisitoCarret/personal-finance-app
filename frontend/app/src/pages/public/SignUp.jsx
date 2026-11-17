import { useState } from "react"
import PublicNavbar from "../../components/PublicNavbar"
import { Link, useNavigate } from "react-router-dom"
import { SignUp } from "../../services/authService"
import "./Login.style.css"
import "./SignUp.style.css"

function SignUpPage(){
    const navigate = useNavigate()
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const passwordValid = () =>{
        if(password === '' && confirmPassword === ''){
            return true
        }else if (password === confirmPassword){
            return false
        }else{
            return true
        }
    }

    const data = {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "username": username,
        "password": password
    }

    const handleSignUp = async () => {
        const result = await SignUp(data)
        if (result === "User created successfully") {
            navigate("/login")
        }
    }

    return(
        <div className="login-page login-page--signup">
          <PublicNavbar />
          <main className="login-layout">
            <section className="login-intro" aria-label="Personal finance overview">
              <div className="login-intro__content">
                <span className="login-eyebrow">A FRESH START FOR YOUR FINANCES</span>
                <h1>Small steps. Stronger financial habits.</h1>
                <p>Get a clearer view of your money and make confident choices, one day at a time.</p>
              </div>
              <div className="login-insight" aria-hidden="true">
                <div className="login-insight__top">
                  <span>Your progress</span>
                  <span className="login-insight__status"><i /> Looking good</span>
                </div>
                <div className="login-insight__amount">One step at a time</div>
                <div className="login-insight__caption">Build a money routine that works for you</div>
                <div className="login-chart">
                  <span style={{ height: "36%" }} />
                  <span style={{ height: "56%" }} />
                  <span style={{ height: "44%" }} />
                  <span style={{ height: "72%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "88%" }} />
                  <span style={{ height: "66%" }} />
                </div>
                <div className="login-chart__labels"><span>PLAN</span><span>SAVE</span><span>GROW</span><span>REPEAT</span></div>
              </div>
              <span className="login-decoration login-decoration--one" />
              <span className="login-decoration login-decoration--two" />
            </section>

            <section className="login-panel">
              <div className="login-card">
                <div className="login-card__mark" aria-hidden="true">F</div>
                <span className="login-eyebrow login-eyebrow--dark">GET STARTED</span>
                <h2>Create your account</h2>
                <p className="login-card__description">A few details and you are ready to go.</p>

                <div className="login-fields signup-fields">
                  <div className="login-field">
                    <label htmlFor="firstName">First name</label>
                    <input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" autoComplete="given-name" />
                  </div>
                  <div className="login-field">
                    <label htmlFor="lastName">Last name</label>
                    <input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" autoComplete="family-name" />
                  </div>
                  <div className="login-field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                  </div>
                  <div className="login-field">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" autoComplete="username" />
                  </div>
                  <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="password" placeholder="Create a password" autoComplete="new-password" />
                  </div>
                  <div className="login-field">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} id="confirmPassword" placeholder="Repeat your password" autoComplete="new-password" />
                  </div>
                </div>

                <button className="login-submit" disabled={passwordValid()} onClick={handleSignUp}>Create account <span aria-hidden="true">→</span></button>
                <p className="login-signup">Already have an account? <Link to="/login">Log in</Link></p>
              </div>
              <p className="login-footer">Your financial journey starts with a single step.</p>
            </section>
          </main>
        </div>
    )
}

export default SignUpPage