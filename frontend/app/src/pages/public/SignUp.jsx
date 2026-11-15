import { useState } from "react"
import PublicNavbar from "../../components/PublicNavbar"
import { SignUp } from "../../services/authService"

function SignUpPage(){
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
    return(
        <>
          <PublicNavbar />
          <div>
            <div>
                <label>
                   First Name <input id="firstName" value={firstName} onChange={e=> setFirstName(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Last Name <input id="lastName" value={lastName} onChange={e=> setLastName(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                     Email <input type="email" id="email" value={email} onChange={e=> setEmail(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    Username <input type="text" id="username" value={username} onChange={e=>setUsername(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    Password <input type="password"  value={password} onChange={e=> setPassword(e.target.value)} id="password" /> 
                </label>
            </div>
            <div>
                <label>
                    Confirm Password <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} id="confirmPassword"/>
                </label>
            </div>
            <div>
                <button disabled={passwordValid()} onClick={()=> SignUp(data)}>Sign Up</button>
            </div>
          </div>
        </>
    )
}

export default SignUpPage